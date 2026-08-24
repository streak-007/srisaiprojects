import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics tip",
  robots: { index: false },
};

/** Lightweight interest snapshot from request inbox (no third-party script required). */
export default function AnalyticsNotePage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-extrabold">Analytics</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Use the{" "}
        <Link href="/admin/requests" className="font-semibold text-teal">
          Requests
        </Link>{" "}
        inbox to see which projects get the most interest. For page traffic after deploy, enable{" "}
        <a
          className="font-semibold text-teal"
          href="https://vercel.com/analytics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vercel Analytics
        </a>{" "}
        (free Hobby tier) or self-host Umami later.
      </p>
      <p className="mt-4 text-sm text-ink-muted">
        Optional install when you are ready:{" "}
        <code className="rounded bg-paper px-1.5 py-0.5 text-xs">npm install @vercel/analytics</code>
      </p>
    </div>
  );
}
