import { unstable_noStore } from "next/cache";
import { getFormByIdForPublic } from "@/services/forms.service";
import { recordEvent } from "@/services/analytics.service";
import { getRecaptchaSiteKey } from "@/lib/recaptcha";
import { notFound } from "next/navigation";
import { PublicForm } from "@/components/PublicForm";
import { EmbedHeightReporter } from "@/components/EmbedHeightReporter";

export const dynamic = "force-dynamic";

/** Public form URL: /f/[formId] — param is the form id (cuid). */
export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug: formId } = await params;
  const form = await getFormByIdForPublic(formId);
  if (!form) {
    return {
      title: "Form not found | LeadFormHub",
      robots: { index: false, follow: true },
    };
  }
  return {
    title: `${form.name} | LeadFormHub`,
    description: form.schema?.settings?.description || `Fill out ${form.name}`,
    robots: { index: false, follow: true },
  };
}

export default async function PublicFormPage({
  params,
  searchParams,
}: { params: Promise<{ slug: string }>; searchParams: Promise<{ embed?: string }> }) {
  unstable_noStore(); // ensure fresh form/schema every time
  const { slug: formId } = await params;
  const { embed: embedParam } = await searchParams;
  const isEmbed = embedParam === "1";
  const form = await getFormByIdForPublic(formId);
  if (!form) notFound();
  if (form.lockedAt) {
    return (
      <>
        {isEmbed && <EmbedHeightReporter />}
        <div className={isEmbed ? "bg-neutral-100 py-4 px-3" : "min-h-screen bg-neutral-100 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:py-12"}>
          <div className="max-w-lg mx-auto w-full min-w-0 rounded-xl border border-neutral-200 bg-white p-6 text-center text-neutral-600">
            <h1 className="text-xl font-bold text-neutral-900 mb-2">{form.name}</h1>
            <p>This form is not accepting submissions right now. Upgrade to unlock.</p>
          </div>
        </div>
      </>
    );
  }
  await recordEvent(form.id, "view");
  const ownerPlan = (form.user?.plan ?? "free").toString().toLowerCase();
  const showBranding = ownerPlan !== "pro" && ownerPlan !== "business";
  const settings = form.schema?.settings ?? {};
  const recaptchaEnabled = settings.recaptchaEnabled !== false;
  const recaptchaSiteKey = recaptchaEnabled ? getRecaptchaSiteKey() : null;
  const fields = form.schema?.fields ?? [];

  const brandingBlock = showBranding ? (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 flex flex-col items-center justify-center gap-0.5 text-center" aria-label="LeadFormHub branding">
      <a
        href="https://www.leadformhub.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-600 hover:text-neutral-800 text-sm font-medium transition-colors inline-flex flex-col items-center gap-0.5"
      >
        <span>Powered by LeadFormHub</span>
        <span className="text-neutral-500 text-xs">Start For Free</span>
      </a>
    </div>
  ) : null;

  const showFormName = settings.showFormName !== false;

  const wrapperClass = isEmbed
    ? "bg-neutral-100 py-4 px-3 sm:px-4"
    : "min-h-screen bg-neutral-100 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6";

  return (
    <>
      {isEmbed && <EmbedHeightReporter />}
      <div className={wrapperClass}>
      <div className="max-w-lg mx-auto w-full min-w-0">
        {showFormName && (
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 break-words">{form.name}</h1>
        )}
        {settings.description && (
          <p className="text-neutral-600 text-base mb-4 sm:mb-6 break-words">{settings.description}</p>
        )}
        {fields.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-neutral-600">
            <p>This form has no fields yet.</p>
            <p className="mt-1 text-base">Add fields in the form designer and save, then refresh this page.</p>
            {brandingBlock}
          </div>
        ) : (
          <PublicForm
            formId={form.id}
            fields={fields}
            mobileOtpEnabled={settings.mobileOtpEnabled ?? false}
            emailOtpEnabled={settings.emailOtpEnabled ?? false}
            redirectUrl={settings.redirectUrl ?? null}
            submissionsEnabled={(settings.status ?? "PUBLIC") === "PUBLIC"}
            showBranding={showBranding}
            recaptchaSiteKey={recaptchaSiteKey}
          />
        )}
      </div>
    </div>
    </>
  );
}
