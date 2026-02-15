import Link from "next/link";
import Image from "next/image";
import { getInviteByToken } from "@/services/team.service";
import { getVerifiedSessionCached } from "@/lib/auth";
import { AcceptInviteClient } from "./AcceptInviteClient";

export const metadata = {
  title: "Accept team invitation | LeadFormHub",
  description: "Accept an invitation to join a team on LeadFormHub.",
};

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const invite = token ? await getInviteByToken(token) : null;
  let session: Awaited<ReturnType<typeof getVerifiedSessionCached>> = null;
  try {
    session = await getVerifiedSessionCached();
  } catch {
    // not logged in or not verified
  }

  if (!token) {
    return (
      <article className="w-full max-w-full overflow-x-hidden" aria-label="Invalid invite">
        <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
          <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:mt-8 sm:text-3xl">
          Invalid link
        </h1>
        <p className="mt-2.5 text-center text-base text-white/80">This invitation link is missing or invalid.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-14"
        >
          Go to login
        </Link>
      </article>
    );
  }

  if (!invite) {
    return (
      <article className="w-full max-w-full overflow-x-hidden" aria-label="Invalid invite">
        <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
          <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:mt-8 sm:text-3xl">
          Invalid or expired
        </h1>
        <p className="mt-2.5 text-center text-base text-white/80">This invitation link is invalid or has expired.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-14"
        >
          Go to login
        </Link>
      </article>
    );
  }

  if (invite.expired) {
    return (
      <article className="w-full max-w-full overflow-x-hidden" aria-label="Expired invite">
        <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
          <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:mt-8 sm:text-3xl">
          Invitation expired
        </h1>
        <p className="mt-2.5 text-center text-base text-white/80">This invitation has expired. Ask the team owner to send a new invite.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-14"
        >
          Go to login
        </Link>
      </article>
    );
  }

  const inviteLine = invite.inviterName
    ? `${invite.inviterName} has invited you to join ${invite.ownerName}'s team on LeadFormHub.`
    : `${invite.ownerName} has invited you to join their team on LeadFormHub.`;

  if (session) {
    return (
      <article className="w-full max-w-full overflow-x-hidden" aria-label="Accept team invitation">
        <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
          <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight !text-white sm:mt-8 sm:text-3xl">
          You&apos;re invited
        </h1>
        <p className="mt-2.5 text-center text-base text-white/80">
          {inviteLine}
        </p>
        <AcceptInviteClient token={token} />
      </article>
    );
  }

  const loginUrl = `/login?invite=${encodeURIComponent(token)}`;
  const signupUrl = `/signup?invite=${encodeURIComponent(token)}`;

  return (
    <article className="w-full max-w-full overflow-x-hidden" aria-label="Accept team invitation">
      <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
        <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight !text-white sm:mt-8 sm:text-3xl">
        You&apos;re invited
      </h1>
      <p className="mt-2.5 text-center text-base text-white/80">
        {inviteLine}
      </p>

      <div className="mt-6 rounded-xl border border-[#333] bg-[#1a1a1a] p-4 sm:p-5" role="region" aria-label="How to accept">
        <p className="text-sm font-medium text-white/90">Use this email to continue</p>
        <p className="mt-1 font-mono text-sm text-white/80">{invite.email}</p>
        <p className="mt-3 text-sm text-white/70">
          <strong className="text-white/90">Already have an account?</strong> Log in with the email above.{" "}
          <strong className="text-white/90">New to LeadFormHub?</strong> Sign up with that same email to join the team.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={loginUrl}
          className="inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-14"
        >
          Log in to accept
        </Link>
        <Link
          href={signupUrl}
          className="inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-14"
        >
          Sign up to accept
        </Link>
      </div>
    </article>
  );
}
