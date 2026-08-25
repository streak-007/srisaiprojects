import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/** Create (or reuse) a project-level private full-details link for sharing. */
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
  const projectId = body.project_id as string;
  if (!projectId) {
    return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
  }

  const admin = createServiceClient();

  const { data: project } = await admin
    .from("projects")
    .select("title, starting_from")
    .eq("id", projectId)
    .maybeSingle();

  const { data: existing } = await admin
    .from("detail_links")
    .select("token")
    .eq("project_id", projectId)
    .is("request_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let token = existing?.token;

  if (!token) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 90);
    const { data: link, error } = await admin
      .from("detail_links")
      .insert({
        project_id: projectId,
        request_id: null,
        expires_at: expires.toISOString(),
        single_use: false,
      })
      .select("token")
      .single();

    if (error || !link) {
      return NextResponse.json({ error: error?.message || "Link create failed" }, { status: 500 });
    }
    token = link.token;
  }

  const url = `${siteUrl()}/full/${token}`;
  return NextResponse.json({
    token,
    url,
    title: project?.title ?? null,
    starting_from: project?.starting_from ?? null,
  });
}
