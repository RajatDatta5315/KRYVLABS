import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const agentActions = {
  async fetchMyAgents() {
    const { data, error } = await supabase.from('agents').select('*');
    if (error) throw error;
    return data;
  },
  
  async updateAgentStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('agents')
      .update({ status, last_heartbeat: new Date() })
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async deployNewAgent(name: string) {
    const { data, error } = await supabase
      .from('agents')
      .insert([{ name, status: 'idle', neural_load: 0 }]);
    if (error) throw error;
    return data;
  }
};
