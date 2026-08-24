"use client";

import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink-muted hover:bg-paper hover:text-ink"
    >
      Sign out
    </button>
  );
}
