-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES: Link to Supabase Auth
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  api_token TEXT UNIQUE DEFAULT 'kr_' || encode(gen_random_bytes(16), 'hex'),
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'enterprise')),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AGENTS: The humanoid entities
CREATE TABLE agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model_id TEXT DEFAULT 'kryv-core-v1',
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'active', 'training', 'offline')),
  neural_load INTEGER DEFAULT 0,
  battery_level INTEGER DEFAULT 100,
  location_lat DECIMAL,
  location_lng DECIMAL,
  last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own agents" ON agents
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can only view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
