import { NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getFormsWithSchemaByUserId } from "@/services/forms.service";

/** Returns forms with parsed schema (for leads table column definitions). */
export async function GET() {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const forms = await getFormsWithSchemaByUserId(session.userId);
  return NextResponse.json({
    forms: forms.map((f) => ({
      id: f.id,
      name: f.name,
      schema: f.schema,
    })),
  });
}
