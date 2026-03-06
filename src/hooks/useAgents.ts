// Legacy hook — uses api-client internally
import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
export const useAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getAgents().then(setAgents).catch(() => {}).finally(() => setLoading(false)); }, []);
  return { agents, loading };
};
