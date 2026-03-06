import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { CheckCircle2, Clock, XCircle, Loader } from 'lucide-react';

type Task = { id: string; instruction: string; status: string; result?: string; created_at: string };

export default function TaskList({ agentId }: { agentId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;
    const load = async () => { setLoading(true); setTasks(await api.getTasks(agentId).catch(() => [])); setLoading(false); };
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [agentId]);

  if (loading) return <div className="flex justify-center py-8"><Loader className="h-5 w-5 text-lab-cyan animate-spin" /></div>;
  if (!tasks.length) return <p className="text-lab-muted text-xs font-mono text-center py-8">No tasks yet</p>;

  return (
    <div className="space-y-3">
      {tasks.map(t => (
        <div key={t.id} className="p-4 bg-lab-bg rounded-lg border border-lab-border">
          <div className="flex justify-between items-start gap-4 mb-2">
            <p className="text-xs font-medium text-white flex-1 font-mono">{t.instruction}</p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {t.status==='completed'&&<CheckCircle2 className="h-3.5 w-3.5 text-lab-green" />}
              {t.status==='failed'&&<XCircle className="h-3.5 w-3.5 text-red-500" />}
              {t.status==='processing'&&<Loader className="h-3.5 w-3.5 text-lab-cyan animate-spin" />}
              {t.status==='pending'&&<Clock className="h-3.5 w-3.5 text-lab-muted" />}
              <span className="text-[10px] text-lab-muted font-mono capitalize">{t.status}</span>
            </div>
          </div>
          {t.status==='completed'&&t.result&&(
            <pre className="text-[11px] text-lab-muted font-mono whitespace-pre-wrap leading-relaxed border-t border-lab-border pt-2 mt-2">
              {(() => { try { return JSON.parse(t.result)?.content || t.result; } catch { return t.result; } })()}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
