import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  api_key: string;
};

export type Agent = {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'syncing' | 'error';
  neural_load: number;
};
