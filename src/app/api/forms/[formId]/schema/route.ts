import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { updateFormSchema } from "@/services/forms.service";
import type { FormSchema } from "@/lib/form-schema";
import { z } from "zod";

const fieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const schemaSchema = z.object({
  fields: z.array(fieldSchema),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { formId } = await params;
  const parsed = schemaSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid schema", details: parsed.error.flatten() }, { status: 400 });
  }
  const schema = parsed.data as FormSchema;
  const form = await updateFormSchema(formId, session.userId, schema);
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  revalidatePath(`/f/${formId}`);
  return NextResponse.json({ ok: true, formId: form.id });
}
