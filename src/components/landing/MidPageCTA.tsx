import Link from "next/link";
import { Container } from "@/components/ui/Container";

/** Mid-page CTA — placed after 3–4 sections to capture interest. Attractive gradient + clear actions. */
export function MidPageCTA() {
  return (
    <section
      className="section-padding relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{
        backgroundColor: "#0f172a",
        color: "#f8fafc",
      }}
    >
      {/* Primary gradient — explicit so it always shows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 35%, #1d4ed8 70%, #2563eb 100%)",
        }}
        aria-hidden
      />
      {/* Soft glow orbs */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.5) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(37, 99, 235, 0.4) 0%, transparent 50%)",
        }}
        aria-hidden
      />
      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      {/* Decorative blurs */}
      <div
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#94a3b8" }}
          >
            Start in minutes
          </p>
          <h2
            className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: "#ffffff" }}
          >
            Ready To Capture Verified Leads?
          </h2>
          <p
            className="mt-6 text-lg leading-relaxed sm:text-xl"
            style={{ color: "#e2e8f0" }}
          >
            Create your branded hub, add forms, and turn on OTP when you need it. No credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="btn-base group inline-flex h-14 min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl sm:w-auto"
              style={{ color: "#111827" }}
            >
              Get Started Free
              <svg
                className="size-5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="btn-base inline-flex h-14 min-h-[44px] w-full items-center justify-center rounded-xl border-2 border-white/50 px-8 text-base font-semibold backdrop-blur-sm transition-colors hover:border-white hover:bg-white/15 sm:w-auto"
              style={{ color: "#ffffff" }}
            >
              View Pricing
            </Link>
          </div>
          <p
            className="mt-6 text-base text-white"
          >
            Free plan: 3 forms, 50 leads/month. Upgrade anytime.
          </p>
          <p
            className="mt-2 text-xs text-black"
          >
            Secure sign-up · Your data is protected with SSL encryption.
          </p>
        </div>
      </Container>
    </section>
  );
}
