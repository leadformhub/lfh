export default function QuickAnswer({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="not-prose rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-alt)] p-5 sm:p-6">
      <p className="m-0 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
        Quick Answer
      </p>
      <p className="mt-2 m-0 font-heading text-lg font-semibold text-[var(--foreground-heading)]">
        {question}
      </p>
      <p className="mt-2 m-0 text-[var(--foreground)] leading-relaxed">
        {answer}
      </p>
    </div>
  )
}
