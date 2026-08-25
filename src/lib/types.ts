export type ProjectCategory = "final_year" | "minor";
export type ProjectStatus = "draft" | "published" | "sold_out";
export type AddonType = "flat" | "percent";
export type RequestStatus = "pending" | "approved" | "rejected";

export type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  category: ProjectCategory;
  target_year: number;
  branch_tags: string[];
  domain_tags: string[];
  cover_image_url: string | null;
  gallery: string[];
  status: ProjectStatus;
  starting_from: number;
  features: string[];
  tech_stack: string[];
  demo_video_url: string | null;
  deliverables: string[];
  timeline_days: number | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectComponent = {
  id: string;
  project_id: string;
  name: string;
  quantity: number;
  unit_cost: number;
};

export type ProjectAddon = {
  id: string;
  project_id: string;
  name: string;
  type: AddonType;
  value: number;
};

export type DetailRequest = {
  id: string;
  project_id: string;
  student_name: string;
  phone: string;
  email: string;
  college: string;
  year: number;
  branch: string;
  status: RequestStatus;
  created_at: string;
  projects?: Pick<Project, "id" | "title" | "slug"> | null;
};

export type Testimonial = {
  id: string;
  student_name: string;
  college: string;
  quote: string;
  project_title: string | null;
  photo_url: string | null;
  published: boolean;
  rating: number | null;
  created_at: string;
};

export type DetailLink = {
  id: string;
  project_id: string;
  request_id: string | null;
  token: string;
  expires_at: string | null;
  opened_at: string | null;
  single_use: boolean;
  created_at: string;
};
