import { AgentCreator } from "@/components/dashboard/AgentCreator";
import { AgentList } from "@/components/dashboard/AgentList";
import { TaskExecutor } from "@/components/dashboard/TaskExecutor";
import { TaskList } from "@/components/dashboard/TaskList";
import { CommandK } from "@/components/shared/CommandK";
import { useState } from "react";
import { Database } from "@/lib/database.types";

export type Agent = Database['public']['Tables']['agents']['Row'];

const DashboardPage = () => {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-3 lg:border-r lg:border-kryv-border lg:pr-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-heading text-lg font-medium">Your Agents</h2>
                        <AgentCreator />
                    </div>
                    <AgentList selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} />
                </div>
                <main className="lg:col-span-9 flex flex-col h-full">
                    {selectedAgent ? (
                        <div className="flex-1 flex flex-col min-h-0">
                            <h2 className="font-heading text-lg font-medium mb-4">{selectedAgent.name} - Task Console</h2>
                            <TaskExecutor agent={selectedAgent} />
                            <div className="h-px bg-kryv-border my-6"></div>
                            <h3 className="font-heading text-md font-medium mb-4">Task History</h3>
                            <TaskList agentId={selectedAgent.id} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center bg-kryv-panel-dark rounded-2xl">
                            <div className="p-8">
                                <h3 className="font-heading text-xl font-bold">No Agent Selected</h3>
                                <p className="text-kryv-text-secondary mt-2">Select an agent from the list to view its console, or create a new one.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <CommandK />
        </>
    );
};

export default DashboardPage;
