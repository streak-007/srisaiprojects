import Link from "next/link";
import { CsvImportForm } from "@/components/admin/csv-import-form";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { ShareProjectDetailsButton } from "@/components/admin/share-project-details-button";
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
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-line/70">
                <td className="px-3 py-3 font-semibold">{p.title}</td>
                <td className="px-3 py-3 capitalize">{p.status.replace("_", " ")}</td>
                <td className="px-3 py-3">{p.target_year}</td>
                <td className="px-3 py-3">{formatInr(p.starting_from)}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <Link href={`/admin/projects/${p.id}`} className="font-semibold text-teal">
                      Edit
                    </Link>
                    <ShareProjectDetailsButton
                      projectId={p.id}
                      projectTitle={p.title}
                      startingFrom={p.starting_from}
                      compact
                    />
                    <DeleteProjectButton projectId={p.id} projectTitle={p.title} compact />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-extrabold">Import projects from CSV</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Add multiple projects at once, then open each project to add images and a detailed cost breakdown.
        </p>
        <div className="mt-4">
          <CsvImportForm />
        </div>
      </section>
    </div>
  );
}
