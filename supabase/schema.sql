-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Function to update 'updated_at' column
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER on_profiles_update BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Agents Table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4o' NOT NULL,
  system_prompt TEXT,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'working', 'training', 'offline')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON public.agents(owner_id);
CREATE TRIGGER on_agents_update BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own agents" ON public.agents FOR ALL USING (auth.uid() = owner_id);

-- Tasks Table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instruction TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INT DEFAULT 0,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON public.tasks(agent_id);
CREATE TRIGGER on_tasks_update BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tasks" ON public.tasks FOR ALL USING (auth.uid() = owner_id);

-- Knowledge Base (for RAG)
CREATE TABLE public.knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON public.knowledge USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
ALTER TABLE public.knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own knowledge" ON public.knowledge FOR ALL USING (auth.uid() = owner_id);

-- Enable Realtime
alter publication supabase_realtime add table public.agents;
alter publication supabase_realtime add table public.tasks;

-- Function for Profile Auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
