import Link from "next/link";
import { ProjectCard } from "@/components/public/project-card";
import { DOMAIN_TAGS, SITE_NAME } from "@/lib/constants";
import { getFeaturedProjects } from "@/lib/data/projects";

export default async function HomePage() {
  const featured = await getFeaturedProjects();

  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <div className="hero-glow absolute inset-0" />
        <div className="grid-overlay absolute inset-0 opacity-30" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
          <p className="animate-rise font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            {SITE_NAME}
          </p>
          <h1 className="animate-rise-delay-1 mt-5 max-w-2xl text-2xl font-semibold leading-snug text-white/95 sm:text-3xl">
            Build a viva-ready engineering project — without the guesswork.
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Browse major & minor kits by branch, see starting estimates, and unlock full specs when you’re ready.
          </p>
          <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary bg-white !text-teal-deep hover:bg-copper-soft">
              Browse projects
            </Link>
            <Link href="/how-it-works" className="btn-secondary border-white/30 bg-white/10 text-white hover:border-white">
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink">Featured this season</h2>
            <p className="mt-2 text-ink-muted">Popular picks students are requesting right now.</p>
          </div>
          <Link href="/projects" className="hidden text-sm font-bold text-teal hover:text-teal-deep sm:inline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      <section className="border-y border-line/70 bg-white/50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-extrabold text-ink">Jump by domain</h2>
          <p className="mt-2 text-ink-muted">One tap into the catalog — filters stay shareable in the URL.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {DOMAIN_TAGS.map((d) => (
              <Link key={d} href={`/projects?domain=${encodeURIComponent(d)}`} className="chip">
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
