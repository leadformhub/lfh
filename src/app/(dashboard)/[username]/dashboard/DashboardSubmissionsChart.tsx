import { getSubmissionsOverTime } from "@/services/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  accountOwnerId: string;
  assignedToUserId?: string;
};

export async function DashboardSubmissionsChart({
  accountOwnerId,
  assignedToUserId,
}: Props) {
  const submissionsOverTime = await getSubmissionsOverTime(
    accountOwnerId,
    30,
    assignedToUserId
  );
  const maxSubmissions = Math.max(1, ...submissionsOverTime.map((d) => d.submissions));
  const total = submissionsOverTime.reduce((s, d) => s + d.submissions, 0);

  return (
    <section className="lg:col-span-2" aria-label="Submissions over time">
      <Card className="h-full min-h-[280px] transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-neutral-900">Submissions over time</CardTitle>
          <p className="text-base text-neutral-500">Last 30 days</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            className="flex h-40 sm:h-52 items-end justify-between gap-0.5 rounded-lg bg-neutral-100 p-3 sm:gap-1 sm:p-4"
            role="img"
            aria-label={`Submissions per day for the last 30 days. Total: ${total} submissions.`}
          >
            {submissionsOverTime.map((d) => {
              const pct = maxSubmissions > 0 ? (d.submissions / maxSubmissions) * 100 : 0;
              const label = new Date(d.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              });
              return (
                <div
                  key={d.date}
                  className="min-w-0 flex-1 rounded-t bg-blue-500 transition-all duration-200 hover:bg-blue-600"
                  style={{ height: `${Math.max(pct, 2)}%`, minHeight: "4px" }}
                  title={`${label}: ${d.submissions} submission${d.submissions !== 1 ? "s" : ""}`}
                />
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs text-neutral-500">
            {total} total in last 30 days
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
