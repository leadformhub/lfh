import Link from "next/link";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container size="narrow" className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="btn-base inline-flex min-h-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              Go to home
            </Link>
            <Link
              href="/features"
              className="btn-base inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-transparent px-6 text-base font-medium text-[var(--foreground-heading)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="btn-base inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-transparent px-6 text-base font-medium text-[var(--foreground-heading)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              Pricing
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
