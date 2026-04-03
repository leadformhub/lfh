/**
 * Razorpay server-side only. Never expose key_secret to frontend.
 * Frontend uses RAZORPAY_KEY_ID only (via /api/payments/config).
 */

import Razorpay from "razorpay";
import crypto from "crypto";
import { getSuperAdminRazorpaySettings } from "@/lib/super-admin-razorpay-store";

async function getRazorpayCredentials(): Promise<{ keyId: string; keySecret: string } | null> {
  const settings = await getSuperAdminRazorpaySettings();
  if (!settings?.enabled) return null;
  const keyId = settings.keyId?.trim();
  const keySecret = settings.keySecret?.trim();
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

export async function getRazorpayKeyId(): Promise<string | null> {
  const credentials = await getRazorpayCredentials();
  return credentials?.keyId ?? null;
}

export async function isRazorpayConfigured(): Promise<boolean> {
  return Boolean(await getRazorpayCredentials());
}

let instance: Razorpay | null = null;
let instanceKeyId: string | null = null;
let instanceKeySecret: string | null = null;

async function getRazorpay(): Promise<Razorpay | null> {
  const credentials = await getRazorpayCredentials();
  if (!credentials) return null;
  if (!instance || instanceKeyId !== credentials.keyId || instanceKeySecret !== credentials.keySecret) {
    instance = new Razorpay({ key_id: credentials.keyId, key_secret: credentials.keySecret });
    instanceKeyId = credentials.keyId;
    instanceKeySecret = credentials.keySecret;
  }
  return instance;
}

export interface CreateOrderParams {
  amount: number; // paise
  currency?: string;
  receipt: string;
}

export async function createRazorpayOrder(params: CreateOrderParams): Promise<{ id: string; amount: number; currency: string } | null> {
  const rz = await getRazorpay();
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
): Promise<boolean> {
  return verifyRazorpaySignatureInternal(orderId, paymentId, signature);
}

async function verifyRazorpaySignatureInternal(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const credentials = await getRazorpayCredentials();
  if (!credentials?.keySecret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", credentials.keySecret)
    .update(body)
    .digest("hex");
  return expected === signature;
}
