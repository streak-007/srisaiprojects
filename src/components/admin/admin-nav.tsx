import Link from "next/link";
import { SignOutButton } from "@/components/admin/sign-out-button";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/import", label: "CSV import" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav() {
  return (
    <aside className="border-b border-line bg-white md:min-h-screen md:w-56 md:border-b-0 md:border-r">
      <div className="px-4 py-4">
        <Link href="/admin" className="font-display text-lg font-extrabold text-ink">
          Admin
        </Link>
        <p className="text-xs text-ink-muted">Sri Sai Projects</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-6">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-paper hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-teal">
          View site →
        </Link>
        <SignOutButton />
      </nav>
    </aside>
  );
}
