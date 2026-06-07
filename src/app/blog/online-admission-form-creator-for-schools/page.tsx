import { permanentRedirect } from "next/navigation";

/** Off-topic (school admissions) — 301 to lead generation form builder. See off-topic-blog-redirects.ts */
export default function OnlineAdmissionFormCreatorForSchoolsRedirectPage() {
  permanentRedirect("/lead-generation-form-builder");
}
