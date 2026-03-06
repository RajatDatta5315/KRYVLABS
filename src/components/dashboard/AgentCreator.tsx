import { useState } from 'react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Bot, Plus, X } from 'lucide-react';

export const AgentCreator = ({ onCreated }: { onCreated?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createAgent({ name, model: 'gpt-4o', system_prompt: systemPrompt });
      toast.success(`Agent "${name}" created`);
      setIsOpen(false); setName(''); setSystemPrompt('You are a helpful AI assistant.');
      onCreated?.();
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-md hover:bg-lab-panel transition-colors"><Plus className="h-5 w-5" /></button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="lab-panel w-full max-w-lg p-6 relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-lab-muted hover:text-white hover:bg-lab-glow transition-all"><X className="h-4 w-4" /></button>
            <p className="font-mono text-[10px] text-lab-cyan uppercase tracking-widest mb-4">// create_agent</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="font-mono text-[10px] text-lab-muted block mb-1.5">NAME</label><input className="lab-input" value={name} onChange={e=>setName(e.target.value)} required placeholder="Agent name" /></div>
              <div><label className="font-mono text-[10px] text-lab-muted block mb-1.5">SYSTEM PROMPT</label><textarea className="lab-input h-24 resize-none" value={systemPrompt} onChange={e=>setSystemPrompt(e.target.value)} rows={4} /></div>
              <button type="submit" disabled={saving} className="lab-btn-primary w-full py-3">{saving?'Creating...':'⚡ Create Agent'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
