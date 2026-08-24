import Image from "next/image";
import Link from "next/link";
import { formatInr } from "@/lib/format";
import type { Project } from "@/lib/types";

type Props = {
  project: Project;
  index?: number;
};

export function ProjectCard({ project, index = 0 }: Props) {
  const delayClass =
    index % 3 === 1
      ? "animate-rise-delay-1"
      : index % 3 === 2
        ? "animate-rise-delay-2"
        : "animate-rise";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`card-lift group block overflow-hidden rounded-2xl border border-line/80 bg-white/80 ${delayClass}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="grid h-full place-items-center bg-copper-soft text-copper">Project</div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            Year {project.target_year}
          </span>
        </div>
      </div>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {project.domain_tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-md bg-paper px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-ink group-hover:text-teal">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {project.short_description}
        </p>
        <p className="text-sm font-bold text-copper">
          Starting from {formatInr(project.starting_from)}
        </p>
      </div>
    </Link>
  );
}
