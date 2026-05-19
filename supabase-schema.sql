-- ============================================================
-- Whispers — Supabase Schema
-- Run this in: https://app.supabase.com → SQL Editor → New Query
-- ============================================================

-- 1. Create the whispers table
create table public.whispers (
  id           uuid default gen_random_uuid() primary key,
  created_at   timestamptz default now() not null,
  sent_at      timestamptz default now() not null,
  trigger      text,                    -- what made you think of her (optional)
  message      text not null,           -- the actual whisper (required)
  mood         text,                    -- 'tender' | 'playful' | 'missing you' | 'grateful' | 'proud'
  location_name text,                   -- where you were (optional, manual)
  is_read      boolean default false not null,
  sender_id    text default 'aankit'   -- for future extensibility
);

-- 2. Enable Row Level Security
alter table public.whispers enable row level security;

-- 3. Policy: allow all operations for anonymous users
--    (since we handle auth via PIN in the frontend, not Supabase auth)
create policy "Allow all for anon" on public.whispers
  for all
  to anon
  using (true)
  with check (true);

-- 4. Enable Realtime for this table
--    (Go to: Supabase Dashboard → Database → Replication → whispers → enable)
--    Or run:
alter publication supabase_realtime add table public.whispers;

-- 5. Create index for faster date queries
create index whispers_sent_at_idx on public.whispers (sent_at desc);

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
