"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  projectId: string;
  projectTitle: string;
  compact?: boolean;
};

export function DeleteProjectButton({ projectId, projectTitle, compact }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    const ok = window.confirm(`Delete “${projectTitle}”? This cannot be undone.`);
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/delete-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "inline-flex flex-col items-end gap-1" : "space-y-2"}>
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        className={
          compact
            ? "text-xs font-semibold text-danger hover:underline disabled:opacity-50"
            : "rounded-full border border-danger/40 px-4 py-2 text-sm font-bold text-danger hover:bg-danger/5 disabled:opacity-50"
        }
      >
        {busy ? "Deleting…" : "Delete"}
      </button>
      {error ? <p className="text-xs font-medium text-danger">{error}</p> : null}
    </div>
  );
}
