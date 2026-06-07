type Row = {
  feature: string
  us: string
  them: string
  winner: "us" | "them" | "tie"
}

export default function ComparisonTable({
  usName,
  themName,
  rows,
}: {
  usName: string
  themName: string
  rows: Row[]
}) {
  return (
    <div className="not-prose mt-4 overflow-x-auto rounded-2xl border border-[var(--border-subtle)]">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--background)]">
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">Feature</th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">{usName}</th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">{themName}</th>
          </tr>
        </thead>
        <tbody className="text-[var(--foreground-muted)]">
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border-subtle)] last:border-b-0">
              <td className="px-4 py-3 font-medium text-[var(--foreground)]">{row.feature}</td>
              <td className="px-4 py-3">
                {row.winner === "us" ? "✅ " : ""}{row.us}
              </td>
              <td className="px-4 py-3">
                {row.winner === "them" ? "✅ " : ""}{row.them}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
