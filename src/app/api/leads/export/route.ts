import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLeadsForExport, parseLeadData } from "@/services/leads.service";
import { getFormById, getFormsWithSchemaByUserId } from "@/services/forms.service";
import { createAuditLog } from "@/services/audit.service";
function getWatermarkText(userName: string): string {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `Exported by ${userName} on ${date}`;
}

/** Column order from forms.schema_json; row data from leads.data_json. */
export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { searchParams } = new URL(req.url);
  const formId = searchParams.get("formId") || undefined;
  const format = (searchParams.get("format") || "csv").toLowerCase();
  const isExcel = format === "xlsx" || format === "excel";

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });
  const userName = user?.name ?? session.username;
  const watermarkText = getWatermarkText(userName);

  const leads = await getLeadsForExport(session.userId, formId);

  let orderedFields: { storageKey: string; label: string }[];
  if (formId) {
    const form = await getFormById(formId, session.userId);
    const schema = form?.schema ? { fields: form.schema.fields ?? [] } : { fields: [] };
    orderedFields = schema.fields
      .filter((f) => f.type !== "hidden" && f.type !== "recaptcha")
      .map((f) => ({ storageKey: f.name ?? f.id, label: f.label || f.id }));
  } else {
    const formsWithSchema = await getFormsWithSchemaByUserId(session.userId);
    const byStorageKey = new Map<string, string>();
    for (const form of formsWithSchema) {
      for (const field of form.schema?.fields ?? []) {
        if (field.type === "hidden" || field.type === "recaptcha") continue;
        const key = field.name ?? field.id;
        if (!byStorageKey.has(key)) byStorageKey.set(key, field.label || field.id);
      }
    }
    orderedFields = Array.from(byStorageKey.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([storageKey, label]) => ({ storageKey, label }));
  }

  const fieldHeaders = orderedFields.map((f) => f.label);
  const headers: string[] = ["Lead ID", "Form", ...fieldHeaders, "Created At"];

  const rows: Record<string, string>[] = leads.map((l) => {
    const data = parseLeadData(l.dataJson) as Record<string, string>;
    const row: Record<string, string> = {
      "Lead ID": l.id,
      "Form": l.form?.name ?? "",
    };
    for (const field of orderedFields) {
      const val = data[field.storageKey];
      row[field.label] = val != null ? String(val).trim() : "";
    }
    row["Created At"] = l.createdAt.toISOString();
    return row;
  });

  const dateStr = new Date().toISOString().slice(0, 10);

  if (isExcel) {
    const wb = XLSX.utils.book_new();
    const wsData: (string | number)[][] = [
      [watermarkText],
      [],
      headers,
      ...rows.map((r) => headers.map((h) => r[h] ?? "")),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    await createAuditLog(session.userId, "lead_export", {
      format: "xlsx",
      formId: formId ?? null,
      count: leads.length,
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="leads-${dateStr}.xlsx"`,
      },
    });
  }

  const csv = [
    `"${watermarkText.replace(/"/g, '""')}"`,
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  await createAuditLog(session.userId, "lead_export", {
    format: "csv",
    formId: formId ?? null,
    count: leads.length,
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${dateStr}.csv"`,
    },
  });
}
