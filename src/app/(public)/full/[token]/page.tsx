import Link from "next/link";
import { notFound } from "next/navigation";
import { computeEstimate } from "@/lib/estimates";
import { formatInr } from "@/lib/format";
import { MOCK_ADDONS, MOCK_COMPONENTS, MOCK_PROJECTS } from "@/lib/mock-data";
import { whatsappUrl } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/admin";
import type { Project, ProjectAddon, ProjectComponent } from "@/lib/types";

type Props = { params: Promise<{ token: string }> };

export const metadata = {
  title: "Full project details",
  robots: { index: false, follow: false },
};

export default async function FullDetailPage({ params }: Props) {
  const { token } = await params;

  let project: Project | null = null;
  let components: ProjectComponent[] = [];
  let addons: ProjectAddon[] = [];
  let expired = false;
  let alreadyOpened = false;

  if (!isSupabaseConfigured()) {
    // Demo: /full/demo shows first mock project breakdown
    if (token === "demo") {
      project = MOCK_PROJECTS[0];
      components = MOCK_COMPONENTS[project.id] ?? [];
      addons = MOCK_ADDONS[project.id] ?? [];
    } else {
      notFound();
    }
  } else {
    try {
      const admin = createServiceClient();
      const { data: link } = await admin
        .from("detail_links")
        .select("*")
        .eq("token", token)
        .maybeSingle();

      if (!link) notFound();

      if (link.expires_at && new Date(link.expires_at) < new Date()) {
        expired = true;
      }

      if (link.single_use && link.opened_at) {
        alreadyOpened = true;
      }

      if (!expired && !alreadyOpened) {
        if (!link.opened_at) {
          await admin
            .from("detail_links")
            .update({ opened_at: new Date().toISOString() })
            .eq("id", link.id);
        }

        const [{ data: p }, { data: comps }, { data: ads }] = await Promise.all([
          admin.from("projects").select("*").eq("id", link.project_id).maybeSingle(),
          admin.from("project_components").select("*").eq("project_id", link.project_id),
          admin.from("project_addons").select("*").eq("project_id", link.project_id),
        ]);
        project = (p as Project) ?? null;
        components = (comps as ProjectComponent[]) ?? [];
        addons = (ads as ProjectAddon[]) ?? [];
      }
    } catch {
      notFound();
    }
  }

  if (expired || alreadyOpened) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">Link unavailable</h1>
        <p className="mt-3 text-ink-muted">
          {expired ? "This private link has expired." : "This single-use link was already opened."}
        </p>
        <Link href="/projects" className="btn-primary mt-8 inline-flex">
          Back to catalog
        </Link>
      </div>
    );
  }

  if (!project) notFound();

  const estimate = computeEstimate(components, addons);
  const total = estimate.total || project.starting_from;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Private details</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-ink">{project.title}</h1>
      <p className="mt-3 text-ink-muted">{project.short_description}</p>

      <section className="mt-10 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-2xl font-bold">Cost breakdown</h2>
        {components.length ? (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2">Component</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Unit</th>
                <th className="py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {components.map((c) => (
                <tr key={c.id} className="border-b border-line/60">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{c.quantity}</td>
                  <td className="py-2">{formatInr(c.unit_cost)}</td>
                  <td className="py-2">{formatInr(c.quantity * c.unit_cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">Component list will appear once configured in admin.</p>
        )}

        {estimate.addonLines.map((a) => (
          <p key={a.name} className="mt-2 text-sm text-ink-muted">
            {a.name}: {formatInr(a.amount)}
          </p>
        ))}

        <p className="mt-4 font-display text-3xl font-extrabold text-copper">
          Total {formatInr(total)}
        </p>
      </section>

      {project.deliverables.length ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold">Deliverables</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-muted">
            {project.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.timeline_days ? (
        <p className="mt-6 text-sm font-semibold text-ink">
          Typical timeline: ~{project.timeline_days} days after booking.
        </p>
      ) : null}

      <a
        href={whatsappUrl(
          `Hi Sri Sai Projects — I reviewed the full details for ${project.title} and want to book.`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-10 inline-flex"
      >
        Contact to book on WhatsApp
      </a>
    </div>
  );
}
