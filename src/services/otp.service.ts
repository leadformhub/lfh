import { prisma } from "@/lib/db";
import { getOtpLimitForPlan } from "@/lib/plan-quotas";
import { sendOtpViaFast2SMS } from "@/lib/sms";
import { sendOtpEmail } from "@/lib/email";
import { canUseOtp } from "@/lib/plans";
import type { UserPlan } from "@prisma/client";
import { parseFormSchema } from "@/lib/form-schema";

const OTP_EXPIRY_MINUTES = 5;

function getMaxOtpPerPhonePerHour(): number {
  const v = process.env.OTP_MAX_PER_PHONE_PER_HOUR;
  if (v !== undefined && v !== "") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 1) return n;
  }
  return process.env.NODE_ENV === "development" ? 10 : 3;
}

function getMaxOtpPerEmailPerHour(): number {
  const v = process.env.OTP_MAX_PER_EMAIL_PER_HOUR;
  if (v !== undefined && v !== "") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 1) return n;
  }
  return process.env.NODE_ENV === "development" ? 10 : 3;
}

/** Minimum seconds between two OTP requests for the same phone/email on the same form. 0 = no minimum. */
function getMinOtpIntervalSeconds(): number {
  const v = process.env.OTP_MIN_INTERVAL_SECONDS;
  if (v !== undefined && v !== "") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 0) return n;
  }
  return 60;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getOtpUsageForUser(userId: string): Promise<{ used: number; monthStart: Date }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { used: 0, monthStart: new Date() };

  const plan = await prisma.plan.findFirst({ where: { name: user.plan } });
  if (!plan) return { used: 0, monthStart: new Date() };

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub || sub.monthStart < monthStart) {
    sub = await prisma.subscription.upsert({
      where: { userId },
      create: { userId, planId: plan.id, monthStart, otpUsedThisMonth: 0 },
      update: { monthStart, otpUsedThisMonth: 0, planId: plan.id },
    });
  }
  return { used: sub.otpUsedThisMonth, monthStart: sub.monthStart };
}

export async function checkOtpLimit(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, message: "User not found" };
  const plan = user.plan as UserPlan;
  if (!canUseOtp(plan)) return { allowed: false, message: "OTP not available on your plan" };
  const limit = await getOtpLimitForPlan(plan);
  if (limit === null) return { allowed: false, message: "OTP not available on your plan" };
  const { used } = await getOtpUsageForUser(userId);
  if (used >= limit) return { allowed: false, message: "Monthly OTP limit exceeded. Please upgrade." };
  return { allowed: true };
}

export async function countRecentOtpsForPhone(formId: string, phone: string): Promise<number> {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  return prisma.otpVerification.count({
    where: { formId, phone, createdAt: { gte: since } },
  });
}

export async function createAndSendOtp(formId: string, userId: string, phone: string) {
  const limitCheck = await checkOtpLimit(userId);
  if (!limitCheck.allowed) return { success: false, message: limitCheck.message };

  const minIntervalSec = getMinOtpIntervalSeconds();
  if (minIntervalSec > 0) {
    const last = await prisma.otpVerification.findFirst({
      where: { formId, phone },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (last) {
      const elapsed = (Date.now() - last.createdAt.getTime()) / 1000;
      if (elapsed < minIntervalSec) {
        const waitSec = Math.ceil(minIntervalSec - elapsed);
        return { success: false, message: `Please wait ${waitSec} seconds before requesting another OTP.` };
      }
    }
  }

  const count = await countRecentOtpsForPhone(formId, phone);
  const maxPerHour = getMaxOtpPerPhonePerHour();
  if (count >= maxPerHour) {
    return { success: false, message: "Too many OTP requests. Try again later." };
  }

  const form = await prisma.form.findFirst({ where: { id: formId, userId } });
  if (!form) return { success: false, message: "Form not found" };
  const schema = parseFormSchema(form.schemaJson);
  if (!schema.settings?.mobileOtpEnabled) {
    return { success: false, message: "OTP not enabled for this form" };
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpVerification.create({
    data: { formId, phone, otp, expiresAt },
  });

  const result = await sendOtpViaFast2SMS(phone, otp);

  await prisma.smsLog.create({
    data: { formId, phone, status: result.success ? "sent" : "failed" },
  });

  if (result.success) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const plan = user ? await prisma.plan.findFirst({ where: { name: user.plan } }) : null;
    if (plan) {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, planId: plan.id, monthStart, otpUsedThisMonth: 1 },
        update: { otpUsedThisMonth: { increment: 1 } },
      });
    }
  }

  return { success: result.success, message: result.message };
}

