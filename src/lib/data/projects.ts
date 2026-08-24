import { isSupabaseConfigured } from "@/lib/env";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export type ProjectFilters = {
  q?: string;
  year?: string;
  branch?: string;
  domain?: string;
  category?: string;
};

function filterMock(filters: ProjectFilters = {}) {
  return MOCK_PROJECTS.filter((p) => {
    if (p.status !== "published") return false;
    if (filters.year && String(p.target_year) !== filters.year) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.branch && !p.branch_tags.includes(filters.branch)) return false;
    if (filters.domain && !p.domain_tags.includes(filters.domain)) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hay = `${p.title} ${p.short_description} ${p.branch_tags.join(" ")} ${p.domain_tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export async function getPublishedProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  if (!isSupabaseConfigured()) return filterMock(filters);

  const supabase = await createClient();
  let query = supabase.from("projects").select("*").eq("status", "published");

  if (filters.year) query = query.eq("target_year", Number(filters.year));
  if (filters.category === "final_year" || filters.category === "minor") {
    query = query.eq("category", filters.category);
  }
  if (filters.branch) query = query.contains("branch_tags", [filters.branch]);
  if (filters.domain) query = query.contains("domain_tags", [filters.domain]);
  if (filters.q) query = query.or(
    `title.ilike.%${filters.q}%,short_description.ilike.%${filters.q}%`,
  );

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error || !data) return filterMock(filters);
  return data.map(normalizeProject);
}

function normalizeProject(row: Project): Project {
  return {
    ...row,
    starting_from: Number(row.starting_from) || 0,
    gallery: row.gallery ?? [],
    features: row.features ?? [],
    tech_stack: row.tech_stack ?? [],
    deliverables: row.deliverables ?? [],
    branch_tags: row.branch_tags ?? [],
    domain_tags: row.domain_tags ?? [],
  };
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_PROJECTS.filter((p) => p.featured && p.status === "published").slice(0, 3);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3);
  if (error || !data?.length) {
    return MOCK_PROJECTS.filter((p) => p.featured).slice(0, 3);
  }
  return data.map(normalizeProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PROJECTS.find((p) => p.slug === slug && p.status === "published") ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) {
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  return normalizeProject(data as Project);
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return MOCK_PROJECTS;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return MOCK_PROJECTS;
  return data.map(normalizeProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
  return normalizeProject(data as Project);
}
