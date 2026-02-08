import { prisma } from "@/lib/db";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import type { UserPlan } from "@prisma/client";

// Amount in paise (INR)
export const PLAN_AMOUNTS: Record<string, number> = {
  pro: 49900,      // ₹499
  business: 199900, // ₹1999
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
      data: { razorpayPaymentId, status: "captured" },
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
