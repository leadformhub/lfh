import { permanentRedirect } from "next/navigation";

/** Off-topic (Kaizen/Kanban) — 301 to lead follow-up guide. See off-topic-blog-redirects.ts */
export default function KaizenVsKanbanRedirectPage() {
  permanentRedirect("/blog/how-to-follow-up-on-leads-quickly");
}
