"use client";

import { useState } from "react";
import { slugify } from "@/lib/format";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

const SAMPLE_HREF = "/sample-projects.csv";

export function CsvImportForm() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setLog([]);
    const file = new FormData(e.currentTarget).get("file");
    if (!(file instanceof File)) {
      setBusy(false);
      return;
    }
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      setLog(["CSV needs a header row plus at least one project row."]);
      setBusy(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setLog(["Supabase not configured — nothing imported."]);
      setBusy(false);
      return;
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const supabase = createClient();
    const notes: string[] = [];

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = (cols[idx] ?? "").trim();
      });
      const title = row.title;
      if (!title) {
        notes.push(`Row ${i + 1}: skipped (no title)`);
        continue;
      }

      const status = normalizeStatus(row.status);
      const category = row.category === "minor" ? "minor" : "final_year";
      let slug = slugify(title) || `project-${i}`;
      const { data: clash } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();
      if (clash) slug = `${slug}-${Date.now().toString(36)}`;

      const payload = {
        title,
        slug,
        short_description: row.short_description || title,
        full_description: row.full_description || row.short_description || title,
        category,
        target_year: clampYear(Number(row.target_year || 4)),
        branch_tags: splitList(row.branch_tags),
        domain_tags: splitList(row.domain_tags),
        starting_from: Number(row.starting_from || 0),
        status,
        cover_image_url: row.cover_image_url || null,
        gallery: [] as string[],
        features: splitList(row.features),
        tech_stack: splitList(row.tech_stack),
        deliverables: splitList(row.deliverables),
        timeline_days: Number(row.timeline_days || 0) || null,
        featured: parseBool(row.featured),
        demo_video_url: row.demo_video_url || null,
      } satisfies Database["public"]["Tables"]["projects"]["Insert"];

      const { error } = await supabase.from("projects").insert(payload);
      notes.push(
        error
          ? `Row ${i + 1}: ${error.message}`
          : `Row ${i + 1}: imported “${title}” as ${status}. Open it in Projects to add photos and the cost breakdown.`,
      );
    }

    setLog(notes);
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-ink-muted">
        <p className="font-semibold text-ink">How CSV import works</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            Download the sample file, keep the header row, and add one project per line.
          </li>
          <li>
            Import creates the text fields (title, tags, estimate, features, etc.). Status defaults to{" "}
            <code className="text-xs">draft</code> if empty.
          </li>
          <li>
            <strong className="text-ink">Images are not in the CSV.</strong> After import, open each
            project in Admin → Projects → Edit and upload a cover + gallery. You can optionally put a
            public image URL in <code className="text-xs">cover_image_url</code> if you already host it.
          </li>
          <li>
            Add hardware components and add-ons on the edit page so “Share project details” can show a
            full breakdown.
          </li>
        </ol>
        <a href={SAMPLE_HREF} download className="btn-secondary mt-4 !inline-flex !py-2 text-sm">
          Download sample CSV
        </a>
      </section>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-ink">Upload your file</p>
        <input name="file" type="file" accept=".csv,text/csv" required className="block text-sm" />
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Importing…" : "Import CSV"}
        </button>
        {log.length ? (
          <ul className="max-h-64 space-y-1 overflow-auto text-sm text-ink-muted">
            {log.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
      </form>

      <section className="rounded-2xl border border-dashed border-line bg-paper/70 p-5 text-sm text-ink-muted">
        <p className="font-semibold text-ink">Column cheat sheet</p>
        <ul className="mt-3 space-y-1.5">
          <li>
            <code className="text-xs">title</code> — required
          </li>
          <li>
            <code className="text-xs">category</code> — <code className="text-xs">final_year</code> or{" "}
            <code className="text-xs">minor</code>
          </li>
          <li>
            <code className="text-xs">target_year</code> — 2, 3, or 4
          </li>
          <li>
            <code className="text-xs">branch_tags</code> / <code className="text-xs">domain_tags</code> /
            <code className="text-xs">features</code> / <code className="text-xs">tech_stack</code> /{" "}
            <code className="text-xs">deliverables</code> — separate values with{" "}
            <code className="text-xs">|</code> (example: <code className="text-xs">ECE|EEE</code>)
          </li>
          <li>
            <code className="text-xs">status</code> — <code className="text-xs">draft</code>,{" "}
            <code className="text-xs">published</code>, or <code className="text-xs">sold_out</code>
          </li>
          <li>
            <code className="text-xs">featured</code> — <code className="text-xs">true</code> or{" "}
            <code className="text-xs">false</code>
          </li>
          <li>
            <code className="text-xs">cover_image_url</code> — optional public URL only (leave blank and
            upload in the editor)
          </li>
        </ul>
      </section>
    </div>
  );
}

function splitList(value?: string) {
  if (!value) return [] as string[];
  return value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseBool(value?: string) {
  return /^(1|true|yes|y)$/i.test((value || "").trim());
}

function clampYear(year: number) {
  if (year === 2 || year === 3 || year === 4) return year;
  return 4;
}

function normalizeStatus(value?: string) {
  const v = (value || "draft").toLowerCase();
  if (v === "published" || v === "sold_out") return v;
  return "draft";
}

/** RFC-style CSV: quoted fields may contain commas and newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      row.push(cur);
      cur = "";
      continue;
    }
    if (ch === "\n") {
      row.push(cur.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cur = "";
      continue;
    }
    cur += ch;
  }
  row.push(cur.replace(/\r$/, ""));
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}
