import { AgentCreator } from "@/components/dashboard/AgentCreator";
import { AgentList } from "@/components/dashboard/AgentList";
import { TaskExecutor } from "@/components/dashboard/TaskExecutor";
import { TaskList } from "@/components/dashboard/TaskList";
import { CommandK } from "@/components/shared/CommandK";
import { useState } from "react";
import { Database } from "@/lib/database.types";
import { Bot } from "lucide-react";

export type Agent = Database['public']['Tables']['agents']['Row'];

const DashboardPage = () => {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Left Panel: Agent List */}
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center">
                        <h1 className="font-heading text-xl font-bold">Agent Fleet</h1>
                        <AgentCreator />
                    </div>
                    <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                        <AgentList selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} />
                    </div>
                </div>

                {/* Right Panel: Agent Console */}
                <main className="lg:col-span-8 xl:col-span-9 flex flex-col h-full bg-kryv-panel-dark rounded-2xl border border-kryv-border">
                    {selectedAgent ? (
                        <div className="flex-1 flex flex-col min-h-0 p-6">
                            <div className="flex-shrink-0 mb-6">
                                <h2 className="font-heading text-lg font-medium">{selectedAgent.name}</h2>
                                <p className="text-sm text-kryv-text-secondary">{selectedAgent.system_prompt}</p>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto mb-6 pr-2">
                                <TaskList agentId={selectedAgent.id} />
                            </div>
                           
                            <div className="flex-shrink-0 mt-auto">
                                <TaskExecutor agent={selectedAgent} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                             <div className="p-6 bg-kryv-bg-dark rounded-full border border-kryv-border border-dashed">
                                 <Bot className="h-12 w-12 text-kryv-text-secondary" />
                            </div>
                            <h3 className="font-heading text-xl font-bold mt-6">No Agent Selected</h3>
                            <p className="text-kryv-text-secondary mt-2 max-w-sm">Select an agent from the fleet to view its console, or create a new one to get started.</p>
                        </div>
                    )}
                </main>
            </div>
            <CommandK />
        </>
    );
};

export default DashboardPage;
