import { prisma } from "@/lib/db";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import type { UserPlan } from "@prisma/client";

// Amount in paise (INR)
export const PLAN_AMOUNTS: Record<string, number> = {
  pro: 29900,      // ₹299
  business: 99900, // ₹999
};

export async function createOrder(userId: string, plan: string): Promise<{ orderId: string; amount: number; currency: string } | null> {
  const amount = PLAN_AMOUNTS[plan];
  if (!amount || plan === "free") return null;
  const order = await createRazorpayOrder({
    amount,
    currency: "INR",
    receipt: `plan_${plan}_${userId.slice(0, 8)}_${Date.now()}`,
  });
  if (!order) return null;
  await prisma.payment.create({
    data: {
      userId,
      razorpayOrderId: order.id,
      plan,
      amount: order.amount,
      currency: order.currency,
      status: "created",
    },
  });
  return { orderId: order.id, amount: order.amount, currency: order.currency };
}

export async function verifyAndFulfill(
  userId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ success: boolean; plan?: UserPlan; error?: string }> {
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId, userId },
  });
  if (!payment) return { success: false, error: "Order not found" };
  if (payment.status === "captured") return { success: true, plan: payment.plan as UserPlan };
  const valid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!valid) return { success: false, error: "Invalid signature" };
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayPaymentId, status: "captured", appliedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { plan: payment.plan as UserPlan },
    }),
  ]);
  const planRecord = await prisma.plan.findFirst({ where: { name: payment.plan } });
  if (planRecord) {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    await prisma.subscription.upsert({
      where: { userId },
      create: { userId, planId: planRecord.id, monthStart, otpUsedThisMonth: 0 },
      update: { planId: planRecord.id, monthStart, otpUsedThisMonth: 0 },
    });
  }
  return { success: true, plan: payment.plan as UserPlan };
}

const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, business: 2 };

/** Sync user plan from their latest captured payment that we haven't applied yet (e.g. if verify never ran). Returns current plan from DB. Does not re-apply payments already applied (so manual downgrade to free stays). */
export async function syncPlanFromCapturedPayment(userId: string): Promise<UserPlan> {
  const latest = await prisma.payment.findFirst({
    where: { userId, status: "captured", appliedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, plan: true },
  });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  if (!user) return "free";
  const paidRank = latest ? PLAN_RANK[latest.plan] ?? 0 : 0;
  const currentRank = PLAN_RANK[user.plan] ?? 0;
  if (paidRank <= currentRank) return user.plan as UserPlan;

  const paidPlan = latest!.plan as UserPlan;
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: latest!.id },
      data: { appliedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { plan: paidPlan },
    }),
  ]);
  const planRecord = await prisma.plan.findFirst({ where: { name: paidPlan } });
  if (planRecord) {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    await prisma.subscription.upsert({
      where: { userId },
      create: { userId, planId: planRecord.id, monthStart, otpUsedThisMonth: 0 },
      update: { planId: planRecord.id, monthStart, otpUsedThisMonth: 0 },
    });
  }
  return paidPlan;
}
