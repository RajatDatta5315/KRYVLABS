import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Agent } from "@/pages/Dashboard";
import { Bot, Check, Clock, Cpu } from "lucide-react";

async function fetchAgents() {
    const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

interface AgentListProps {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent) => void;
}

const statusIconMap = {
    idle: <Check className="h-3 w-3 text-green-500" />,
    working: <Cpu className="h-3 w-3 text-kryv-cyan animate-pulse" />,
    training: <Clock className="h-3 w-3 text-amber-500" />,
    offline: <div className="h-3 w-3 bg-kryv-text-secondary rounded-full opacity-50"></div>,
};

export const AgentList = ({ selectedAgent, setSelectedAgent }: AgentListProps) => {
    const { data: agents, isLoading, isError } = useQuery({ queryKey: ['agents'], queryFn: fetchAgents });

    if (isLoading) return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-kryv-panel-dark animate-pulse"></div>
            ))}
        </div>
    );
    if (isError) return <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-white">Failed to load agents.</div>;
    if (!agents || agents.length === 0) return <p className="text-kryv-text-secondary text-sm text-center mt-8">No agents created yet.</p>;

    return (
        <div className="space-y-3">
            {agents.map((agent) => (
                <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-4 border-2  ${selectedAgent?.id === agent.id ? 'bg-kryv-panel-dark border-kryv-cyan shadow-lg shadow-kryv-cyan/10' : 'bg-transparent border-kryv-border hover:border-kryv-border hover:bg-kryv-panel-dark'}`}
                >
                    <div className={`mt-1 p-2 bg-kryv-bg-dark rounded-md border border-kryv-border ${selectedAgent?.id === agent.id ? 'border-kryv-cyan/50': 'border-kryv-border'}`}>
                        <Bot className={`h-5 w-5 ${selectedAgent?.id === agent.id ? 'text-kryv-cyan': 'text-kryv-text-secondary'}`} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-kryv-text-primary">{agent.name}</p>
                        <p className="text-xs text-kryv-text-secondary truncate">{agent.system_prompt}</p>
                        <div className="flex items-center gap-2 text-xs text-kryv-text-secondary mt-2">
                           {statusIconMap[agent.status]}
                           <span className="capitalize">{agent.status}</span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};
