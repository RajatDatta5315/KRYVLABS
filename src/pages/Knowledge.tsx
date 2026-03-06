import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { BrainCircuit, Plus, Trash2, FileText, Loader } from 'lucide-react';

type Entry = { id: string; content: string; created_at: string };

const KnowledgePage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setEntries(await api.getKnowledge()); } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try { await api.addKnowledge(text); toast.success('Knowledge added'); setText(''); setAdding(false); load(); }
    catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try { await api.deleteKnowledge(id); toast.success('Entry removed'); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] text-lab-cyan tracking-widest uppercase mb-1">// knowledge_base</p>
          <h1 className="font-display font-bold text-xl text-white">Knowledge Base</h1>
          <p className="text-lab-muted text-xs mt-1">Feed custom knowledge to your agents for RAG retrieval</p>
        </div>
        <button onClick={() => setAdding(true)} className="lab-btn-primary flex items-center gap-2"><Plus className="h-3.5 w-3.5" /> Add Entry</button>
      </div>

      {adding && (
        <div className="lab-panel p-5 space-y-3">
          <p className="font-mono text-[10px] text-lab-cyan uppercase tracking-widest">// new_knowledge_chunk</p>
          <textarea className="lab-input h-32 resize-none text-xs" value={text} placeholder="Paste documents, facts, product specs, or any knowledge your agents should know..." onChange={e => setText(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={() => setAdding(false)} className="lab-btn-ghost px-5 py-2">Cancel</button>
            <button onClick={handleAdd} disabled={!text.trim() || saving} className="lab-btn-primary flex-1 py-2">{saving ? 'Saving...' : 'Store Knowledge'}</button>
          </div>
        </div>
      )}

      <div className="lab-panel overflow-hidden">
        <div className="px-5 py-3 border-b border-lab-border flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-lab-cyan" />
          <span className="font-mono text-xs text-lab-muted">{entries.length} chunks indexed</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader className="h-5 w-5 text-lab-cyan animate-spin" /></div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center"><FileText className="h-8 w-8 text-lab-muted mx-auto mb-3" /><p className="font-mono text-xs text-lab-muted">No knowledge entries yet</p></div>
        ) : (
          <div className="divide-y divide-lab-border">
            {entries.map(e => (
              <div key={e.id} className="px-5 py-4 flex items-start gap-4 hover:bg-lab-glow transition-colors group">
                <FileText className="h-4 w-4 text-lab-muted mt-0.5 flex-shrink-0" />
                <p className="flex-1 font-mono text-xs text-lab-text leading-relaxed line-clamp-2">{e.content}</p>
                <button onClick={() => handleDelete(e.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-lab-muted hover:text-red-500 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default KnowledgePage;
