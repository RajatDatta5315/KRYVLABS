import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BrainCircuit, Plus, Trash2, FileText, Loader } from 'lucide-react';

async function fetchKnowledge(userId: string) {
  const { data, error } = await supabase.from('knowledge').select('id, content, created_at').eq('owner_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

const KnowledgePage = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);

  const { data: entries, isLoading } = useQuery({
    queryKey: ['knowledge', user?.id],
    queryFn: () => fetchKnowledge(user!.id),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from('knowledge').insert({ content, owner_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Knowledge chunk added');
      setText('');
      setAdding(false);
      qc.invalidateQueries({ queryKey: ['knowledge'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('knowledge').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Entry removed');
      qc.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] text-lab-cyan tracking-widest uppercase mb-1">// knowledge_base</p>
          <h1 className="font-display font-bold text-xl text-white">Knowledge Base</h1>
          <p className="text-lab-muted text-xs mt-1">Feed custom knowledge to your agents for RAG retrieval</p>
        </div>
        <button onClick={() => setAdding(true)} className="lab-btn-primary flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" /> Add Entry
        </button>
      </div>

      {adding && (
        <div className="lab-panel p-5 space-y-3">
          <p className="font-mono text-[10px] text-lab-cyan uppercase tracking-widest">// new_knowledge_chunk</p>
          <textarea className="lab-input h-32 resize-none text-xs" value={text}
            placeholder="Paste documents, facts, product specs, or any knowledge your agents should know..."
            onChange={e => setText(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={() => setAdding(false)} className="lab-btn-ghost px-5 py-2">Cancel</button>
            <button onClick={() => addMutation.mutate(text)} disabled={!text.trim() || addMutation.isPending}
              className="lab-btn-primary flex-1 py-2">
              {addMutation.isPending ? 'Embedding...' : 'Store Knowledge'}
            </button>
          </div>
        </div>
      )}

      <div className="lab-panel overflow-hidden">
        <div className="px-5 py-3 border-b border-lab-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-lab-cyan" />
            <span className="font-mono text-xs text-lab-muted">{entries?.length || 0} chunks indexed</span>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="h-5 w-5 text-lab-cyan animate-spin" />
          </div>
        ) : !entries || entries.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-8 w-8 text-lab-muted mx-auto mb-3" />
            <p className="font-mono text-xs text-lab-muted">No knowledge entries yet</p>
          </div>
        ) : (
          <div className="divide-y divide-lab-border">
            {entries.map(entry => (
              <div key={entry.id} className="px-5 py-4 flex items-start gap-4 hover:bg-lab-glow transition-colors group">
                <FileText className="h-4 w-4 text-lab-muted mt-0.5 flex-shrink-0" />
                <p className="flex-1 font-mono text-xs text-lab-text leading-relaxed line-clamp-2">{entry.content}</p>
                <button onClick={() => deleteMutation.mutate(entry.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-lab-muted hover:text-lab-red transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default KnowledgePage;
