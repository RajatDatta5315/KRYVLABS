import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Agent } from "@/pages/Dashboard";
import { Bot } from "lucide-react";

async function fetchAgents() {
    const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

interface AgentListProps {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent) => void;
}

export const AgentList = ({ selectedAgent, setSelectedAgent }: AgentListProps) => {
    const { data: agents, isLoading, isError } = useQuery({
        queryKey: ['agents'],
        queryFn: fetchAgents,
    });

    if (isLoading) return (
        <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-kryv-panel-dark animate-pulse"></div>
            ))}
        </div>
    );
    if (isError) return <p className="text-red-500">Failed to load agents.</p>;
    if (!agents || agents.length === 0) return <p className="text-kryv-text-secondary text-sm">No agents created yet.</p>;

    return (
        <div className="space-y-2 overflow-y-auto">
            {agents.map((agent) => (
                <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left p-4 rounded-lg transition-colors flex items-center gap-4 border ${selectedAgent?.id === agent.id ? 'bg-kryv-panel-dark border-kryv-cyan' : 'bg-transparent border-kryv-border hover:bg-kryv-panel-dark'}`}
                >
                    <Bot className={`h-5 w-5 ${agent.status === 'working' ? 'text-kryv-cyan animate-pulse': 'text-kryv-text-secondary'}`} />
                    <div className="flex-1">
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-kryv-text-secondary">{agent.model}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};
