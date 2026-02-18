import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Bot, Plus, X } from 'lucide-react';

async function createAgent(name: string, model: string, system_prompt: string, owner_id: string) {
    const { data, error } = await supabase.from('agents').insert({ name, model, system_prompt, owner_id }).select();
    if (error) throw new Error(error.message);
    return data;
}

export const AgentCreator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            if (!user) throw new Error("User not authenticated.");
            return createAgent(name, 'gpt-4o', systemPrompt, user.id);
        },
        onSuccess: () => {
            toast.success(`Agent "${name}" created successfully.`);
            queryClient.invalidateQueries({ queryKey: ['agents'] });
            setIsOpen(false);
            setName('');
            setSystemPrompt('You are a helpful AI assistant.');
        },
        onError: (error) => {
            toast.error(`Failed to create agent: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="p-2 rounded-md hover:bg-kryv-panel-dark transition-colors">
                <Plus className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-kryv-panel-dark border border-kryv-border rounded-xl w-full max-w-lg p-6 relative">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-kryv-border">
                            <X className="h-4 w-4" />
                        </button>
                        <h2 className="font-heading text-xl font-medium mb-6">Create New Agent</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-kryv-text-secondary mb-1 block">Agent Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Data Analyst Pro"
                                    className="w-full px-3 py-2 rounded-md bg-kryv-bg-dark border border-kryv-border focus:border-kryv-cyan outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-kryv-text-secondary mb-1 block">System Prompt</label>
                                <textarea
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    rows={5}
                                    className="w-full px-3 py-2 rounded-md bg-kryv-bg-dark border border-kryv-border focus:border-kryv-cyan outline-none"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-kryv-cyan text-black font-bold rounded-md disabled:opacity-50 transition-colors">
                                    {mutation.isPending ? "Creating..." : "Create Agent"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
