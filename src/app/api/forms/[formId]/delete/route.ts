import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { deleteForm } from "@/services/forms.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const auth = await getVerifiedSessionOrResponse();
  if ("response" in auth) return auth.response;
  const session = auth.session;
  const { formId } = await params;
  const deleted = await deleteForm(formId, session.userId);
  if (!deleted) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
