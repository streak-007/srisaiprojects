export function getSupabaseUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
}

/** Supports classic anon JWT key and newer publishable keys. */
export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key && !url.includes("YOUR_PROJECT"));
}
