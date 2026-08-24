"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  projectTitle?: string;
  compact?: boolean;
};

export function CopyPrivateLinkButton({ projectId, compact }: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function createAndCopy() {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/share-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create link");
      await navigator.clipboard.writeText(data.url);
      setStatus("Private link copied");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not copy link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "inline-flex flex-col items-end gap-1" : "space-y-2"}>
      <button
        type="button"
        onClick={createAndCopy}
        disabled={busy}
        className={
          compact
            ? "text-xs font-semibold text-teal hover:text-teal-deep disabled:opacity-50"
            : "btn-secondary !py-2 text-sm"
        }
      >
        {busy ? "Creating…" : "Copy private link"}
      </button>
      {status ? <p className="text-xs font-medium text-ink-muted">{status}</p> : null}
    </div>
  );
}
