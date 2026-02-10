import { getFormById } from "@/services/forms.service";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FormEmbedPage({
  params,
}: { params: Promise<{ username: string; formId: string }> }) {
  const session = await getSession();
  const { username, formId } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) redirect("/login");
  const form = await getFormById(formId, session.userId);
  if (!form) redirect(`/${username}/forms`);
  const embedUrl = `${process.env.NEXTAUTH_URL || "https://leadformhub.com"}/f/${form.id}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0"></iframe>`;
  return (
    <div className="min-w-0 p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h1 className="font-heading text-lg font-bold text-[var(--foreground-heading)] sm:text-xl mb-2">Embed form</h1>
      <p className="text-[var(--foreground-muted)] text-base mb-4 truncate">{form.name}</p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Form URL</label>
        <input
          type="text"
          readOnly
          value={embedUrl}
          className="w-full min-w-0 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-50)] px-3 py-2.5 text-sm text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">iframe code</label>
        <pre className="w-full min-w-0 overflow-x-auto rounded-lg border border-[var(--border-default)] bg-[var(--neutral-50)] p-3 text-sm text-[var(--foreground)]">
          {iframeCode}
        </pre>
      </div>
      <p className="mt-4">
        <a
          href={`/f/${form.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#2563EB] hover:underline min-h-[44px] inline-flex items-center"
        >
          Open form in new tab
        </a>
      </p>
    </div>
  );
}
