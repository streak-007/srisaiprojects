import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** Uptime pingers hit this to keep Supabase free tier from pausing. */
export async function GET() {
  const started = Date.now();
  let db: "ok" | "skipped" | "error" = "skipped";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("projects").select("id").limit(1);
      db = error ? "error" : "ok";
    } catch {
      db = "error";
    }
  }

  return NextResponse.json({
    status: "ok",
    db,
    ms: Date.now() - started,
    ts: new Date().toISOString(),
  });
}
