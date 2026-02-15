import Link from "next/link";
import { getRecentLeads } from "@/services/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US");
}

type Props = {
  accountOwnerId: string;
  username: string;
  assignedToUserId?: string;
};

export async function DashboardRecentActivity({
  accountOwnerId,
  username,
  assignedToUserId,
}: Props) {
  const recentLeads = await getRecentLeads(accountOwnerId, 5, assignedToUserId);

  return (
    <section aria-label="Recent activity">
      <Card className="h-full transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-neutral-900">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {recentLeads.length === 0 ? (
            <div className="empty-state py-8">
              <p className="empty-state-title">No activity yet</p>
              <p className="empty-state-description mt-1">
                Create a form and share it to see leads here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="py-4 first:pt-0">
                  <Link
                    href={`/${username}/leads`}
                    className="block rounded-lg py-1 transition-colors hover:bg-neutral-50"
                  >
                    <p className="line-clamp-1 text-sm font-medium text-neutral-900">
                      {lead.formTitle}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                      {lead.preview}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {formatRelativeTime(lead.submittedAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
