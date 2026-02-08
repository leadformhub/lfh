/**
 * One-off script to test form submission for a form by id.
 * Usage: npx tsx scripts/test-form-submit.ts [formId]
 * Requires: .env with DATABASE_URL, dev server running on localhost:3000
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) {
      const value = m[2].replace(/^["']|["']$/g, "").trim();
      if (!process.env[m[1]]) process.env[m[1]] = value;
    }
  }
}

loadEnv();

const prisma = new PrismaClient();
const BASE = "http://localhost:3000";

function parseSchema(schemaJson: string): { fields: { id: string; type: string; label: string }[]; settings?: { status?: string } } {
  try {
    const s = JSON.parse(schemaJson) as { fields?: { id: string; type: string; label: string }[]; settings?: { status?: string } };
    return {
      fields: Array.isArray(s?.fields) ? s.fields : [],
      settings: s?.settings,
    };
  } catch {
    return { fields: [] };
  }
}

function sampleValue(fieldId: string, type: string): string {
  const id = (fieldId || "").toLowerCase();
  if (type === "email" || id.includes("email")) return "test-form@example.com";
  if (type === "phone" || id.includes("phone")) return "+15551234567";
  if (type === "textarea" || id.includes("message")) return "Test message from script.";
  if (id.includes("name")) return "Test User";
  return "test value";
}

async function main() {
  const formId = process.argv[2];
  if (!formId) {
    console.error("Usage: npx tsx scripts/test-form-submit.ts <formId>");
    process.exit(1);
  }

  console.log("Fetching form by id:", formId);

  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: { user: { select: { username: true } } },
  });

  if (!form) {
    console.error("Form not found for id:", formId);
    process.exit(1);
  }

  const schema = parseSchema(form.schemaJson);
  const status = schema.settings?.status ?? "PUBLIC";
  if (status !== "PUBLIC") {
    console.error("Form is not PUBLIC. Status:", status);
    process.exit(1);
  }

  const data: Record<string, string> = {};
  for (const f of schema.fields) {
    if (f.type === "recaptcha" || f.type === "hidden") continue;
    data[f.id] = sampleValue(f.id, f.type);
  }

  console.log("Form name:", form.name);
  console.log("Owner:", form.user?.username);
  console.log("Submitting data:", JSON.stringify(data, null, 2));

  const res = await fetch(`${BASE}/api/leads/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formId: form.id,
      data,
      utm_source: "test-script",
      recaptchaToken: "dev-bypass", // only accepted when NODE_ENV=development
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Submit failed:", res.status, body);
    process.exit(1);
  }

  console.log("Submit OK. Lead ID:", body.id);

  const count = await prisma.lead.count({ where: { formId: form.id } });
  console.log("Total leads for this form:", count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
