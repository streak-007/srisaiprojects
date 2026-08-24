"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { BRANCH_TAGS, DOMAIN_TAGS, TARGET_YEARS } from "@/lib/constants";

export function ProjectFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value) next.delete(key);
      else next.set(key, value);
      startTransition(() => {
        router.push(`/projects?${next.toString()}`);
      });
    },
    [params, router],
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const current = params.get("q") ?? "";
      if (q !== current) update("q", q);
    }, 280);
    return () => window.clearTimeout(handle);
  }, [q, params, update]);

  return (
    <div className={`space-y-4 ${pending ? "opacity-70" : ""}`}>
      <input
        className="input-field"
        placeholder="Search projects, domains, keywords…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="chip"
          data-active={!params.get("year")}
          onClick={() => update("year", "")}
        >
          All years
        </button>
        {TARGET_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            className="chip"
            data-active={params.get("year") === String(y)}
            onClick={() => update("year", String(y))}
          >
            Year {y}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="chip" data-active={!params.get("branch")} onClick={() => update("branch", "")}>
          All branches
        </button>
        {BRANCH_TAGS.map((b) => (
          <button
            key={b}
            type="button"
            className="chip"
            data-active={params.get("branch") === b}
            onClick={() => update("branch", b)}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="chip" data-active={!params.get("domain")} onClick={() => update("domain", "")}>
          All domains
        </button>
        {DOMAIN_TAGS.map((d) => (
          <button
            key={d}
            type="button"
            className="chip"
            data-active={params.get("domain") === d}
            onClick={() => update("domain", d)}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
