-- Create profiles for users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  api_key text unique default 'sk_' || encode(gen_random_bytes(24), 'hex')
);

-- AI Agents table
create table public.agents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  status text check (status in ('online', 'offline', 'syncing', 'error')) default 'online',
  neural_load integer default 0,
  last_ping timestamp with time zone default now(),
  config jsonb default '{"temp": 0.7, "model": "kryv-alpha-1"}'::jsonb
);

-- Security Policies
alter table public.profiles enable row level security;
alter table public.agents enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own agents" on public.agents for select using (auth.uid() = user_id);
create policy "Users can insert own agents" on public.agents for insert with check (auth.uid() = user_id);
