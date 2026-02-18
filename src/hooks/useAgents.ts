import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*');
      
      if (!error) setAgents(data);
      setLoading(false);
    };

    fetchAgents();
  }, []);

  return { agents, loading };
};
