import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Bot, Check, Cpu, Clock } from 'lucide-react';

type Agent = { id: string; name: string; model: string; status: string };
interface Props { selectedAgent: Agent | null; setSelectedAgent: (a: Agent) => void; }

export default function AgentList({ selectedAgent, setSelectedAgent }: Props) {
  const [agents, setAgents] = useState<Agent[]>([]);
  useEffect(() => { api.getAgents().then(setAgents).catch(() => {}); }, []);

  const statusIcon = (s: string) => s === 'working' ? <Cpu className="h-3 w-3 text-lab-amber animate-pulse" /> : s === 'training' ? <Clock className="h-3 w-3 text-amber-500" /> : <Check className="h-3 w-3 text-lab-green" />;
  return (
    <div className="space-y-2">
      {agents.map(a => (
        <button key={a.id} onClick={() => setSelectedAgent(a)} className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedAgent?.id===a.id?'border-lab-cyan bg-lab-cyan/5':'border-lab-border hover:border-lab-cyan/30'}`}>
          <div className={`p-2 rounded-lg border ${selectedAgent?.id===a.id?'border-lab-cyan/40 bg-lab-cyan/10':'border-lab-border bg-lab-bg'}`}><Bot className={`h-4 w-4 ${selectedAgent?.id===a.id?'text-lab-cyan':'text-lab-muted'}`} /></div>
          <div className="flex-1 min-w-0"><p className="font-mono font-bold text-xs text-white truncate">{a.name}</p><p className="font-mono text-[10px] text-lab-muted truncate">{a.model}</p></div>
          {statusIcon(a.status)}
        </button>
      ))}
    </div>
  );
}
