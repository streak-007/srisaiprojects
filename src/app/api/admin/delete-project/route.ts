import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/env";
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
  const projectId = body.project_id as string;
  if (!projectId) {
    return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
  }

  const { data: deletedProjects, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select("id, slug");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const deletedProject = deletedProjects?.[0];
  if (!deletedProject) {
    return NextResponse.json(
      { error: "Project was not deleted. It may no longer exist or you do not have permission." },
      { status: 404 },
    );
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${deletedProject.slug}`);

  return NextResponse.json({ ok: true, deleted_project_id: deletedProject.id });
}
