"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

type Props = {
  reviews: Testimonial[];
};

export function ReviewsTable({ reviews: initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [message, setMessage] = useState("");

  async function setPublished(id: string, published: boolean) {
    if (!isSupabaseConfigured()) {
      setMessage("Configure Supabase to moderate reviews.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").update({ published }).eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setRows((r) => r.map((x) => (x.id === id ? { ...x, published } : x)));
    router.refresh();
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete review from ${name}?`)) return;
    if (!isSupabaseConfigured()) {
      setMessage("Configure Supabase to delete reviews.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-medium text-danger">{message}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-3 py-3">Student</th>
              <th className="px-3 py-3">Review</th>
              <th className="px-3 py-3">Rating</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">When</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line/70 align-top">
                <td className="px-3 py-3">
                  <p className="font-semibold">{r.student_name}</p>
                  <p className="text-ink-muted">{r.college}</p>
                  {r.project_title ? (
                    <p className="mt-1 text-xs font-semibold text-teal">{r.project_title}</p>
                  ) : null}
                </td>
                <td className="max-w-sm px-3 py-3 text-ink-muted">{r.quote}</td>
                <td className="px-3 py-3">{r.rating ? `${r.rating}/5` : "—"}</td>
                <td className="px-3 py-3">{r.published ? "Published" : "Pending"}</td>
                <td className="px-3 py-3">{formatDate(r.created_at)}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-col items-start gap-2">
                    <Link href={`/admin/reviews/${r.id}`} className="font-semibold text-teal">
                      Edit
                    </Link>
                    {r.published ? (
                      <button
                        type="button"
                        className="text-xs font-semibold text-ink-muted"
                        onClick={() => setPublished(r.id, false)}
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-xs font-semibold text-success"
                        onClick={() => setPublished(r.id, true)}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-xs font-semibold text-danger"
                      onClick={() => remove(r.id, r.student_name)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <p className="p-6 text-center text-ink-muted">No reviews yet.</p>
        ) : null}
      </div>
    </div>
  );
}
