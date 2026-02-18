import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { Database } from '@/lib/database.types';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

type Task = Database['public']['Tables']['tasks']['Row'];

async function fetchTasks(agentId: string) {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });
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
        const channel = supabase.channel(`tasks-for-${agentId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tasks',
                filter: `agent_id=eq.${agentId}`
            }, () => {
                refetch();
            }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [agentId, refetch]);

    if(isLoading) return <div className="text-kryv-text-secondary">Loading tasks...</div>;

    if(!tasks || tasks.length === 0) {
        return <div className="text-kryv-text-secondary text-sm p-4 text-center bg-kryv-panel-dark rounded-xl">No tasks yet for this agent.</div>
    }

    return (
        <div className="space-y-3 pr-2 overflow-y-auto flex-1">
            {tasks.map((task: Task) => (
                <div key={task.id} className="p-4 bg-kryv-panel-dark rounded-lg border border-kryv-border">
                    <div className="flex justify-between items-start">
                        <p className="text-sm text-kryv-text-primary flex-1 pr-4">{task.instruction}</p>
                        <div className="flex items-center gap-2">
                           {statusIcons[task.status]}
                           <span className="text-xs text-kryv-text-secondary capitalize">{task.status}</span>
                        </div>
                    </div>
                    {task.status === 'completed' && task.result && (
                        <div className="mt-3 pt-3 border-t border-kryv-border text-sm text-kryv-text-secondary bg-kryv-bg-dark p-3 rounded-md">
                           <pre className="whitespace-pre-wrap font-sans">{(task.result as any).content}</pre>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
