import { AlertTriangle } from "lucide-react";

const ConfigErrorPage = () => {
    return (
        <div className="min-h-screen bg-kryv-bg-dark flex items-center justify-center p-8 text-center">
            <div className="w-full max-w-2xl p-8 bg-kryv-panel-dark border border-red-500/50 rounded-2xl">
                <div className="mx-auto w-fit p-4 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="font-heading text-3xl font-bold text-red-400">Backend Not Configured</h1>
                <p className="text-kryv-text-secondary mt-4 mb-6">
                    The connection to the backend service (Supabase) has failed. This is usually because the required environment variables are missing.
                </p>
                <div className="text-left bg-kryv-bg-dark p-6 rounded-lg font-mono text-sm border border-kryv-border">
                    <p className="font-bold text-kryv-text-primary mb-2">ACTION REQUIRED:</p>
                    <ol className="list-decimal list-inside space-y-2 text-kryv-text-secondary">
                        <li>Create a <code className="bg-kryv-border text-kryv-cyan px-1 py-0.5 rounded">.env</code> file in the project's root directory.</li>
                        <li>Copy the contents of <code className="bg-kryv-border text-kryv-cyan px-1 py-0.5 rounded">.env.example</code> into it.</li>
                        <li>
                            Fill in your project's <code className="text-amber-400">VITE_SUPABASE_URL</code> and <code className="text-amber-400">VITE_SUPABASE_ANON_KEY</code>.
                        </li>
                        <li>Restart the development server.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ConfigErrorPage;
