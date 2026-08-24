"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
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
      setError("Add Supabase keys to .env.local, then create an Auth user in the dashboard.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow)]">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Admin login</h1>
        <p className="mt-1 text-sm text-ink-muted">Email / password via Supabase Auth.</p>
      </div>
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required className="input-field mt-1" />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input name="password" type="password" required className="input-field mt-1" />
      </label>
      {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
