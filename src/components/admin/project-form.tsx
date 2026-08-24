"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BRANCH_TAGS,
  DOMAIN_TAGS,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  TARGET_YEARS,
} from "@/lib/constants";
import { computeEstimate } from "@/lib/estimates";
import { formatInr, slugify } from "@/lib/format";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Project, ProjectAddon, ProjectComponent } from "@/lib/types";

type Props = {
  project?: Project;
  initialComponents?: ProjectComponent[];
  initialAddons?: ProjectAddon[];
};

type CompDraft = { name: string; quantity: number; unit_cost: number };
type AddonDraft = { name: string; type: "flat" | "percent"; value: number };

export function ProjectForm({ project, initialComponents = [], initialAddons = [] }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [components, setComponents] = useState<CompDraft[]>(
    initialComponents.map((c) => ({
      name: c.name,
      quantity: c.quantity,
      unit_cost: c.unit_cost,
    })),
  );
  const [addons, setAddons] = useState<AddonDraft[]>(
    initialAddons.map((a) => ({ name: a.name, type: a.type, value: a.value })),
  );

  const estimate = useMemo(() => computeEstimate(components, addons), [components, addons]);
  const startingFrom = estimate.total || project?.starting_from || 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const payload = {
      title,
      slug: slug || slugify(title),
      short_description: String(form.get("short_description") || ""),
      full_description: String(form.get("full_description") || ""),
      category: String(form.get("category") || "final_year") as Project["category"],
      target_year: Number(form.get("target_year") || 4),
      branch_tags: form.getAll("branch_tags").map(String),
      domain_tags: form.getAll("domain_tags").map(String),
      cover_image_url: String(form.get("cover_image_url") || "") || null,
      gallery: String(form.get("gallery") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      status: String(form.get("status") || "draft") as Project["status"],
      starting_from: Number(form.get("starting_from") || startingFrom),
      features: String(form.get("features") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tech_stack: String(form.get("tech_stack") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      demo_video_url: String(form.get("demo_video_url") || "") || null,
      deliverables: String(form.get("deliverables") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      timeline_days: Number(form.get("timeline_days") || 0) || null,
      featured: form.get("featured") === "on",
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Save will work after you add .env.local keys.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    let projectId = project?.id;

    if (projectId) {
      const { error: upErr } = await supabase.from("projects").update(payload).eq("id", projectId);
      if (upErr) {
        setError(upErr.message);
        setSaving(false);
        return;
      }
      await supabase.from("project_components").delete().eq("project_id", projectId);
      await supabase.from("project_addons").delete().eq("project_id", projectId);
    } else {
      const { data, error: insErr } = await supabase
        .from("projects")
        .insert(payload)
        .select("id")
        .single();
      if (insErr || !data) {
        setError(insErr?.message || "Insert failed");
        setSaving(false);
        return;
      }
      projectId = data.id;
    }

    if (components.length) {
      await supabase.from("project_components").insert(
        components
          .filter((c) => c.name)
          .map((c) => ({
            project_id: projectId!,
            name: c.name,
            quantity: c.quantity,
            unit_cost: c.unit_cost,
          })),
      );
    }
    if (addons.length) {
      await supabase.from("project_addons").insert(
        addons
          .filter((a) => a.name)
          .map((a) => ({
            project_id: projectId!,
            name: a.name,
            type: a.type,
            value: a.value,
          })),
      );
    }

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold md:col-span-2">
          Title
          <input
            className="input-field mt-1"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!project) setSlug(slugify(e.target.value));
            }}
            required
          />
        </label>
        <label className="block text-sm font-semibold">
          Slug
          <input className="input-field mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Status
          <select name="status" className="input-field mt-1" defaultValue={project?.status ?? "draft"}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Category
          <select name="category" className="input-field mt-1" defaultValue={project?.category ?? "final_year"}>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Target year
          <select name="target_year" className="input-field mt-1" defaultValue={project?.target_year ?? 4}>
            {TARGET_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          Short description
          <textarea
            name="short_description"
            className="input-field mt-1 min-h-20"
            defaultValue={project?.short_description}
            required
          />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          Full description
          <textarea
            name="full_description"
            className="input-field mt-1 min-h-32"
            defaultValue={project?.full_description}
            required
          />
        </label>
        <fieldset className="md:col-span-2">
          <legend className="text-sm font-semibold">Branch tags</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {BRANCH_TAGS.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="branch_tags"
                  value={b}
                  defaultChecked={project?.branch_tags.includes(b)}
                />
                {b}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="md:col-span-2">
          <legend className="text-sm font-semibold">Domain tags</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {DOMAIN_TAGS.map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="domain_tags"
                  value={d}
                  defaultChecked={project?.domain_tags.includes(d)}
                />
                {d}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-semibold md:col-span-2">
          Cover image URL
          <input
            name="cover_image_url"
            className="input-field mt-1"
            defaultValue={project?.cover_image_url ?? ""}
          />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          Gallery URLs (one per line)
          <textarea
            name="gallery"
            className="input-field mt-1 min-h-24"
            defaultValue={project?.gallery.join("\n")}
          />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          Features (one per line)
          <textarea
            name="features"
            className="input-field mt-1 min-h-24"
            defaultValue={project?.features.join("\n")}
          />
        </label>
        <label className="block text-sm font-semibold">
          Tech stack (comma separated)
          <input
            name="tech_stack"
            className="input-field mt-1"
            defaultValue={project?.tech_stack.join(", ")}
          />
        </label>
        <label className="block text-sm font-semibold">
          Demo video URL
          <input
            name="demo_video_url"
            className="input-field mt-1"
            defaultValue={project?.demo_video_url ?? ""}
          />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          Deliverables (one per line)
          <textarea
            name="deliverables"
            className="input-field mt-1 min-h-24"
            defaultValue={project?.deliverables.join("\n")}
          />
        </label>
        <label className="block text-sm font-semibold">
          Timeline (days)
          <input
            name="timeline_days"
            type="number"
            className="input-field mt-1"
            defaultValue={project?.timeline_days ?? ""}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold self-end">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} />
          Featured on home
        </label>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-xl font-bold">Estimate calculator</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Components + flat/% add-ons. Public site shows “starting from”; full table is on the private link.
        </p>

        <div className="mt-4 space-y-3">
          {components.map((c, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1.4fr_0.6fr_0.8fr_auto]">
              <input
                className="input-field"
                placeholder="Component"
                value={c.name}
                onChange={(e) => {
                  const next = [...components];
                  next[i] = { ...c, name: e.target.value };
                  setComponents(next);
                }}
              />
              <input
                className="input-field"
                type="number"
                placeholder="Qty"
                value={c.quantity}
                onChange={(e) => {
                  const next = [...components];
                  next[i] = { ...c, quantity: Number(e.target.value) };
                  setComponents(next);
                }}
              />
              <input
                className="input-field"
                type="number"
                placeholder="Unit ₹"
                value={c.unit_cost}
                onChange={(e) => {
                  const next = [...components];
                  next[i] = { ...c, unit_cost: Number(e.target.value) };
                  setComponents(next);
                }}
              />
              <button
                type="button"
                className="text-sm font-semibold text-danger"
                onClick={() => setComponents(components.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary !py-2 text-sm"
            onClick={() => setComponents([...components, { name: "", quantity: 1, unit_cost: 0 }])}
          >
            + Component
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {addons.map((a, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
              <input
                className="input-field"
                placeholder="Add-on name"
                value={a.name}
                onChange={(e) => {
                  const next = [...addons];
                  next[i] = { ...a, name: e.target.value };
                  setAddons(next);
                }}
              />
              <select
                className="input-field"
                value={a.type}
                onChange={(e) => {
                  const next = [...addons];
                  next[i] = { ...a, type: e.target.value as "flat" | "percent" };
                  setAddons(next);
                }}
              >
                <option value="flat">Flat ₹</option>
                <option value="percent">Percent %</option>
              </select>
              <input
                className="input-field"
                type="number"
                value={a.value}
                onChange={(e) => {
                  const next = [...addons];
                  next[i] = { ...a, value: Number(e.target.value) };
                  setAddons(next);
                }}
              />
              <button
                type="button"
                className="text-sm font-semibold text-danger"
                onClick={() => setAddons(addons.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary !py-2 text-sm"
            onClick={() => setAddons([...addons, { name: "", type: "flat", value: 0 }])}
          >
            + Add-on
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-paper p-4">
          <p className="text-sm text-ink-muted">Hardware {formatInr(estimate.hardware)}</p>
          {estimate.addonLines.map((a) => (
            <p key={a.name} className="text-sm text-ink-muted">
              {a.name}: {formatInr(a.amount)}
            </p>
          ))}
          <p className="mt-2 font-display text-2xl font-bold">Total {formatInr(estimate.total)}</p>
        </div>

        <label className="mt-4 block text-sm font-semibold">
          Public “starting from” (override if needed)
          <input
            name="starting_from"
            type="number"
            className="input-field mt-1"
            defaultValue={project?.starting_from ?? startingFrom}
          />
        </label>
      </section>

      {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? "Saving…" : project ? "Update project" : "Create project"}
      </button>
    </form>
  );
}
