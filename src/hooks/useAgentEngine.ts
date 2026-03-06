// Legacy hook — kept for backward compat, uses api-client internally
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export const useAgentEngine = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  useEffect(() => { api.getAgents().then(setAgents).catch(() => {}); }, []);
  const deployAgent = async (name: string) => {
    setIsDeploying(true);
    const result = await api.createAgent({ name, model: 'gpt-4o', system_prompt: 'You are a helpful AI assistant.' }).catch(e => ({ error: e }));
    setIsDeploying(false);
    return result;
  };
  return { agents, deployAgent, isDeploying };
};
