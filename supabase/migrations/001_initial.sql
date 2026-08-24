-- Sri Sai Projects — initial schema + RLS + storage
-- Run in Supabase SQL Editor (or via supabase db push)

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  full_description text not null default '',
  category text not null check (category in ('final_year', 'minor')),
  target_year int not null check (target_year in (2, 3, 4)),
  branch_tags text[] not null default '{}',
  domain_tags text[] not null default '{}',
  cover_image_url text,
  gallery text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'sold_out')),
  starting_from numeric(12,2) not null default 0,
  features text[] not null default '{}',
  tech_stack text[] not null default '{}',
  demo_video_url text,
  deliverables text[] not null default '{}',
  timeline_days int,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_featured_idx on public.projects (featured) where featured = true;

create table if not exists public.project_components (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  quantity numeric(12,2) not null default 1,
  unit_cost numeric(12,2) not null default 0
);

create index if not exists project_components_project_id_idx on public.project_components (project_id);

create table if not exists public.project_addons (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  type text not null check (type in ('flat', 'percent')),
  value numeric(12,2) not null default 0
);

create index if not exists project_addons_project_id_idx on public.project_addons (project_id);

create table if not exists public.detail_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  student_name text not null,
  phone text not null,
  email text not null,
  college text not null,
  year int not null,
  branch text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists detail_requests_status_idx on public.detail_requests (status);
create index if not exists detail_requests_project_id_idx on public.detail_requests (project_id);

create table if not exists public.detail_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  request_id uuid references public.detail_requests (id) on delete set null,
  token uuid not null unique default gen_random_uuid(),
  expires_at timestamptz,
  opened_at timestamptz,
  single_use boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists detail_links_token_idx on public.detail_links (token);
create index if not exists detail_links_project_id_idx on public.detail_links (project_id);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  college text not null,
  quote text not null,
  project_title text,
  photo_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- RLS
alter table public.projects enable row level security;
alter table public.project_components enable row level security;
alter table public.project_addons enable row level security;
alter table public.detail_requests enable row level security;
alter table public.detail_links enable row level security;
alter table public.testimonials enable row level security;

-- Public read published projects
create policy projects_public_read on public.projects
  for select
  to anon, authenticated
  using (status = 'published');

-- Authenticated admins: full access (single-tenant admin users)
create policy projects_admin_all on public.projects
  for all
  to authenticated
  using (true)
  with check (true);

-- Components / add-ons are private (full breakdown only via service-role token page)
create policy components_admin_all on public.project_components
  for all
  to authenticated
  using (true)
  with check (true);

create policy addons_admin_all on public.project_addons
  for all
  to authenticated
  using (true)
  with check (true);

-- Anyone can submit a request; only authenticated can read/update
create policy requests_anon_insert on public.detail_requests
  for insert
  to anon, authenticated
  with check (true);

create policy requests_admin_select on public.detail_requests
  for select
  to authenticated
  using (true);

create policy requests_admin_update on public.detail_requests
  for update
  to authenticated
  using (true)
  with check (true);

-- detail_links: no public table access (server uses service role)
create policy links_admin_all on public.detail_links
  for all
  to authenticated
  using (true)
  with check (true);

create policy testimonials_public_read on public.testimonials
  for select
  to anon, authenticated
  using (published = true);

create policy testimonials_admin_all on public.testimonials
  for all
  to authenticated
  using (true)
  with check (true);

-- Grants for Data API
grant usage on schema public to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant all on public.projects to authenticated;
grant all on public.project_components to authenticated;
grant all on public.project_addons to authenticated;
grant insert on public.detail_requests to anon, authenticated;
grant select, update on public.detail_requests to authenticated;
grant all on public.detail_links to authenticated;
grant select on public.testimonials to anon, authenticated;
grant all on public.testimonials to authenticated;

-- Storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

create policy project_media_public_read on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'project-media');

create policy project_media_admin_insert on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-media');

create policy project_media_admin_update on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-media')
  with check (bucket_id = 'project-media');

create policy project_media_admin_delete on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-media');
