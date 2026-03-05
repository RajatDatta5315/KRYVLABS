import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Bot, ChevronRight, Cpu, Code2, Wand2 } from 'lucide-react';

const MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', tier: 'top' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI', tier: 'fast' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet', provider: 'Anthropic', tier: 'top' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku', provider: 'Anthropic', tier: 'fast' },
  { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B', provider: 'Groq', tier: 'fast' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', provider: 'Groq', tier: 'fast' },
];

const PRESETS = [
  { label: 'General Assistant', prompt: 'You are a helpful, precise AI assistant. You give clear, concise answers and ask for clarification when needed.' },
  { label: 'Code Reviewer', prompt: 'You are an expert code reviewer. Analyze code for bugs, security issues, performance problems, and style inconsistencies. Provide actionable feedback.' },
  { label: 'Data Analyst', prompt: 'You are a senior data analyst. Help analyze datasets, write SQL queries, interpret statistics, and create data-driven insights.' },
  { label: 'SEO Specialist', prompt: 'You are an SEO expert. Help with keyword research, content optimization, technical SEO, and search ranking strategies.' },
  { label: 'Social Media Manager', prompt: 'You are a creative social media manager. Generate engaging posts, caption ideas, hashtag strategies, and content calendars across platforms.' },
  { label: 'Research Synthesizer', prompt: 'You are a research assistant. Summarize complex papers, extract key findings, compare sources, and present information clearly.' },
];

const AgentBuilderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', model: 'gpt-4o', system_prompt: '', tags: '' });
  const [loading, setLoading] = useState(false);

  const handlePreset = (prompt: string) => setForm(f => ({ ...f, system_prompt: prompt }));

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error('Agent name required');
    if (!form.system_prompt.trim()) return toast.error('System prompt required');
    setLoading(true);
    try {
      const { error } = await supabase.from('agents').insert({
        name: form.name, model: form.model, system_prompt: form.system_prompt, owner_id: user!.id
      });
      if (error) throw error;
      toast.success(`Agent "${form.name}" deployed to fleet`);
      navigate('/');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-5">
      <div>
        <p className="font-mono text-[10px] text-lab-cyan tracking-widest uppercase mb-1">// agent_builder</p>
        <h1 className="font-display font-bold text-xl text-white">Build New Agent</h1>
        <p className="text-lab-muted text-xs mt-1">Configure and deploy a new autonomous agent to your fleet</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div onClick={() => s < step && setStep(s)}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs border transition-all cursor-pointer ${
                step === s ? 'bg-lab-cyan text-lab-bg border-lab-cyan'
                : step > s ? 'bg-lab-cyan/20 text-lab-cyan border-lab-cyan/40'
                : 'bg-transparent text-lab-muted border-lab-border'
              }`}>
              {step > s ? '✓' : s}
            </div>
            <span className="font-mono text-[10px] text-lab-muted hidden sm:block">
              {['Identity', 'Intelligence', 'Review'][i]}
            </span>
            {i < 2 && <ChevronRight className="h-3 w-3 text-lab-border mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Identity */}
      {step === 1 && (
        <div className="lab-panel p-6 space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-4 w-4 text-lab-cyan" />
            <p className="font-mono text-xs text-lab-cyan">STEP 01 // IDENTITY</p>
          </div>
          <div>
            <label className="font-mono text-[10px] text-lab-muted uppercase tracking-widest block mb-2">Agent Name</label>
            <input className="lab-input" value={form.name} placeholder="e.g., DataMaster-v1, TradingBot-Pro"
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <p className="text-lab-muted text-[10px] mt-1 font-mono">This will be the agent's identity in your fleet and on KRIYEX marketplace</p>
          </div>
          <div>
            <label className="font-mono text-[10px] text-lab-muted uppercase tracking-widest block mb-2">Select LLM Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setForm(f => ({ ...f, model: m.id }))}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    form.model === m.id
                      ? 'border-lab-cyan bg-lab-cyan/10 text-lab-cyan'
                      : 'border-lab-border text-lab-muted hover:border-lab-cyan/40 hover:bg-lab-glow'
                  }`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-xs">{m.label}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      m.tier === 'top' ? 'border-lab-amber/40 text-lab-amber bg-lab-amber/10' : 'border-lab-green/40 text-lab-green bg-lab-green/10'
                    }`}>{m.tier}</span>
                  </div>
                  <p className="text-[10px] opacity-60 mt-0.5">{m.provider}</p>
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(2)} disabled={!form.name} className="lab-btn-primary w-full py-3">
            Next: Set Intelligence →
          </button>
        </div>
      )}

      {/* Step 2: Intelligence */}
      {step === 2 && (
        <div className="lab-panel p-6 space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-4 w-4 text-lab-cyan" />
            <p className="font-mono text-xs text-lab-cyan">STEP 02 // INTELLIGENCE</p>
          </div>
          <div>
            <label className="font-mono text-[10px] text-lab-muted uppercase tracking-widest block mb-2">Quick Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => handlePreset(p.prompt)}
                  className="lab-btn-ghost py-1.5 text-left justify-start flex items-center gap-1.5">
                  <Wand2 className="h-3 w-3" />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] text-lab-muted uppercase tracking-widest block mb-2">
              System Prompt <span className="text-lab-cyan">*</span>
            </label>
            <textarea className="lab-input h-44 resize-none" value={form.system_prompt}
              placeholder="You are an expert AI agent specialized in..."
              onChange={e => setForm(f => ({ ...f, system_prompt: e.target.value }))} />
            <div className="flex justify-between mt-1">
              <p className="text-lab-muted text-[10px] font-mono">Define your agent's behavior, expertise, and constraints</p>
              <p className="text-lab-muted text-[10px] font-mono">{form.system_prompt.length} chars</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="lab-btn-ghost flex-1 py-3">← Back</button>
            <button onClick={() => setStep(3)} disabled={!form.system_prompt} className="lab-btn-primary flex-1 py-3">
              Review Agent →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="lab-panel p-6 space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-4 w-4 text-lab-cyan" />
            <p className="font-mono text-xs text-lab-cyan">STEP 03 // REVIEW & DEPLOY</p>
          </div>
          <div className="bg-lab-bg rounded-xl border border-lab-border p-5 space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-lab-border">
              <span className="text-lab-muted text-xs">agent.identity</span>
              <span className="text-white font-bold">{form.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-lab-border">
              <span className="text-lab-muted text-xs">agent.model</span>
              <span className="text-lab-cyan">{form.model}</span>
            </div>
            <div className="pb-3">
              <span className="text-lab-muted text-xs block mb-2">agent.system_prompt</span>
              <p className="text-lab-text text-xs leading-relaxed line-clamp-4">{form.system_prompt}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lab-muted text-xs">deploy.target</span>
              <span className="text-lab-green text-xs">KRYVLABS Fleet</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="lab-btn-ghost flex-1 py-3">← Edit</button>
            <button onClick={handleCreate} disabled={loading} className="lab-btn-primary flex-1 py-3">
              {loading ? 'Deploying...' : '⚡ Deploy Agent'}
            </button>
          </div>
          <p className="text-center font-mono text-[10px] text-lab-muted">
            After deploying, publish to KRIYEX marketplace from the Publish tab
          </p>
        </div>
      )}
    </div>
  );
};
export default AgentBuilderPage;
