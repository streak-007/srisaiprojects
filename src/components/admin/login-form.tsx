"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured on this deployment. In Vercel → Settings → Environment Variables, set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then Redeploy.",
      );
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      const next = searchParams.get("next") || "/admin";
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow)]"
    >
      <div>
        <h1 className="font-display text-2xl font-extrabold">Admin login</h1>
        <p className="mt-1 text-sm text-ink-muted">Sign in with your Supabase Auth admin account.</p>
      </div>
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required className="input-field mt-1" autoComplete="username" />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input
          name="password"
          type="password"
          required
          className="input-field mt-1"
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
