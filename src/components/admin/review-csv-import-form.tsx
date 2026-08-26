"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

const SAMPLE_HREF = "/sample-reviews.csv";

export function ReviewCsvImportForm() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setLog([]);

    const file = new FormData(event.currentTarget).get("file");
    if (!(file instanceof File)) {
      setLog(["Choose a CSV file to import."]);
      setBusy(false);
      return;
    }

    const rows = parseCsv(await file.text());
    if (rows.length < 2) {
      setLog(["CSV needs a header row plus at least one review row."]);
      setBusy(false);
      return;
    }
    if (!isSupabaseConfigured()) {
      setLog(["Supabase not configured — nothing imported."]);
      setBusy(false);
      return;
    }

    const headers = rows[0].map((header) => header.trim().toLowerCase());
    const requiredHeaders = ["student_name", "college", "quote"];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
    if (missingHeaders.length) {
      setLog([`CSV is missing required column(s): ${missingHeaders.join(", ")}.`]);
      setBusy(false);
      return;
    }

    const supabase = createClient();
    const notes: string[] = [];
    for (let index = 1; index < rows.length; index += 1) {
      const values = rows[index];
      const row: Record<string, string> = {};
      headers.forEach((header, columnIndex) => {
        row[header] = (values[columnIndex] ?? "").trim();
      });

      if (!row.student_name || !row.college || !row.quote) {
        notes.push(`Row ${index + 1}: skipped (student_name, college, and quote are required).`);
        continue;
      }

      const rating = parseRating(row.rating);
      if (row.rating && rating === null) {
        notes.push(`Row ${index + 1}: skipped (rating must be a whole number from 1 to 5).`);
        continue;
      }

      const payload = {
        student_name: row.student_name,
        college: row.college,
        quote: row.quote,
        project_title: row.project_title || null,
        photo_url: row.photo_url || null,
        rating,
        published: parseBool(row.published),
      } satisfies Database["public"]["Tables"]["testimonials"]["Insert"];
      const { error } = await supabase.from("testimonials").insert(payload);
      notes.push(
        error
          ? `Row ${index + 1}: ${error.message}`
          : `Row ${index + 1}: imported review from “${row.student_name}” as ${payload.published ? "published" : "pending"}.`,
      );
    }

    setLog(notes);
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-ink-muted">
        <p className="font-semibold text-ink">How review CSV import works</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Download the sample file, retain the header row, and add one review per line.</li>
          <li>
            <code className="text-xs">student_name</code>, <code className="text-xs">college</code>, and{" "}
            <code className="text-xs">quote</code> are required.
          </li>
          <li>
            <code className="text-xs">published</code> is optional and defaults to <code className="text-xs">false</code>.
          </li>
        </ol>
        <a href={SAMPLE_HREF} download className="btn-secondary mt-4 !inline-flex !py-2 text-sm">
          Download sample reviews CSV
        </a>
      </section>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-ink">Upload your file</p>
        <input name="file" type="file" accept=".csv,text/csv" required className="block text-sm" />
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Importing…" : "Import reviews"}
        </button>
        {log.length ? (
          <ul className="max-h-64 space-y-1 overflow-auto text-sm text-ink-muted">
            {log.map((note, index) => (
              <li key={`${index}-${note}`}>{note}</li>
            ))}
          </ul>
        ) : null}
      </form>

      <section className="rounded-2xl border border-dashed border-line bg-paper/70 p-5 text-sm text-ink-muted">
        <p className="font-semibold text-ink">Column cheat sheet</p>
        <ul className="mt-3 space-y-1.5">
          <li><code className="text-xs">student_name</code>, <code className="text-xs">college</code>, <code className="text-xs">quote</code> — required</li>
          <li><code className="text-xs">project_title</code>, <code className="text-xs">photo_url</code> — optional</li>
          <li><code className="text-xs">rating</code> — optional whole number from 1 to 5</li>
          <li><code className="text-xs">published</code> — optional <code className="text-xs">true</code> or <code className="text-xs">false</code>; defaults to false</li>
        </ul>
      </section>
    </div>
  );
}

function parseBool(value?: string) {
  return /^(1|true|yes|y)$/i.test((value || "").trim());
}

function parseRating(value?: string) {
  if (!value) return null;
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
}

/** RFC-style CSV: quoted fields may contain commas and newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (character === '"' && next === '"') {
        current += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        current += character;
      }
      continue;
    }
    if (character === '"') {
      inQuotes = true;
    } else if (character === ",") {
      row.push(current);
      current = "";
    } else if (character === "\n") {
      row.push(current.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += character;
    }
  }

  row.push(current.replace(/\r$/, ""));
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  return rows.filter((currentRow) => currentRow.some((cell) => cell.trim() !== ""));
}
