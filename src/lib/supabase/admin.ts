import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/env";
import type { Database } from "./database.types";

/** Server-only. Never import into client components. */
export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or URL");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
