/**
 * Razorpay server-side only. Never expose key_secret to frontend.
 * Frontend uses RAZORPAY_KEY_ID only (via /api/payments/config).
 */

import Razorpay from "razorpay";
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export function getRazorpayKeyId(): string | null {
  return keyId || null;
}

export function isRazorpayConfigured(): boolean {
  return !!(keyId && keySecret);
}

let instance: Razorpay | null = null;

function getRazorpay(): Razorpay | null {
  if (!keyId || !keySecret) return null;
  if (!instance) {
    instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return instance;
}

export interface CreateOrderParams {
  amount: number; // paise
  currency?: string;
  receipt: string;
}

export async function createRazorpayOrder(params: CreateOrderParams): Promise<{ id: string; amount: number; currency: string } | null> {
  const rz = getRazorpay();
  if (!rz) return null;
  const order = await rz.orders.create({
    amount: params.amount,
    currency: params.currency || "INR",
    receipt: params.receipt,
  });
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!keySecret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
  return expected === signature;
}
