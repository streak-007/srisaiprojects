import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const requestId = body.request_id as string;
  const projectId = body.project_id as string;
  if (!requestId || !projectId) {
    return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  }

  const admin = createServiceClient();
  const expires = new Date();
  expires.setDate(expires.getDate() + 14);

  const { data: link, error } = await admin
    .from("detail_links")
    .insert({
      project_id: projectId,
      request_id: requestId,
      expires_at: expires.toISOString(),
      single_use: false,
    })
    .select("token")
    .single();

  if (error || !link) {
    return NextResponse.json({ error: error?.message || "Link create failed" }, { status: 500 });
  }

  await admin.from("detail_requests").update({ status: "approved" }).eq("id", requestId);

  return NextResponse.json({ token: link.token });
}
