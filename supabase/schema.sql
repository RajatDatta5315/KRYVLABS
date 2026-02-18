-- Extension for vector stats or complex JSON if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. AGENTS TABLE (The Physical/Digital Entity)
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  behavior_mode TEXT DEFAULT 'autonomous' CHECK (behavior_mode IN ('autonomous', 'assistive', 'defensive')),
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'executing', 'learning', 'offline')),
  neural_load INTEGER DEFAULT 0,
  current_task TEXT,
  memory_fragment JSONB DEFAULT '[]'::jsonb,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TASKS TABLE (What the agents are actually doing)
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  instruction TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  progress INTEGER DEFAULT 0,
  result TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own agents" ON public.agents FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users own tasks" ON public.tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.agents WHERE id = tasks.agent_id AND owner_id = auth.uid())
);
