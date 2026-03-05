import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useAgentEngine = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      if (data) setAgents(data);
    };
    fetchAgents();

    const channel = supabase
      .channel('agent-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setAgents(prev => [payload.new as any, ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // deployAgent is a legacy helper — owner_id required by schema so this is demo-only
  const deployAgent = async (name: string, ownerId: string) => {
    setIsDeploying(true);
    const { data, error } = await supabase.from('agents').insert({
      name,
      owner_id: ownerId,
      status: 'idle' as const,
      model: 'gpt-4o',
    });
    setIsDeploying(false);
    return { data, error };
  };

  return { agents, deployAgent, isDeploying };
};
