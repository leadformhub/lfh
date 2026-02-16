"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getPlanFeatureBullets } from "@/lib/plan-features";

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      order_id: string;
      name: string;
      description: string;
      handler?: (res: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => void;
      callback_url?: string;
    }) => { open: () => void };
  }
}

const PLANS = [
  { plan: "pro" as const, name: "Pro", actualPrice: "₹2,999", price: "₹299/month" },
  { plan: "business" as const, name: "Business", actualPrice: "₹9,999", price: "₹999/month" },
];

export function UpgradePlanCard({
  currentPlan,
  razorpayKeyId,
}: {
  currentPlan: string;
  razorpayKeyId: string | null;
}) {
  const pathname = usePathname();
  const username = pathname?.split("/")[1] ?? "";
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadRazorpayScript(): Promise<boolean> {
    if (typeof window !== "undefined" && window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleUpgrade(plan: "pro" | "business") {
    if (!razorpayKeyId) {
      setError("Payments not configured.");
      return;
    }
    setError("");
    setLoading(plan);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create order");
        return;
      }
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Could not load payment gateway.");
        return;
      }
      const rz = new window.Razorpay({
        key: razorpayKeyId,
        amount: data.amount,
        order_id: data.orderId,
        name: "LeadFormHub",
        description: `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
        callback_url: typeof window !== "undefined" && username
          ? `${window.location.origin}/${username}/payment-success`
          : undefined,
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // Full reload so the new session cookie (with updated plan) is used
            window.location.reload();
          } else {
            setError(verifyData.error ?? "Payment verification failed");
          }
        },
      });
      rz.open();
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  if (!razorpayKeyId) {
    return (
      <div className="rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 p-4 text-sm text-[var(--color-warning)]">
        Payment gateway is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--foreground-heading)]">Upgrade Plan</h2>
      {error && <p className="text-base text-[var(--color-danger)]">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((p) => {
          const isCurrent = currentPlan === p.plan;
          const isHigher =
            (p.plan === "pro" && currentPlan === "free") ||
            (p.plan === "business" && (currentPlan === "free" || currentPlan === "pro"));
          return (
            <div
              key={p.plan}
              className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4"
            >
              <div className="font-semibold text-[var(--foreground-heading)]">{p.name}</div>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="text-lg font-medium text-[var(--foreground-muted)] line-through">{p.actualPrice}</span>
                <span className="text-2xl font-bold text-[var(--foreground-heading)]">{p.price}</span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
                {getPlanFeatureBullets(p.plan).map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <span className="text-[var(--color-success)]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent || !isHigher || loading !== null}
                onClick={() => handleUpgrade(p.plan)}
                className="btn-base mt-3 w-full rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--neutral-300)] disabled:text-[var(--neutral-500)]"
              >
                {isCurrent ? "Current plan" : !isHigher ? "Downgrade" : loading === p.plan ? "Opening…" : "Pay with Razorpay"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
