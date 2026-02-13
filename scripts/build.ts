/**
 * Build script: runs prisma generate, optionally db push + plan quotas, then next build.
 * Set SKIP_DB_PUSH=1 (e.g. in Vercel env) to skip prisma db push and update-plan-quotas
 * for faster deploys when the schema hasn't changed.
 */
import { execSync } from "child_process";

const skipDbPush = /^1|true|yes$/i.test(process.env.SKIP_DB_PUSH ?? "");

function run(cmd: string, env?: Record<string, string>) {
  execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });
}

run("tsx scripts/check-db-url.ts");
run("prisma generate");

if (!skipDbPush) {
  run("prisma db push");
  run("tsx scripts/update-plan-quotas.ts");
} else {
  console.log("Skipping prisma db push and update-plan-quotas (SKIP_DB_PUSH is set).");
}

run("next build --webpack");
