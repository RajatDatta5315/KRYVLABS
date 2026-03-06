import { useState } from 'react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

export default function TaskExecutor({ agentId, onTaskCreated }: { agentId: string; onTaskCreated?: () => void }) {
  const [instruction, setInstruction] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!instruction.trim() || !agentId) return;
    setSending(true);
    try { await api.createTask(agentId, instruction); setInstruction(''); toast.success('Task dispatched'); onTaskCreated?.(); }
    catch (e: any) { toast.error(e.message); }
    setSending(false);
  };

  return (
    <div className="flex gap-2">
      <input className="lab-input flex-1 text-xs" placeholder="Give your agent a task..." value={instruction}
        onChange={e=>setInstruction(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} />
      <button onClick={handleSend} disabled={sending||!instruction.trim()} className="lab-btn-primary px-4 py-2 flex items-center gap-1.5">
        <Send className="h-3.5 w-3.5" />{sending?'...':'Run'}
      </button>
    </div>
  );
}