export async function verifyOtp(formId: string, phone: string, otp: string): Promise<boolean> {
  const record = await prisma.otpVerification.findFirst({
    where: { formId, phone, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.otp !== otp) return false;
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verifiedAt: new Date() },
  });
  return true;
}

export async function isPhoneVerifiedForSubmission(formId: string, phone: string): Promise<boolean> {
  const record = await prisma.otpVerification.findFirst({
    where: { formId, phone },
    orderBy: { createdAt: "desc" },
  });
  return !!record?.verifiedAt;
}

// --- Email OTP ---

export async function countRecentOtpsForEmail(formId: string, email: string): Promise<number> {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  return prisma.emailOtpVerification.count({
    where: { formId, email: email.toLowerCase().trim(), createdAt: { gte: since } },
  });
}

export async function createAndSendEmailOtp(formId: string, userId: string, email: string) {
  try {
    const limitCheck = await checkOtpLimit(userId);
    if (!limitCheck.allowed) return { success: false, message: limitCheck.message };

    const normalized = email.toLowerCase().trim();
    const minIntervalSec = getMinOtpIntervalSeconds();
    if (minIntervalSec > 0) {
      const last = await prisma.emailOtpVerification.findFirst({
        where: { formId, email: normalized },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });
      if (last) {
        const elapsed = (Date.now() - last.createdAt.getTime()) / 1000;
        if (elapsed < minIntervalSec) {
          const waitSec = Math.ceil(minIntervalSec - elapsed);
          return { success: false, message: `Please wait ${waitSec} seconds before requesting another OTP.` };
        }
      }
    }

  const count = await countRecentOtpsForEmail(formId, normalized);
  const maxPerHour = getMaxOtpPerEmailPerHour();
  if (count >= maxPerHour) {
    return { success: false, message: "Too many OTP requests. Try again later." };
  }

    const form = await prisma.form.findFirst({ where: { id: formId, userId } });
    if (!form) return { success: false, message: "Form not found" };
    const schema = parseFormSchema(form.schemaJson);
    if (!schema.settings?.emailOtpEnabled) {
      return { success: false, message: "Email OTP not enabled for this form" };
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.emailOtpVerification.create({
      data: { formId, email: normalized, otp, expiresAt },
    });

    let sent = await sendOtpEmail(normalized, otp);
    if (!sent && process.env.NODE_ENV === "development") {
      console.log("[DEV] Email OTP (send failed; use this to test):", { email: normalized, otp });
      sent = true;
    }

    if (sent) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const plan = user ? await prisma.plan.findFirst({ where: { name: user.plan } }) : null;
        if (plan) {
          const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          await prisma.subscription.upsert({
            where: { userId },
            create: { userId, planId: plan.id, monthStart, otpUsedThisMonth: 1 },
            update: { otpUsedThisMonth: { increment: 1 } },
          });
        }
      } catch (usageErr) {
        console.error("[otp.service] Subscription upsert failed (OTP was still sent):", usageErr);
      }
    }

    return { success: sent, message: sent ? "OTP sent" : "Failed to send OTP email" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[otp.service] createAndSendEmailOtp:", e);
    if (msg.includes("doesn't exist") || msg.includes("Unknown table")) {
      return { success: false, message: "Database not ready for email OTP. Run: npx prisma db push" };
    }
    return { success: false, message: msg };
  }
}

export async function verifyEmailOtp(formId: string, email: string, otp: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();
  const record = await prisma.emailOtpVerification.findFirst({
    where: { formId, email: normalized, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.otp !== otp) return false;
  await prisma.emailOtpVerification.update({
    where: { id: record.id },
    data: { verifiedAt: new Date() },
  });
  return true;
}

export async function isEmailVerifiedForSubmission(formId: string, email: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();
  const record = await prisma.emailOtpVerification.findFirst({
    where: { formId, email: normalized },
    orderBy: { createdAt: "desc" },
  });
  return !!record?.verifiedAt;
}
