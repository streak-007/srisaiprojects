import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const projects = await getAllProjectsAdmin();
  let pending = 0;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("detail_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    pending = count ?? 0;
  }

  const published = projects.filter((p) => p.status === "published").length;

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Quick pulse on catalog and inbox.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Projects</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{projects.length}</p>
          <p className="text-sm text-ink-muted">{published} published</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Pending requests</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{pending}</p>
          <Link href="/admin/requests" className="mt-2 inline-block text-sm font-semibold text-teal">
            Open inbox →
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Quick actions</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/admin/projects/new" className="btn-primary !py-2 text-sm">
              Add project
            </Link>
            <Link href="/admin/import" className="btn-secondary !py-2 text-sm">
              CSV import
            </Link>
          </div>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <p className="mt-8 rounded-xl border border-copper/30 bg-copper-soft/50 p-4 text-sm">
          Running in demo mode with mock projects. Copy <code>.env.example</code> to{" "}
          <code>.env.local</code>, create a Supabase project, run the SQL migration, then restart.
        </p>
      ) : null}
    </div>
  );
}
