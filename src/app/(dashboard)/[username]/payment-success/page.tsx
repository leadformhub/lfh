"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const username = params.username as string;
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const orderId = searchParams.get("razorpay_order_id") ?? searchParams.get("order_id");
    const paymentId = searchParams.get("razorpay_payment_id") ?? searchParams.get("payment_id");
    const signature = searchParams.get("razorpay_signature") ?? searchParams.get("signature");

    const oid = orderId;
    const pid = paymentId;
    const sig = signature;

    if (!oid || !pid || !sig) {
      setStatus("error");
      setError("Missing payment details. If you completed payment, contact support.");
      return;
    }

    (async () => {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          razorpay_order_id: oid,
          razorpay_payment_id: pid,
          razorpay_signature: sig,
        }),
      });
      const data = await verifyRes.json();
      if (verifyRes.ok && data.success) {
        setStatus("success");
        window.location.href = `/${username}/dashboard`;
        return;
      }
      setStatus("error");
      setError(data.error ?? "Payment verification failed.");
    })();
  }, [searchParams, username]);

  if (status === "verifying") {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--foreground-muted)]">Verifying your payment…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--color-success)]">Payment successful. Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <p className="text-[var(--color-danger)] mb-4">{error}</p>
      <Link
        href={`/${username}/dashboard`}
        className="text-[var(--color-accent)] underline"
      >
        Back to dashboard
      </Link>
      {" · "}
      <Link
        href={`/${username}/pricing`}
        className="text-[var(--color-accent)] underline"
      >
        Pricing
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center">
          <p className="text-[var(--foreground-muted)]">Loading…</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
