import Link from "next/link";
import { connection } from "next/server";
import { ProjectCard } from "@/components/public/project-card";
import { DOMAIN_TAGS, SITE_NAME, whatsappUrl } from "@/lib/constants";
import { getFeaturedProjects } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

const STATS = [
  { value: "500+", label: "Projects" },
  { value: "50+", label: "Colleges reached" },
  { value: "1:1", label: "Student support" },
  { value: "100%", label: "Viva-ready focus" },
];

const OFFERS = [
  ["Final-year major projects", "End-to-end builds with a clear demo story and deliverables."],
  ["Mini & minor projects", "Practical projects sized for a strong submission and review."],
  ["Documentation package", "Report, PPT, source code, and setup guidance in one place."],
  ["Custom guidance", "Choose the right scope and get help preparing for your viva."],
];

const QUALITIES = [
  "Quality delivery",
  "On-time completion",
  "Working project demos",
  "Clear documentation",
  "Viva & setup support",
  "Transparent pricing",
];

type Story = {
  student_name: string;
  college: string;
  quote: string;
  project_title: string | null;
  rating: number | null;
};

export default async function HomePage() {
  // Reviews must reflect approvals without waiting for a redeploy.
  await connection();
  const [featured, stories] = await Promise.all([getFeaturedProjects(), getStories()]);

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
            <Link href="/projects" className="btn-primary bg-white text-white hover:bg-copper-soft">
              Browse projects
            </Link>
            <Link href="/how-it-works" className="btn-secondary border-white/30 bg-white/10 text-white hover:border-white">
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-line px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-4 py-7 text-center sm:py-8">
              <p className="font-display text-3xl font-extrabold text-teal sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-copper">What we offer</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-ink">Everything you need for a confident submission</h2>
          <p className="mt-3 text-ink-muted">From choosing a project to presenting it in your viva, each step stays clear and practical.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map(([title, description], index) => (
            <article key={title} className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow)]">
              <p className="font-display text-2xl font-extrabold text-copper">0{index + 1}</p>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-teal-deep py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-copper-soft">Why choose us</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold">Built for the submission, the demo, and the viva.</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-white/75">We focus on practical project quality and the support students need to present their work with confidence.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUALITIES.map((quality) => (
              <div key={quality} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-copper text-xs text-teal-deep">✓</span>
                {quality}
              </div>
            ))}
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

      <section className="border-y border-line bg-paper/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-copper">Student stories</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink">Real feedback from recent batches</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/testimonials" className="hidden text-sm font-bold text-teal hover:text-teal-deep sm:inline">
                View all →
              </Link>
            </div>
          </div>
          {stories.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {stories.map((story, index) => (
                <blockquote key={`${story.student_name}-${index}`} className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow)]">
                  {story.rating ? (
                    <p className="text-sm font-bold text-copper" aria-label={`${story.rating} out of 5`}>
                      {"★".repeat(story.rating)}{"☆".repeat(5 - story.rating)}
                    </p>
                  ) : null}
                  <p className="mt-3 text-[15px] leading-relaxed text-ink">&ldquo;{story.quote}&rdquo;</p>
                  <footer className="mt-5 border-t border-line pt-4">
                    <p className="font-bold text-ink">{story.student_name}</p>
                    <p className="text-sm text-ink-muted">{story.college}</p>
                    {story.project_title ? <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-teal">{story.project_title}</p> : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-line bg-white/70 p-6 text-sm text-ink-muted">Student stories will appear here once reviews are approved.</p>
          )}
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

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-teal p-8 text-white sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-copper-soft">Ready when you are</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold sm:text-4xl">Need a project for your next submission?</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white/80">Explore the catalog or chat with us to find a project that fits your branch, timeline, and budget.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/projects" className="btn-secondary bg-white !text-teal-deep hover:bg-copper-soft">Browse projects</Link>
            <a href={whatsappUrl("Hi, I need help choosing a project.")} target="_blank" rel="noreferrer" className="btn-secondary border-white/30 bg-white/10 text-white hover:border-white">Talk on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}

async function getStories(): Promise<Story[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("testimonials")
    .select("student_name, college, quote, project_title, rating")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (data ?? []).map((story) => ({
    student_name: story.student_name,
    college: story.college,
    quote: story.quote,
    project_title: story.project_title,
    rating: story.rating,
  }));
}
