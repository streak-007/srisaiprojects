"use client";

import { useState } from "react";
import { slugify } from "@/lib/format";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * CSV columns:
 * title,short_description,full_description,category,target_year,branch_tags,domain_tags,starting_from,status
 * branch_tags / domain_tags: pipe-separated e.g. ECE|EEE
 */
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
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      setLog(["CSV needs a header + at least one row."]);
      setBusy(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setLog(["Supabase not configured — nothing imported."]);
      setBusy(false);
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    const supabase = createClient();
    const notes: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = splitCsvLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = cols[idx] ?? "";
      });
      const title = row.title;
      if (!title) {
        notes.push(`Row ${i + 1}: skipped (no title)`);
        continue;
      }
      const payload = {
        title,
        slug: slugify(title),
        short_description: row.short_description || title,
        full_description: row.full_description || row.short_description || title,
        category: (row.category === "minor" ? "minor" : "final_year") as "minor" | "final_year",
        target_year: Number(row.target_year || 4),
        branch_tags: (row.branch_tags || "").split("|").map((s) => s.trim()).filter(Boolean),
        domain_tags: (row.domain_tags || "").split("|").map((s) => s.trim()).filter(Boolean),
        starting_from: Number(row.starting_from || 0),
        status: (row.status || "draft") as "draft" | "published" | "sold_out",
        gallery: [] as string[],
        features: [] as string[],
        tech_stack: [] as string[],
        deliverables: [] as string[],
        featured: false,
      };
      const { error } = await supabase.from("projects").insert(payload);
      notes.push(error ? `Row ${i + 1}: ${error.message}` : `Row ${i + 1}: imported ${title}`);
    }

    setLog(notes);
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-ink-muted">
        Header required:{" "}
        <code className="text-xs">
          title,short_description,full_description,category,target_year,branch_tags,domain_tags,starting_from,status
        </code>
      </p>
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
  );
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}
