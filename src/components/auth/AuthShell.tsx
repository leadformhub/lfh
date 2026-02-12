"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AUTH_DARK_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

export default function AuthShell({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthDark = AUTH_DARK_PATHS.some((p) => pathname === p);

  if (isAuthDark) {
    return (
      <div className="auth-dark relative flex min-h-dvh min-h-screen w-full flex-col overflow-hidden bg-black">
        {/* Form-inspired background: clearly visible white on black */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden
        >
          {/* Soft top glow */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 100% 60% at 50% -15%, rgba(255,255,255,0.35) 0%, transparent 55%)",
            }}
          />
          {/* Horizontal form-field lines — visible */}
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                180deg,
                transparent 0px,
                transparent 52px,
                rgba(255,255,255,0.2) 52px,
                rgba(255,255,255,0.2) 53px
              )`,
            }}
          />
          {/* Vertical form-column line */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
              backgroundSize: "2px 100%",
              backgroundPosition: "50% 0",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Large "form card" outline — visible */}
          <div
            className="absolute left-1/2 top-1/2 w-[min(440px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-white/[0.22]"
            style={{ height: "min(520px, 75vh)" }}
          />
          {/* Rounded rectangles = input shapes — visible borders */}
          <div className="absolute left-[12%] top-[18%] h-12 w-[min(280px,70%)] rounded-xl border-2 border-white/[0.2]" />
          <div className="absolute right-[15%] top-[28%] h-12 w-[min(240px,55%)] rounded-xl border-2 border-white/[0.18]" />
          <div className="absolute bottom-[22%] left-[18%] h-11 w-[min(200px,50%)] rounded-xl border-2 border-white/[0.18]" />
          <div className="absolute bottom-[32%] right-[12%] h-14 w-[min(260px,60%)] rounded-xl border-2 border-white/[0.2]" />
          <div className="absolute left-1/2 top-[72%] h-10 w-[min(180px,45%)] -translate-x-1/2 rounded-lg border-2 border-white/[0.16]" />
          {/* Checkbox-like squares */}
          <div className="absolute right-[22%] top-[42%] h-5 w-5 rounded border-2 border-white/[0.25]" />
          <div className="absolute left-[20%] bottom-[38%] h-4 w-4 rounded border-2 border-white/[0.22]" />
        </div>

        <header className="relative z-10 flex h-12 shrink-0 items-center px-4 sm:h-14 sm:px-6 md:px-8">
          <nav aria-label="Auth navigation">
            <Link
              href="/"
              className="text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:text-base"
            >
              &lt; Home
            </Link>
          </nav>
        </header>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="w-full max-w-[420px] sm:max-w-[480px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh min-h-screen w-full flex-col overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        aria-hidden
        style={{
          background: `
            linear-gradient(165deg, #f0f4f8 0%, #e8eef4 25%, #f8fafc 50%, #e2e8f0 100%),
            linear-gradient(180deg, rgba(37, 99, 235, 0.03) 0%, transparent 40%, transparent 60%, rgba(37, 99, 235, 0.02) 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 50%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-1/2 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(241,245,249,0.9) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
        <nav className="flex items-center gap-6" aria-label="Auth navigation">
          <Link
            href="/"
            className="text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            About
          </Link>
        </nav>
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight transition-opacity hover:opacity-90"
          style={{ color: "var(--header-logo)" }}
          aria-label="LeadFormHub home"
        >
          LeadFormHub
        </Link>
      </header>
      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto px-4 py-4 sm:px-6 sm:py-6">
        <div className="w-full max-w-[400px] sm:max-w-[420px]">
          {children}
        </div>
      </main>
    </div>
  );
}
