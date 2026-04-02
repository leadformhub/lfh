import { NextRequest, NextResponse } from "next/server";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  type DashboardDetailType,
  getSuperAdminDashboardDetails,
} from "@/lib/super-admin-dashboard";

const VALID_TYPES: DashboardDetailType[] = [
  "today_forms",
  "today_users",
  "free_users",
  "premium_users",
];

export async function GET(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const typeRaw = new URL(req.url).searchParams.get("type")?.trim() || "";
  if (!VALID_TYPES.includes(typeRaw as DashboardDetailType)) {
    return NextResponse.json({ error: "Invalid type." }, { status: 400 });
  }

  try {
    const payload = await getSuperAdminDashboardDetails(typeRaw as DashboardDetailType);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Failed to load details." }, { status: 500 });
  }
}
