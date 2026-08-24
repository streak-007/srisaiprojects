import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { MOCK_ADDONS, MOCK_COMPONENTS } from "@/lib/mock-data";
import { getProjectById } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  let components = MOCK_COMPONENTS[id] ?? [];
  let addons = MOCK_ADDONS[id] ?? [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const [{ data: comps }, { data: ads }] = await Promise.all([
      supabase.from("project_components").select("*").eq("project_id", id),
      supabase.from("project_addons").select("*").eq("project_id", id),
    ]);
    if (comps) components = comps;
    if (ads) addons = ads;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">Edit project</h1>
      <div className="mt-6">
        <ProjectForm project={project} initialComponents={components} initialAddons={addons} />
      </div>
    </div>
  );
}
