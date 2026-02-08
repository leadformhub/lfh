import { NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const forms = await prisma.form.findMany({
    where: { userId: session.userId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ forms });
}
