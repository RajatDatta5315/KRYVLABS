// api.ts — re-exports supabase client and provides helper actions
export { supabase } from './supabase';

export const agentActions = {
  async fetchMyAgents(supabaseClient: any) {
    const { data, error } = await supabaseClient.from('agents').select('*');
    if (error) throw error;
    return data;
  },

  async updateAgentStatus(supabaseClient: any, id: string, status: 'idle' | 'working' | 'training' | 'offline') {
    const { data, error } = await supabaseClient
      .from('agents')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    return data;
  },
};
