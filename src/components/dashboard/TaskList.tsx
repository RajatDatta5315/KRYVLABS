import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { Database } from '@/lib/database.types';
import { CheckCircle2, Clock, Code, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Task = Database['public']['Tables']['tasks']['Row'];

async function fetchTasks(agentId: string) {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(20);
    if (error) throw new Error(error.message);
    return data;
}

const statusIcons = {
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    processing: <div className="h-4 w-4 border-2 border-kryv-text-secondary border-t-kryv-cyan rounded-full animate-spin"></div>,
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    failed: <XCircle className="h-4 w-4 text-red-500" />,
};

export const TaskList = ({ agentId }: { agentId: string }) => {
    const { data: tasks, isLoading, refetch } = useQuery({
        queryKey: ['tasks', agentId],
        queryFn: () => fetchTasks(agentId),
    });

    useEffect(() => {
        const channel = supabase.channel(`realtime-tasks-for-${agentId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `agent_id=eq.${agentId}` }, () => {
                refetch();
            }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [agentId, refetch]);

    if (isLoading) return <div className="text-kryv-text-secondary text-center p-8">Loading task history...</div>;
    if (!tasks || tasks.length === 0) return <div className="text-kryv-text-secondary text-sm p-8 text-center bg-kryv-bg-dark rounded-xl">This agent has not performed any tasks yet.</div>

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {tasks.map((task: Task) => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-kryv-bg-dark rounded-lg border border-kryv-border"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <p className="text-sm font-medium text-kryv-text-primary flex-1">{task.instruction}</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                               {statusIcons[task.status]}
                               <span className="text-xs text-kryv-text-secondary capitalize">{task.status}</span>
                            </div>
                        </div>
                        {task.status === 'completed' && task.result && (
                            <div className="mt-3 pt-3 border-t border-kryv-border text-sm text-kryv-text-secondary bg-black/20 p-4 rounded-md font-mono">
                               <pre className="whitespace-pre-wrap text-sm">{(task.result as any).content}</pre>
                            </div>
                        )}
                        {task.status === 'failed' && (
                             <div className="mt-3 pt-3 border-t border-red-500/20 text-sm text-red-400 p-3 rounded-md">
                               <p>Task failed. Check runtime logs for details.</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
