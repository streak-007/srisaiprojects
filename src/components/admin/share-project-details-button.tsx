"use client";

import { useState } from "react";
import { formatInr } from "@/lib/format";
import { whatsappUrl } from "@/lib/constants";

type Props = {
  projectId: string;
  projectTitle?: string;
  startingFrom?: number;
  compact?: boolean;
};

export function ShareProjectDetailsButton({
  projectId,
  projectTitle,
  startingFrom,
  compact,
}: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function share() {
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

      const title = data.title || projectTitle || "this project";
      const from = Number(data.starting_from ?? startingFrom ?? 0);
      const estimateLine = from > 0 ? `Starting from ${formatInr(from)}.\n` : "";
      const message = `Full project details for ${title}.\n${estimateLine}${data.url}`;

      await navigator.clipboard.writeText(message).catch(() => undefined);

      if (navigator.share) {
        await navigator.share({ title, text: message, url: data.url }).catch(() => {
          window.open(whatsappUrl(message), "_blank");
        });
      } else {
        window.open(whatsappUrl(message), "_blank");
      }

      setStatus("Link copied — share chat opened");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not share");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "inline-flex flex-col items-end gap-1" : "space-y-2"}>
      <button
        type="button"
        onClick={share}
        disabled={busy}
        className={
          compact
            ? "text-xs font-semibold text-teal hover:text-teal-deep disabled:opacity-50"
            : "btn-secondary !py-2 text-sm"
        }
      >
        {busy ? "Preparing…" : "Share project details"}
      </button>
      {status ? <p className="text-xs font-medium text-ink-muted">{status}</p> : null}
    </div>
  );
}
