import { getVerifiedSessionCached } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Access denied | LeadFormHub",
  description: "You don't have permission to access this page.",
};

export default async function AccessDeniedPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getVerifiedSessionCached();
  const { username } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) {
    redirect("/login");
  }

  return (
    <div className="min-w-0 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <section
          className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] p-6 sm:p-8"
          aria-labelledby="access-denied-heading"
        >
          <h1 id="access-denied-heading" className="text-lg font-semibold text-[var(--foreground-heading)] sm:text-xl">
            Access denied
          </h1>
          <p className="mt-2 text-[var(--foreground-muted)]">
            You don&apos;t have permission to access this page.
          </p>
          <Link
            href={`/${username}/dashboard`}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            Back to Dashboard
          </Link>
        </section>
      </div>
    </div>
  );
}
