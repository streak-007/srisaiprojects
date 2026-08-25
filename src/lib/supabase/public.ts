import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Cookie-free client for public RLS reads. Safe during `next build`
 * (no incoming request, so `cookies()` is unavailable).
 */
export function createPublicClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error("Supabase URL or anon/publishable key is missing");
  }

  return createSupabaseClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
