"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";
import { siteUrl, whatsappUrl } from "@/lib/constants";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { DetailRequest } from "@/lib/types";

type Props = {
  requests: DetailRequest[];
};

export function RequestsTable({ requests: initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [message, setMessage] = useState("");

  async function reject(id: string) {
    if (!isSupabaseConfigured()) {
      setMessage("Configure Supabase to update requests.");
      return;
    }
    const supabase = createClient();
    await supabase.from("detail_requests").update({ status: "rejected" }).eq("id", id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "rejected" } : x)));
    router.refresh();
  }

  async function approve(row: DetailRequest) {
    if (!isSupabaseConfigured()) {
      setMessage("Configure Supabase to approve and generate links.");
      return;
    }
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: row.id, project_id: row.project_id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Approve failed");
      return;
    }
    const link = `${siteUrl()}/full/${data.token}`;
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, status: "approved" } : x)));
    setMessage(`Approved. Link: ${link}`);
    await navigator.clipboard.writeText(link).catch(() => undefined);
    window.open(
      whatsappUrl(
        `Hi ${row.student_name}, here is your private full-details link for ${row.projects?.title ?? "your project"}: ${link}`,
      ),
      "_blank",
    );
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-xl border border-line bg-white p-3 text-sm font-medium text-ink break-all">
          {message}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-3 py-3">Student</th>
              <th className="px-3 py-3">Project</th>
              <th className="px-3 py-3">Contact</th>
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
                  <p className="text-ink-muted">
                    Year {r.year} · {r.branch}
                  </p>
                  <p className="text-ink-muted">{r.college}</p>
                </td>
                <td className="px-3 py-3">{r.projects?.title ?? r.project_id}</td>
                <td className="px-3 py-3">
                  <p>{r.phone}</p>
                  <p className="text-ink-muted">{r.email}</p>
                </td>
                <td className="px-3 py-3 capitalize">{r.status}</td>
                <td className="px-3 py-3">{formatDate(r.created_at)}</td>
                <td className="px-3 py-3">
                  {r.status === "pending" ? (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="btn-primary !px-3 !py-1.5 text-xs"
                        onClick={() => approve(r)}
                      >
                        Approve & link
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-danger"
                        onClick={() => reject(r.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <p className="p-6 text-center text-ink-muted">No requests yet.</p>
        ) : null}
      </div>
    </div>
  );
}
