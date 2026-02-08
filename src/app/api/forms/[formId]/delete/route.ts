import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { deleteForm } from "@/services/forms.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { formId } = await params;
  const result = await deleteForm(formId, session.userId);
  if (!result) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
