import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("KRYV_OS ERROR: Missing Backend Credentials");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-world API utility for Agents
export const agentApi = {
  async list() {
    return await supabase.from('agents').select('*').order('created_at', { ascending: false });
  },
  
  async deploy(name: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized access");

    return await supabase.from('agents').insert([{
      name,
      owner_id: user.id,
      status: 'active',
      neural_load: Math.floor(Math.random() * 20)
    }]);
  },

  async toggleStatus(id: string, status: string) {
    return await supabase.from('agents').update({ status }).eq('id', id);
  }
};
