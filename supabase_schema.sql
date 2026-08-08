-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  body text not null,
  nickname text not null,
  hearts int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  text text not null,
  nickname text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table stories enable row level security;
alter table comments enable row level security;

-- Public read access (anyone can view posts)
create policy "public read stories" on stories for select using (true);
create policy "public read comments" on comments for select using (true);

-- Public insert access (anyone can post anonymously)
-- Note: this has no auth, so anyone can write. Add rate limiting
-- (e.g. Supabase Edge Function + IP check, or Cloudflare Turnstile)
-- before public launch to prevent spam/abuse.
create policy "public insert stories" on stories for insert with check (true);
create policy "public insert comments" on comments for insert with check (true);

-- Public update access limited to the hearts counter only would need
-- a Postgres function in production; for now this allows updates to
-- any column, so lock this down before real launch.
create policy "public update stories" on stories for update using (true);

-- Realtime: enable replication so the app's live subscription works
alter publication supabase_realtime add table stories;
alter publication supabase_realtime add table comments;
