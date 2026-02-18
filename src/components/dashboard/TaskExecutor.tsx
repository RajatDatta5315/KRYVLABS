import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Agent } from "@/pages/Dashboard";
import { Send } from "lucide-react";

async function createTask(instruction: string, agent_id: string, owner_id: string) {
    const { data, error } = await supabase
        .from('tasks')
        .insert({ instruction, agent_id, owner_id })
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data;
}

async function invokeAgentBrain(taskId: string) {
    const { data, error } = await supabase.functions.invoke('agent-brain', {
        body: { taskId },
    });
    if (error) throw new Error(`Function invocation failed: ${error.message}`);
    return data;
}

export const TaskExecutor = ({ agent }: { agent: Agent }) => {
    const [instruction, setInstruction] = useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newInstruction: string) => {
            if (!agent.owner_id) throw new Error("Agent owner not found");
            const task = await createTask(newInstruction, agent.id, agent.owner_id);
            await invokeAgentBrain(task.id);
            return task;
        },
        onSuccess: () => {
            toast.success("Task sent to agent.");
            queryClient.invalidateQueries({ queryKey: ['tasks', agent.id] });
            setInstruction("");
        },
        onError: (error) => {
            toast.error(`Task failed: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (instruction.trim() && !mutation.isPending) {
            mutation.mutate(instruction.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder={`Send instruction to ${agent.name}...`}
                className="flex-1 px-4 py-2 rounded-md bg-kryv-panel-dark border border-kryv-border focus:border-kryv-cyan focus:ring-0 outline-none transition-colors"
                disabled={mutation.isPending}
            />
            <button type="submit" disabled={mutation.isPending} className="p-2 bg-kryv-cyan rounded-md text-black disabled:bg-opacity-50 transition-colors">
                {mutation.isPending ? 
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : 
                    <Send className="w-5 h-5" />}
            </button>
        </form>
    );
};
