-- Wedding invitation database schema for Supabase
-- Run this in your Supabase project's SQL Editor (Dashboard > SQL Editor > New query).
-- It is safe to re-run: existing projects can run it again to pick up changes.
--
-- AFTER RUNNING: make your CMS account an admin (step 5 below). Being logged
-- in is not enough on its own — otherwise anyone who signs up to your
-- Supabase project could edit the invitation or read the guest list.

-- 1. Single-row settings table holding couple info, events, banks, gallery, video config, gift address
create table if not exists site_settings (
  id int primary key default 1,
  couple jsonb not null,
  events jsonb not null,
  banks jsonb not null,
  photos jsonb not null,
  video_config jsonb not null,
  gift_address text not null,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
-- Dress code (attire, color palette, colors to avoid, notes); added later.
alter table site_settings add column if not exists dress_code jsonb not null default '{}'::jsonb;

-- 2. Guest RSVPs / wishes — guests can insert their own, everyone can read, only admin can delete
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null check (status in ('Hadir', 'Masih Ragu', 'Tidak Hadir')),
  guest_count int not null default 1,
  message text not null,
  created_at timestamptz not null default now()
);

-- 3. WhatsApp guest list for the blaster feature — admin-only, never public
create table if not exists wa_guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  category text not null default 'Umum',
  session text not null default 'Akad & Resepsi',
  status text not null default 'pending',
  -- Display label set by the CMS ("14.05", "Manual", "Semua"), not a timestamp
  sent_at text,
  notes text,
  created_at timestamptz not null default now()
);
alter table wa_guests alter column sent_at type text using sent_at::text;

-- 4. Admins: the only accounts allowed to change content
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table admins enable row level security;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- 5. Register your CMS login as admin. Create the user first under
-- Authentication > Users, then replace the email below and run:
--
--   insert into admins (user_id)
--   select id from auth.users where email = 'you@example.com'
--   on conflict do nothing;
--
-- Also turn off public sign-ups: Authentication > Sign In / Providers >
-- "Allow new users to sign up".

-- Row Level Security
alter table site_settings enable row level security;
alter table wishes enable row level security;
alter table wa_guests enable row level security;

-- Anyone (including guests browsing the invite) can read site settings
drop policy if exists "Public can read settings" on site_settings;
create policy "Public can read settings" on site_settings
  for select using (true);

-- Only admins can update settings
drop policy if exists "Admins can update settings" on site_settings;
create policy "Admins can update settings" on site_settings
  for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can insert settings" on site_settings;
create policy "Admins can insert settings" on site_settings
  for insert with check (is_admin());

-- Anyone can read and submit wishes (RSVP form is public)
drop policy if exists "Public can read wishes" on wishes;
create policy "Public can read wishes" on wishes
  for select using (true);
drop policy if exists "Public can submit wishes" on wishes;
create policy "Public can submit wishes" on wishes
  for insert with check (true);

-- Only admins can delete/moderate wishes
drop policy if exists "Admins can delete wishes" on wishes;
create policy "Admins can delete wishes" on wishes
  for delete using (is_admin());

-- wa_guests is fully admin-only (guest list must never be public)
drop policy if exists "Admins can manage wa_guests" on wa_guests;
create policy "Admins can manage wa_guests" on wa_guests
  for all using (is_admin()) with check (is_admin());

