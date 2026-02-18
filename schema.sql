-- Enable Row Level Security
alter table profiles enable row level security;
alter table agents enable row level security;

-- Profiles table (linked to Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  tier text default 'basic' check (tier in ('basic', 'pro', 'enterprise'))
);

-- Agents table
create table agents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  model_type text not null,
  status text default 'idle' check (status in ('idle', 'training', 'active', 'offline')),
  config jsonb default '{}'::jsonb
);

-- Policies
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Users can view own agents." on agents for select using (auth.uid() = user_id);
create policy "Users can create agents." on agents for insert with check (auth.uid() = user_id);
