import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Rocket, CheckCircle2, Upload, ExternalLink, Bot } from 'lucide-react';

const KRIYEX_API = 'https://kriyex.kryv.network/api/agents/list';

async function fetchMyAgents(userId: string) {
  const { data, error } = await supabase.from('agents').select('*').eq('owner_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

const PublishPage = () => {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ desc: '', price: '25', avatar: '', repoUrl: '' });
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const { data: agents } = useQuery({
    queryKey: ['my-agents', user?.id],
    queryFn: () => fetchMyAgents(user!.id),
    enabled: !!user,
  });

  const selectedAgent = agents?.find(a => a.id === selectedId);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `agent-avatars/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setForm(f => ({ ...f, avatar: data.publicUrl }));
      toast.success('Avatar uploaded');
    } catch (e: any) {
      toast.error('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedAgent) return toast.error('Select an agent first');
    if (!form.avatar) return toast.error('Upload an avatar image');
    if (!form.desc.trim()) return toast.error('Add a description');
    setPublishing(true);
    try {
      const res = await fetch(KRIYEX_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedAgent.name,
          desc: form.desc,
          price: form.price,
          avatar: form.avatar,
          repoUrl: form.repoUrl || `https://github.com/search?q=${selectedAgent.name}`,
        }),
      });
      if (!res.ok) throw new Error('KRIYEX API rejected the request');
      toast.success(`"${selectedAgent.name}" is now live on KRIYEX Marketplace!`);
      setPublished(true);
    } catch (e: any) {
      toast.error('Publish failed: ' + e.message);
    } finally {
      setPublishing(false);
    }
  };

  if (published) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto mt-16 text-center">
        <div className="lab-panel p-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-lab-green/10 border border-lab-green/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-lab-green" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-lab-green uppercase tracking-widest mb-2">// publish_success</p>
            <h2 className="font-display font-bold text-xl text-white">Agent Live on KRIYEX</h2>
            <p className="text-lab-muted text-xs mt-2">Your agent is now discoverable in the KRIYEX marketplace</p>
          </div>
          <a href="https://kriyex.kryv.network" target="_blank" rel="noopener noreferrer"
            className="lab-btn-primary inline-flex items-center gap-2 px-6 py-3">
            <ExternalLink className="h-3.5 w-3.5" />
            View on KRIYEX →
          </a>
          <button onClick={() => { setPublished(false); setSelectedId(null); setForm({ desc: '', price: '25', avatar: '', repoUrl: '' }); }}
            className="block w-full lab-btn-ghost py-2.5">
            Publish Another Agent
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-5">
      <div>
        <p className="font-mono text-[10px] text-lab-cyan tracking-widest uppercase mb-1">// publish_to_marketplace</p>
        <h1 className="font-display font-bold text-xl text-white">Publish → KRIYEX</h1>
        <p className="text-lab-muted text-xs mt-1">Deploy your KRYVLABS agent to the KRIYEX marketplace — like Google Studio's Publish to GitHub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Select Agent */}
        <div className="lab-panel p-5 space-y-3">
          <p className="font-mono text-[10px] text-lab-muted uppercase tracking-widest">01 // Select Agent</p>
          {!agents || agents.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-8 w-8 text-lab-muted mx-auto mb-3" />
              <p className="font-mono text-xs text-lab-muted">No agents in fleet yet.</p>
              <a href="/builder" className="text-lab-cyan text-xs font-mono hover:underline mt-2 block">Build one first →</a>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {agents.map(agent => (
                <button key={agent.id} onClick={() => setSelectedId(agent.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedId === agent.id
                      ? 'border-lab-cyan bg-lab-cyan/10 text-lab-cyan'
                      : 'border-lab-border text-lab-muted hover:bg-lab-glow hover:border-lab-cyan/30'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md border ${selectedId === agent.id ? 'border-lab-cyan/40 bg-lab-cyan/10' : 'border-lab-border bg-lab-bg'}`}>
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-xs">{agent.name}</p>
                      <p className="font-mono text-[10px] opacity-60">{agent.model}</p>
                    </div>
                    {selectedId === agent.id && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-lab-cyan" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Configure listing */}
        <div className="lab-panel p-5 space-y-4">
          <p className="font-mono text-[10px] text-lab-muted uppercase tracking-widest">02 // Configure Listing</p>

          {/* Avatar upload */}
          <div>
            <label className="font-mono text-[10px] text-lab-muted block mb-2">Avatar Image</label>
            <label className={`relative flex flex-col items-center justify-center h-24 rounded-lg border border-dashed cursor-pointer transition-all ${
              form.avatar ? 'border-lab-cyan/40 bg-lab-cyan/5' : 'border-lab-border hover:border-lab-cyan/30 hover:bg-lab-glow'
            }`}>
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAvatarUpload} />
              {form.avatar ? (
                <div className="flex items-center gap-3">
                  <img src={form.avatar} className="h-12 w-12 rounded-lg object-cover border border-lab-cyan/30" />
                  <div className="text-left">
                    <CheckCircle2 className="h-4 w-4 text-lab-green mb-1" />
                    <p className="font-mono text-[10px] text-lab-green">Avatar ready</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-lab-muted mb-1" />
                  <p className="font-mono text-[10px] text-lab-muted">{uploading ? 'Uploading...' : 'Click to upload'}</p>
                </>
              )}
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="font-mono text-[10px] text-lab-muted block mb-2">Marketplace Description</label>
            <textarea className="lab-input h-20 resize-none text-xs" value={form.desc}
              placeholder="What does this agent do? Who is it for?"
              onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
          </div>

          {/* Price */}
          <div>
            <label className="font-mono text-[10px] text-lab-muted block mb-2">Monthly Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lab-muted font-mono text-xs">$</span>
              <input type="number" className="lab-input pl-7" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
          </div>

          {/* Repo URL */}
          <div>
            <label className="font-mono text-[10px] text-lab-muted block mb-2">GitHub Repo URL (optional)</label>
            <input className="lab-input text-xs" value={form.repoUrl} placeholder="https://github.com/..."
              onChange={e => setForm(f => ({ ...f, repoUrl: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Publish button */}
      <div className="lab-panel p-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-white font-bold">
            {selectedAgent ? `Publishing: ${selectedAgent.name}` : 'No agent selected'}
          </p>
          <p className="font-mono text-[10px] text-lab-muted mt-0.5">
            Target: <span className="text-lab-cyan">kriyex.kryv.network/marketplace</span>
          </p>
        </div>
        <button onClick={handlePublish} disabled={publishing || !selectedId}
          className="lab-btn-primary flex items-center gap-2 px-6 py-3 text-sm">
          <Rocket className="h-4 w-4" />
          {publishing ? 'Publishing...' : 'Publish to KRIYEX'}
        </button>
      </div>
    </div>
  );
};
export default PublishPage;
