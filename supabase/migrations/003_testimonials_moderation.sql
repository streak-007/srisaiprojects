-- Student reviews must be unpublished until an admin approves them.

alter table public.testimonials
  alter column published set default false;

alter table public.testimonials
  add column if not exists rating int;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'testimonials_rating_range'
  ) then
    alter table public.testimonials
      add constraint testimonials_rating_range
      check (rating is null or (rating >= 1 and rating <= 5));
  end if;
end $$;

grant insert on public.testimonials to anon, authenticated;

drop policy if exists testimonials_anon_insert on public.testimonials;
create policy testimonials_anon_insert on public.testimonials
  for insert
  to anon
  with check (published = false);
