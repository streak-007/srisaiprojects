"use client";

import { useState } from "react";

export function ReviewForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      student_name: String(form.get("student_name") || ""),
      college: String(form.get("college") || ""),
      project_title: String(form.get("project_title") || ""),
      quote: String(form.get("quote") || ""),
      rating: Number(form.get("rating") || 0) || null,
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
      setMessage("Thanks — your review was sent. It appears on the site after we approve it.");
      formElement.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send the review. Try again or message us on WhatsApp.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-line bg-white/90 p-5 shadow-[var(--shadow)]"
    >
      <div>
        <h2 className="font-display text-xl font-bold text-ink">Share your experience</h2>
        <p className="mt-1 text-sm text-ink-muted">
          For students after delivery. We read every review before it goes live on Stories.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Your name
          <input name="student_name" required className="input-field mt-1" />
        </label>
        <label className="block text-sm font-semibold">
          College
          <input name="college" required className="input-field mt-1" />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Project you received
          <input name="project_title" className="input-field mt-1" placeholder="Optional" />
        </label>
        <label className="block text-sm font-semibold">
          Rating
          <select name="rating" className="input-field mt-1" defaultValue="5">
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Good</option>
            <option value="3">3 — Okay</option>
            <option value="2">2 — Below expectation</option>
            <option value="1">1 — Poor</option>
          </select>
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Your review
          <textarea name="quote" required minLength={20} className="input-field mt-1 min-h-28" />
        </label>
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit for approval"}
      </button>
      {message ? (
        <p className={`text-sm font-medium ${status === "error" ? "text-danger" : "text-success"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
