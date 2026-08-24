import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

const links = [
  { href: "/projects", label: "Browse" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/testimonials", label: "Stories" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-[rgba(238,242,246,0.85)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
          {SITE_NAME}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink-muted md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-teal">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="btn-secondary !px-3 !py-2 text-sm"
            title="Admin login (student accounts coming later)"
          >
            Login
          </Link>
          <Link href="/projects" className="btn-primary !px-4 !py-2 text-sm">
            Find a project
          </Link>
        </div>
      </div>
    </header>
  );
}
