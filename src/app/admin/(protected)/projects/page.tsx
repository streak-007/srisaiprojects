import Link from "next/link";
import { formatInr } from "@/lib/format";
import { getAllProjectsAdmin } from "@/lib/data/projects";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">Projects</h1>
        <Link href="/admin/projects/new" className="btn-primary !py-2 text-sm">
          New project
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Year</th>
              <th className="px-3 py-3">From</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-line/70">
                <td className="px-3 py-3 font-semibold">{p.title}</td>
                <td className="px-3 py-3 capitalize">{p.status.replace("_", " ")}</td>
                <td className="px-3 py-3">{p.target_year}</td>
                <td className="px-3 py-3">{formatInr(p.starting_from)}</td>
                <td className="px-3 py-3 text-right">
                  <Link href={`/admin/projects/${p.id}`} className="font-semibold text-teal">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
