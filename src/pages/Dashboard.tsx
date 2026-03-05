import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { Bot, Activity, Zap, Clock, Plus, Send, X, Loader, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

type Agent = { id: string; name: string; model: string; system_prompt: string; status: string };
type Task = { id: string; instruction: string; status: string; result?: string; created_at: string };

const StatusDot = ({ status }: { status: string }) => {
  const cls = { idle: 'bg-lab-cyan/60', working: 'bg-lab-amber animate-pulse', training: 'bg-lab-green animate-pulse', offline: 'bg-lab-muted' };
  return <span className={`w-2 h-2 rounded-full ${cls[status as keyof typeof cls] || 'bg-lab-muted'}`} />;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [instruction, setInstruction] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', model: 'gpt-4o', system_prompt: 'You are a helpful AI assistant.' });
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadAgents = useCallback(async () => {
    try { setAgents(await api.getAgents()); } catch (e: any) { toast.error(e.message); }
  }, []);

  const loadTasks = useCallback(async (agentId: string) => {
    setLoadingTasks(true);
    try { setTasks(await api.getTasks(agentId)); } catch (e: any) { toast.error(e.message); }
    setLoadingTasks(false);
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);
  useEffect(() => { if (selected) loadTasks(selected.id); }, [selected, loadTasks]);

  // Poll for task updates
  useEffect(() => {
    if (!selected) return;
    const t = setInterval(() => loadTasks(selected.id), 3000);
    return () => clearInterval(t);
  }, [selected, loadTasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createAgent(form);
      toast.success(`Agent "${form.name}" deployed`);
      setShowCreate(false);
      setForm({ name: '', model: 'gpt-4o', system_prompt: 'You are a helpful AI assistant.' });
      loadAgents();
    } catch (e: any) { toast.error(e.message); }
    setCreating(false);
  };

  const handleSend = async () => {
    if (!instruction.trim() || !selected) return;
    setSending(true);
    try {
      await api.createTask(selected.id, instruction);
      setInstruction('');
      toast.success('Task dispatched');
      loadTasks(selected.id);
    } catch (e: any) { toast.error(e.message); }
    setSending(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header + stats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] text-lab-cyan tracking-widest uppercase mb-0.5">// fleet_control</p>
          <h1 className="font-display font-bold text-xl text-white">Agent Fleet</h1>
        </div>
        <button onClick={() => setShowCreate(true)} className="lab-btn-primary flex items-center gap-1.5 px-4 py-2">
          <Plus className="h-3.5 w-3.5" /> New Agent
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Bot, label: 'Total Agents', value: agents.length, color: 'border-lab-cyan/20 text-lab-cyan bg-lab-cyan/5' },
          { icon: Activity, label: 'Active Now', value: agents.filter(a => a.status === 'working').length, color: 'border-lab-green/20 text-lab-green bg-lab-green/5' },
          { icon: Zap, label: 'Fleet Size', value: agents.length, color: 'border-lab-amber/20 text-lab-amber bg-lab-amber/5' },
          { icon: Clock, label: 'Uptime', value: '99.9%', color: 'border-lab-cyan/20 text-lab-cyan bg-lab-cyan/5' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`lab-panel p-4 flex items-center gap-3 border ${color}`}>
            <div className={`p-2 rounded-lg border ${color}`}><Icon className="h-4 w-4" /></div>
            <div>
              <p className="font-mono text-[10px] text-lab-muted uppercase tracking-widest">{label}</p>
              <p className="font-display font-bold text-white text-lg leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: 'calc(100vh - 280px)' }}>
        {/* Agent list */}
        <div className="lg:col-span-4 lab-panel flex flex-col overflow-hidden">
          <div className="p-4 border-b border-lab-border flex-shrink-0">
            <p className="font-mono text-[10px] text-lab-muted">SELECT_AGENT://</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {agents.length === 0 && <p className="text-lab-muted text-xs text-center mt-8 font-mono">No agents yet. Create one ↗</p>}
            {agents.map(agent => (
              <button key={agent.id} onClick={() => setSelected(agent)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${selected?.id === agent.id ? 'border-lab-cyan bg-lab-cyan/5' : 'border-lab-border hover:border-lab-cyan/30 hover:bg-lab-glow'}`}>
                <div className={`p-2 rounded-lg border ${selected?.id === agent.id ? 'border-lab-cyan/40 bg-lab-cyan/10' : 'border-lab-border bg-lab-bg'}`}>
                  <Bot className={`h-4 w-4 ${selected?.id === agent.id ? 'text-lab-cyan' : 'text-lab-muted'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-xs text-white truncate">{agent.name}</p>
                  <p className="font-mono text-[10px] text-lab-muted truncate">{agent.model}</p>
                </div>
                <StatusDot status={agent.status} />
              </button>
            ))}
          </div>
        </div>

        {/* Console */}
        <div className="lg:col-span-8 lab-panel flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="p-4 border-b border-lab-border flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-lab-amber/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-lab-green/70" />
                  </div>
                  <span className="font-mono text-[10px] text-lab-muted">ROOT@KRYVLABS:{selected.name.toUpperCase()}:~#</span>
                </div>
                <StatusDot status={selected.status} />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingTasks && <div className="flex items-center justify-center py-8"><Loader className="h-5 w-5 text-lab-cyan animate-spin" /></div>}
                {!loadingTasks && tasks.length === 0 && <p className="text-lab-muted text-xs font-mono text-center mt-8">No tasks yet. Send your first instruction ↓</p>}
                {tasks.map(task => (
                  <div key={task.id} className="p-4 bg-lab-bg rounded-lg border border-lab-border">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <p className="text-xs font-medium text-white flex-1 font-mono">{task.instruction}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5 text-lab-green" />}
                        {task.status === 'failed' && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                        {task.status === 'processing' && <Loader className="h-3.5 w-3.5 text-lab-cyan animate-spin" />}
                        <span className="text-[10px] text-lab-muted font-mono capitalize">{task.status}</span>
                      </div>
                    </div>
                    {task.status === 'completed' && task.result && (
                      <pre className="text-[11px] text-lab-muted font-mono whitespace-pre-wrap leading-relaxed border-t border-lab-border pt-2 mt-2">
                        {typeof task.result === 'string' ? JSON.parse(task.result)?.content || task.result : (task.result as any)?.content}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-lab-border flex-shrink-0 flex gap-2">
                <input className="lab-input flex-1 text-xs" placeholder="Give your agent a task..." value={instruction}
                  onChange={e => setInstruction(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()} />
                <button onClick={handleSend} disabled={sending || !instruction.trim()}
                  className="lab-btn-primary px-4 py-2 flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5" />{sending ? '...' : 'Run'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="p-5 rounded-2xl border border-dashed border-lab-border bg-lab-glow mb-5">
                <Bot className="h-10 w-10 text-lab-muted" />
              </div>
              <p className="font-mono text-xs text-lab-cyan mb-1">// no agent selected</p>
              <p className="font-display font-bold text-white">Select an agent to open its console</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="lab-panel w-full max-w-lg p-6 space-y-4 relative">
            <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-lab-muted hover:text-white hover:bg-lab-glow transition-all">
              <X className="h-4 w-4" />
            </button>
            <p className="font-mono text-[10px] text-lab-cyan uppercase tracking-widest">// create_agent</p>
            <h2 className="font-display font-bold text-white text-lg">New Agent</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] text-lab-muted block mb-1.5">AGENT NAME</label>
                <input className="lab-input" value={form.name} placeholder="e.g. DataAnalyst-v1"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="font-mono text-[10px] text-lab-muted block mb-1.5">MODEL</label>
                <select className="lab-input" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))}>
                  {['gpt-4o', 'gpt-4o-mini', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] text-lab-muted block mb-1.5">SYSTEM PROMPT</label>
                <textarea className="lab-input h-28 resize-none text-xs" value={form.system_prompt}
                  onChange={e => setForm(f => ({ ...f, system_prompt: e.target.value }))} />
              </div>
              <button type="submit" disabled={creating} className="lab-btn-primary w-full py-3">
                {creating ? 'Deploying...' : '⚡ Deploy Agent'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
