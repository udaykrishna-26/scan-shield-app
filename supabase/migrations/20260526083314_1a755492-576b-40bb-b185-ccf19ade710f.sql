
-- Scans table
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  qr_content text not null,
  url text,
  threat_score int not null default 0,
  status text not null check (status in ('safe','suspicious','malicious')),
  reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index scans_user_created_idx on public.scans(user_id, created_at desc);

alter table public.scans enable row level security;

create policy "users select own scans" on public.scans
  for select to authenticated using (auth.uid() = user_id);

create policy "users insert own scans" on public.scans
  for insert to authenticated with check (auth.uid() = user_id);

create policy "users delete own scans" on public.scans
  for delete to authenticated using (auth.uid() = user_id);

-- Blacklist table
create table public.url_blacklist (
  id uuid primary key default gen_random_uuid(),
  domain text not null unique,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.url_blacklist enable row level security;

create policy "authenticated read blacklist" on public.url_blacklist
  for select to authenticated using (true);

insert into public.url_blacklist (domain, reason) values
  ('fakebank.xyz', 'Known phishing domain'),
  ('phish-pay.xyz', 'Payment phishing'),
  ('malicious-login.com', 'Credential harvesting');
