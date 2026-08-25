import Link from "next/link";

const steps = [
  {
    title: "Browse",
    body: "Filter by year, branch, and domain. Open any card for a public summary and starting estimate.",
  },
  {
    title: "Request",
    body: "Share your name, college, and WhatsApp. We review interest and prepare your private details link.",
  },
  {
    title: "Get estimate",
    body: "Your link unlocks the full cost breakdown, components, deliverables, and timeline.",
  },
  {
    title: "Book & deliver",
    body: "Confirm on WhatsApp, pay the agreed advance, and we deliver kit + docs with viva support.",
  },
  {
    title: "Leave a review",
    body: "After delivery, share how it went. We approve genuine feedback before it appears on Stories.",
  },
];

export const metadata = {
  title: "How it works",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold text-ink">How it works</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        A simple path from curiosity to a demo-ready project — without chasing PDFs across ten WhatsApp groups.
      </p>

      <ol className="mt-10 space-y-5">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="animate-rise rounded-2xl border border-line bg-white/80 p-5 sm:p-6"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Step {i + 1}</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink">{s.title}</h2>
            <p className="mt-2 text-ink-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/projects" className="btn-primary inline-flex">
          Start browsing
        </Link>
        <Link href="/feedback" className="btn-secondary inline-flex">
          Leave a review
        </Link>
      </div>
    </div>
  );
}
