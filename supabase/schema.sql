-- Wedding invitation database schema for Supabase
-- Run this once in your Supabase project's SQL Editor (Dashboard > SQL Editor > New query)

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
  sent_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table site_settings enable row level security;
alter table wishes enable row level security;
alter table wa_guests enable row level security;

-- Anyone (including guests browsing the invite) can read site settings
create policy "Public can read settings" on site_settings
  for select using (true);

-- Only logged-in admins can update settings
create policy "Admins can update settings" on site_settings
  for update using (auth.role() = 'authenticated');
create policy "Admins can insert settings" on site_settings
  for insert with check (auth.role() = 'authenticated');

-- Anyone can read and submit wishes (RSVP form is public)
create policy "Public can read wishes" on wishes
  for select using (true);
create policy "Public can submit wishes" on wishes
  for insert with check (true);

-- Only admins can delete/moderate wishes
create policy "Admins can delete wishes" on wishes
  for delete using (auth.role() = 'authenticated');

-- wa_guests is fully admin-only (guest list must never be public)
create policy "Admins can manage wa_guests" on wa_guests
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed the single settings row with placeholder defaults (CMS will overwrite via first save)
insert into site_settings (id, couple, events, banks, photos, video_config, gift_address)
values (
  1,
  '{}'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, ''
)
on conflict (id) do nothing;
