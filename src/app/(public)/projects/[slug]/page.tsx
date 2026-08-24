import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/public/gallery";
import { RequestForm } from "@/components/public/request-form";
import { formatInr } from "@/lib/format";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: project.cover_image_url ? [project.cover_image_url] : undefined,
    },
  };
}

export default async function ProjectSummaryPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="chip !cursor-default" data-active="true">
              Year {project.target_year}
            </span>
            {project.branch_tags.map((t) => (
              <span key={t} className="chip !cursor-default">
                {t}
              </span>
            ))}
            {project.domain_tags.map((t) => (
              <span key={t} className="chip !cursor-default">
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-ink">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-ink-muted">{project.short_description}</p>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
            {project.cover_image_url ? (
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : null}
          </div>

          <div className="prose-like mt-8 space-y-4 text-[15px] leading-relaxed text-ink">
            <p>{project.full_description}</p>
          </div>

          {project.features.length ? (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold">Features</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-muted">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.tech_stack.length ? (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold">Tech stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech_stack.map((t) => (
                  <span key={t} className="rounded-md bg-white px-3 py-1 text-sm font-semibold border border-line">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold">Gallery</h2>
            <div className="mt-3">
              <Gallery images={project.gallery} title={project.title} />
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-copper-soft/60 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-copper">Public estimate</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-ink">
              Starting from {formatInr(project.starting_from)}
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Full component breakdown unlocks on your private detail link after approval.
            </p>
          </div>
          <RequestForm projectId={project.id} projectTitle={project.title} />
        </aside>
      </div>
    </div>
  );
}
