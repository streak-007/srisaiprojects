"use client";

import { useState } from "react";
import { BRANCH_TAGS, TARGET_YEARS } from "@/lib/constants";

type Props = {
  projectId: string;
  projectTitle: string;
};

export function RequestForm({ projectId, projectTitle }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      project_id: projectId,
      student_name: String(form.get("student_name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      college: String(form.get("college") || ""),
      year: Number(form.get("year") || 0),
      branch: String(form.get("branch") || ""),
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
      setMessage("Request sent! We’ll share a private full-details link after review.");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send right now. Try WhatsApp or retry in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-white/90 p-5 shadow-[var(--shadow)]">
      <div>
        <h2 className="font-display text-xl font-bold text-ink">Request full details</h2>
        <p className="mt-1 text-sm text-ink-muted">
          For <span className="font-semibold text-ink">{projectTitle}</span>. We’ll reply with a private link.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Name
          <input name="student_name" required className="input-field mt-1" />
        </label>
        <label className="block text-sm font-semibold">
          WhatsApp / phone
          <input name="phone" required className="input-field mt-1" />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input name="email" type="email" required className="input-field mt-1" />
        </label>
        <label className="block text-sm font-semibold">
          College
          <input name="college" required className="input-field mt-1" />
        </label>
        <label className="block text-sm font-semibold">
          Year
          <select name="year" required className="input-field mt-1" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {TARGET_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Branch
          <select name="branch" required className="input-field mt-1" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {BRANCH_TAGS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send request"}
      </button>

      {message ? (
        <p className={`text-sm font-medium ${status === "error" ? "text-danger" : "text-success"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
