"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

type Props = {
  review?: Testimonial;
};

export function ReviewAdminForm({ review }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const ratingNum = Number(form.get("rating") || 0);
    const payload = {
      student_name: String(form.get("student_name") || ""),
      college: String(form.get("college") || ""),
      project_title: String(form.get("project_title") || "") || null,
      quote: String(form.get("quote") || ""),
      rating: ratingNum >= 1 && ratingNum <= 5 ? ratingNum : null,
      published: form.get("published") === "on",
    };

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    if (review) {
      const { error: upErr } = await supabase.from("testimonials").update(payload).eq("id", review.id);
      if (upErr) {
        setError(upErr.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insErr } = await supabase.from("testimonials").insert(payload);
      if (insErr) {
        setError(insErr.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/reviews");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-semibold">
        Student name
        <input name="student_name" required className="input-field mt-1" defaultValue={review?.student_name} />
      </label>
      <label className="block text-sm font-semibold">
        College
        <input name="college" required className="input-field mt-1" defaultValue={review?.college} />
      </label>
      <label className="block text-sm font-semibold">
        Project title
        <input name="project_title" className="input-field mt-1" defaultValue={review?.project_title ?? ""} />
      </label>
      <label className="block text-sm font-semibold">
        Rating
        <select name="rating" className="input-field mt-1" defaultValue={review?.rating ?? ""}>
          <option value="">No rating</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Review
        <textarea name="quote" required className="input-field mt-1 min-h-28" defaultValue={review?.quote} />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="published" defaultChecked={review?.published} />
        Published on Stories page
      </label>
      {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? "Saving…" : review ? "Update review" : "Add review"}
      </button>
    </form>
  );
}
