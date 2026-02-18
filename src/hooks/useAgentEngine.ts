import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useAgentEngine = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  // 1. Initial Fetch
  useEffect(() => {
    const fetchAgents = async () => {
      const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      if (data) setAgents(data);
    };
    fetchAgents();

    // 2. Real-time Subscription
    const channel = supabase
      .channel('agent-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setAgents(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const deployAgent = async (name: string) => {
    setIsDeploying(true);
    const { data, error } = await supabase.from('agents').insert([
      { name, status: 'active', neural_load: Math.floor(Math.random() * 40) + 10 }
    ]);
    setIsDeploying(false);
    return { data, error };
  };

  return { agents, deployAgent, isDeploying };
};
