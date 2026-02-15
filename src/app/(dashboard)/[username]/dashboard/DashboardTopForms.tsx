import Link from "next/link";
import { getTopForms } from "@/services/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  accountOwnerId: string;
  username: string;
  assignedToUserId?: string;
};

export async function DashboardTopForms({
  accountOwnerId,
  username,
  assignedToUserId,
}: Props) {
  const topForms = await getTopForms(accountOwnerId, 5, assignedToUserId);

  return (
    <section className="mt-8" aria-label="Top forms by submissions">
      <Card className="transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-neutral-900">Top forms</CardTitle>
          <Link
            href={`/${username}/forms`}
            className="text-sm font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {topForms.length === 0 ? (
            <div className="empty-state py-6">
              <p className="empty-state-title">No forms yet</p>
              <p className="empty-state-description mt-1">
                Create your first form to get started.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {topForms.map((form) => (
                <li
                  key={form.id}
                  className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <Link
                    href={`/${username}/forms/${form.id}`}
                    className="min-w-0 flex-1 font-medium text-neutral-900 hover:underline"
                  >
                    <span className="truncate">{form.name}</span>
                  </Link>
                  <span className="shrink-0 text-base text-neutral-500">
                    {form.submissions} submissions
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
