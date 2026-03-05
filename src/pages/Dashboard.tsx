import { AgentList } from '@/components/dashboard/AgentList';
import { TaskExecutor } from '@/components/dashboard/TaskExecutor';
import { TaskList } from '@/components/dashboard/TaskList';
import { AgentCreator } from '@/components/dashboard/AgentCreator';
import { CommandK } from '@/components/shared/CommandK';
import { useState } from 'react';
import { Database } from '@/lib/database.types';
import { Bot, Activity, Zap, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type Agent = Database['public']['Tables']['agents']['Row'];

async function fetchStats() {
  const { data: agents } = await supabase.from('agents').select('id, status');
  const { data: tasks } = await supabase.from('tasks').select('id, status').limit(100);
  return { agents: agents || [], tasks: tasks || [] };
}

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
  <div className="lab-panel p-4 flex items-center gap-3">
    <div className={`p-2 rounded-lg border ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="font-mono text-[10px] text-lab-muted uppercase tracking-widest">{label}</p>
      <p className="font-display font-bold text-white text-lg leading-tight">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats, refetchInterval: 5000 });

  const totalAgents = stats?.agents.length || 0;
  const activeAgents = stats?.agents.filter(a => a.status === 'working').length || 0;
  const completedTasks = stats?.tasks.filter(t => t.status === 'completed').length || 0;

  return (
    <>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] text-lab-cyan tracking-widest uppercase mb-1">// fleet control</p>
            <h1 className="font-display font-bold text-xl text-white">Agent Fleet</h1>
          </div>
          <AgentCreator />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Bot} label="Total Agents" value={totalAgents} color="border-lab-cyan/20 text-lab-cyan bg-lab-cyan/5" />
          <StatCard icon={Activity} label="Active Now" value={activeAgents} color="border-lab-green/20 text-lab-green bg-lab-green/5" />
          <StatCard icon={Zap} label="Tasks Done" value={completedTasks} color="border-lab-amber/20 text-lab-amber bg-lab-amber/5" />
          <StatCard icon={Clock} label="Uptime" value="99.9%" color="border-lab-cyan/20 text-lab-cyan bg-lab-cyan/5" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: 'calc(100vh - 260px)' }}>
          {/* Left: Agent List */}
          <div className="lg:col-span-4 lab-panel flex flex-col overflow-hidden">
            <div className="p-4 border-b border-lab-border flex-shrink-0">
              <p className="font-mono text-[10px] text-lab-muted">SELECT_AGENT://</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <AgentList selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} />
            </div>
          </div>

          {/* Right: Console */}
          <div className="lg:col-span-8 lab-panel flex flex-col overflow-hidden">
            {selectedAgent ? (
              <>
                {/* Console header */}
                <div className="p-4 border-b border-lab-border flex-shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-lab-amber/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-lab-green/70" />
                    </div>
                    <span className="font-mono text-[10px] text-lab-muted">
                      ROOT@KRYVLABS:{selectedAgent.name.toUpperCase()}:~#
                    </span>
                  </div>
                  <span className={`status-dot-${selectedAgent.status}`} />
                </div>
                {/* Task list */}
                <div className="flex-1 overflow-y-auto p-4">
                  <TaskList agentId={selectedAgent.id} />
                </div>
                {/* Input */}
                <div className="p-4 border-t border-lab-border flex-shrink-0">
                  <TaskExecutor agent={selectedAgent} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="p-5 rounded-2xl border border-dashed border-lab-border bg-lab-glow mb-5">
                  <Bot className="h-10 w-10 text-lab-muted" />
                </div>
                <p className="font-mono text-xs text-lab-cyan mb-1">// no agent selected</p>
                <p className="font-display font-bold text-white">Select an agent to open its console</p>
                <p className="text-lab-muted text-xs mt-2">Or create a new agent using the + button above</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <CommandK />
    </>
  );
};
export default DashboardPage;
