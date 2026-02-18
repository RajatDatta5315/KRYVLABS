-- Drop old agents table if exists for fresh start
drop table if exists agents;

create table agents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  status text default 'online' check (status in ('online', 'idle', 'offline')),
  neural_load integer default 0,
  battery_level integer default 100,
  user_id uuid default auth.uid()
);

-- Turn on real-time for this table
alter publication supabase_realtime add table agents;
