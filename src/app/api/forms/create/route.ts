import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { canUseEmailAlertOnLead } from "@/lib/plan-features";
import { canUseOtp, canCreateForm, type PlanKey } from "@/lib/plans";
import { createForm } from "@/services/forms.service";
import { DEFAULT_FORM_SCHEMA } from "@/lib/form-schema";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  status: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  description: z.string().max(2000).optional(),
  formType: z.string().max(50).optional(),
  emailAlertEnabled: z.boolean().optional(),
  emailOtpEnabled: z.boolean().optional(),
  mobileOtpEnabled: z.boolean().optional(),
  emailAutomationEnabled: z.boolean().optional(),
  redirectUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  try {
    const formsCount = await prisma.form.count({ where: { userId: session.userId } });
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { plan: true } });
    const plan = (user?.plan ?? "free") as PlanKey;
    if (!canCreateForm(plan, formsCount)) {
      return NextResponse.json(
        { error: "Form limit reached for your plan. Please upgrade to create more forms." },
        { status: 403 }
      );
    }
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }
    const data = parsed.data;
    const canUseEmailAlert = canUseEmailAlertOnLead(plan);
    const canUseOtpVerification = canUseOtp(plan);
    const schema = {
      ...DEFAULT_FORM_SCHEMA,
      fields: [],
      settings: {
        status: data.status ?? "PUBLIC",
        description: data.description || undefined,
        redirectUrl: data.redirectUrl || undefined,
        emailAlertEnabled: canUseEmailAlert ? (data.emailAlertEnabled ?? false) : false,
        emailOtpEnabled: canUseOtpVerification ? (data.emailOtpEnabled ?? false) : false,
        mobileOtpEnabled: canUseOtpVerification ? (data.mobileOtpEnabled ?? false) : false,
      },
    };
    const form = await createForm({
      userId: session.userId,
      name: data.name,
      schema,
    });
    return NextResponse.json({ form: { id: form.id, name: form.name } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create form";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
