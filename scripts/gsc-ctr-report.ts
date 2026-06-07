/**
 * Weekly GSC CTR report from Search Console Performance export (.xlsx).
 * Place export in repo root: leadformhub.com-Performance-on-Search-YYYY-MM-DD.xlsx
 *
 * Target: 2%+ sitewide CTR (~3× baseline ~0.47%).
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const CTR_TARGET = 0.02;
const ROOT = path.resolve(__dirname, "..");
const PARSER = path.join(__dirname, "gsc-parse.py");

function findGscExport(): string | null {
  const files = fs.readdirSync(ROOT).filter((f) => f.includes("Performance-on-Search") && f.endsWith(".xlsx"));
  if (files.length === 0) return null;
  files.sort();
  return path.join(ROOT, files[files.length - 1]!);
}

function runPythonReport(xlsxPath: string): string {
  return execSync(`python "${PARSER}" "${xlsxPath}"`, { encoding: "utf-8", cwd: ROOT }).trim();
}

function main(): void {
  const xlsx = findGscExport();
  if (!xlsx) {
    console.error("No GSC export found. Download Performance report from Search Console");
    console.error("and save as leadformhub.com-Performance-on-Search-YYYY-MM-DD.xlsx in repo root.");
    process.exit(1);
  }

  console.log("\nLeadFormHub — GSC CTR weekly report");
  console.log(`Source: ${path.basename(xlsx)}\n`);

  const data = JSON.parse(runPythonReport(xlsx)) as {
    clicks: number;
    impr: number;
    ctr: number;
    near: { q: string; impr: number; clicks: number; pos: number; ctr: number }[];
    zero_ctr: { url: string; impr: number; pos: number }[];
  };

  const ctrPct = (data.ctr * 100).toFixed(2);
  const targetPct = (CTR_TARGET * 100).toFixed(0);
  const gap = CTR_TARGET - data.ctr;
  const clicksNeeded = Math.ceil(data.impr * CTR_TARGET - data.clicks);

  console.log(`Sitewide: ${data.clicks.toFixed(0)} clicks / ${data.impr.toFixed(0)} impressions`);
  console.log(`CTR: ${ctrPct}%  (target: ${targetPct}%+)`);
  if (data.ctr >= CTR_TARGET) {
    console.log("✓ Target met");
  } else {
    console.log(`→ Need ~${Math.max(0, clicksNeeded)} more clicks at current impressions to hit ${targetPct}%`);
    console.log(`→ Gap: ${(gap * 100).toFixed(2)} percentage points`);
  }

  console.log("\n--- Top queries (pos 5–15, optimize titles/meta) ---");
  for (const row of data.near) {
    console.log(`  pos ${row.pos.toFixed(1)} | ${row.impr.toFixed(0)} impr | ${row.clicks.toFixed(0)} clicks | ${row.q}`);
  }

  console.log("\n--- High-impression pages with 0 clicks ---");
  for (const row of data.zero_ctr) {
    console.log(`  pos ${row.pos.toFixed(1)} | ${row.impr.toFixed(0)} impr | ${row.url}`);
  }

  console.log("\nNext: export fresh GSC data weekly, run npm run seo:ctr-report, update titles on zero-CTR URLs.\n");
}

main();
