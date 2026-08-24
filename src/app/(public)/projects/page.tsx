import { Suspense } from "react";
import { ProjectCard } from "@/components/public/project-card";
import { ProjectFilters } from "@/components/public/project-filters";
import { getPublishedProjects } from "@/lib/data/projects";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Browse projects",
  description: "Filter engineering major and minor projects by year, branch, and domain.",
};

export default async function ProjectsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters = {
    q: typeof sp.q === "string" ? sp.q : undefined,
    year: typeof sp.year === "string" ? sp.year : undefined,
    branch: typeof sp.branch === "string" ? sp.branch : undefined,
    domain: typeof sp.domain === "string" ? sp.domain : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
  };
  const projects = await getPublishedProjects(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-extrabold text-ink">Project catalog</h1>
        <p className="mt-3 text-ink-muted">
          Live search and filters. Cards show public starting estimates — full breakdown unlocks after approval.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-white/60" />}>
          <ProjectFilters />
        </Suspense>
      </div>

      <p className="mt-6 text-sm font-semibold text-ink-muted">{projects.length} projects</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {!projects.length ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line bg-white/60 p-8 text-center text-ink-muted">
          No matches. Clear a filter or try another keyword.
        </p>
      ) : null}
    </div>
  );
}