-- 6. Public Storage bucket for photos, music and video uploaded from the CMS.
-- Files are publicly readable (guests need them); only admins can upload.
insert into storage.buckets (id, name, public)
values ('wedding-media', 'wedding-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read wedding media" on storage.objects;
create policy "Public can read wedding media" on storage.objects
  for select using (bucket_id = 'wedding-media');
drop policy if exists "Admins can upload wedding media" on storage.objects;
create policy "Admins can upload wedding media" on storage.objects
  for insert with check (bucket_id = 'wedding-media' and is_admin());
drop policy if exists "Admins can delete wedding media" on storage.objects;
create policy "Admins can delete wedding media" on storage.objects
  for delete using (bucket_id = 'wedding-media' and is_admin());

-- 7. Snapshots of the settings row taken before bulk data changes (admin
-- maintenance only; no policies, so it is not reachable via the public API).
create table if not exists site_settings_backup (
  backed_up_at timestamptz not null default now(),
  reason text not null,
  row_data jsonb not null
);
alter table site_settings_backup enable row level security;

-- 8. Limits on guest wishes (the RSVP form enforces the same; anyone can insert).
alter table wishes drop constraint if exists wishes_name_length;
alter table wishes add constraint wishes_name_length check (char_length(btrim(name)) between 1 and 80);
alter table wishes drop constraint if exists wishes_message_length;
alter table wishes add constraint wishes_message_length check (char_length(btrim(message)) between 1 and 500);
alter table wishes drop constraint if exists wishes_guest_count_range;
alter table wishes add constraint wishes_guest_count_range check (guest_count between 1 and 10);

-- 9. Several admins (CMS > Keamanan & Kata Sandi > Akun Admin). The account is
-- created under Authentication > Users; add_admin grants it CMS access.
-- Removing an admin: delete its row from the admins table.
create or replace function public.list_admins()
returns table (user_id uuid, email text, added_at timestamptz, is_me boolean)
language sql stable security definer set search_path = public, auth
as $$
  select a.user_id, u.email::text, u.created_at, a.user_id = auth.uid()
  from admins a join auth.users u on u.id = a.user_id
  where public.is_admin()
  order by u.created_at;
$$;

create or replace function public.add_admin(admin_email text)
returns text
language plpgsql security definer set search_path = public, auth
as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(admin_email));
  if uid is null then return 'not_found'; end if;
  if exists (select 1 from admins where user_id = uid) then return 'already_admin'; end if;
  insert into admins(user_id) values (uid);
  return 'added';
end $$;

revoke all on function public.list_admins() from public, anon;
revoke all on function public.add_admin(text) from public, anon;
grant execute on function public.list_admins() to authenticated;
grant execute on function public.add_admin(text) to authenticated;

-- 10. Editing at the same time from several devices. The CMS saves only what
-- changed: object columns merge their top-level keys, list/text columns are
-- replaced when present. SECURITY INVOKER, so the update RLS policy applies.
create or replace function public.patch_site_settings(patch jsonb)
returns timestamptz
language plpgsql security invoker set search_path = public
as $$
declare ts timestamptz;
begin
  update site_settings set
    couple       = case when patch ? 'couple'       then coalesce(couple, '{}'::jsonb)       || (patch->'couple')       else couple end,
    video_config = case when patch ? 'video_config' then coalesce(video_config, '{}'::jsonb) || (patch->'video_config') else video_config end,
    dress_code   = case when patch ? 'dress_code'   then coalesce(dress_code, '{}'::jsonb)   || (patch->'dress_code')   else dress_code end,
    events       = case when patch ? 'events'       then patch->'events'       else events end,
    banks        = case when patch ? 'banks'        then patch->'banks'        else banks end,
    photos       = case when patch ? 'photos'       then patch->'photos'       else photos end,
    gift_address = case when patch ? 'gift_address' then patch->>'gift_address' else gift_address end,
    updated_at   = now()
  where id = 1
  returning updated_at into ts;
  if ts is null then raise exception 'settings row not found or not allowed'; end if;
  return ts;
end $$;
revoke all on function public.patch_site_settings(jsonb) from public, anon;
grant execute on function public.patch_site_settings(jsonb) to authenticated;

-- Live updates between CMS devices (RLS still decides who receives what).
do $$ begin
  alter publication supabase_realtime add table public.site_settings, public.wa_guests, public.wishes;
exception when duplicate_object then null;
end $$;

-- 11. Whose guest each WhatsApp contact is (groom's or bride's side; null = not set).
alter table wa_guests add column if not exists owner text;
alter table wa_guests drop constraint if exists wa_guests_owner_check;
alter table wa_guests add constraint wa_guests_owner_check check (owner is null or owner in ('groom', 'bride'));

-- Seed the single settings row with placeholder defaults (CMS will overwrite via first save)
insert into site_settings (id, couple, events, banks, photos, video_config, gift_address)
values (
  1,
  '{}'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, ''
)
on conflict (id) do nothing;
