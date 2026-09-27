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

-- Seed the single settings row with placeholder defaults (CMS will overwrite via first save)
insert into site_settings (id, couple, events, banks, photos, video_config, gift_address)
values (
  1,
  '{}'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, ''
)
on conflict (id) do nothing;
