import { AlertTriangle, ExternalLink } from "lucide-react";

const ConfigErrorPage = () => (
  <div className="min-h-screen bg-lab-bg flex items-center justify-center p-6"
    style={{ backgroundImage:'linear-gradient(rgba(0,210,180,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,0.04) 1px,transparent 1px)', backgroundSize:'40px 40px' }}>
    <div className="w-full max-w-xl lab-panel p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-400"/>
        </div>
        <div>
          <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest">// config_error</p>
          <h1 className="font-display font-bold text-white">Worker Not Connected</h1>
        </div>
      </div>
      <div className="bg-lab-bg rounded-xl border border-lab-border p-5 space-y-3">
        <p className="font-mono text-[10px] text-lab-muted uppercase tracking-widest">Required Vercel Environment Variable:</p>
        <div className="p-3 rounded-lg bg-lab-panel border border-lab-border">
          <code className="text-lab-cyan font-mono text-xs">VITE_API_URL = https://kryvlabs-api.rajatdatta90000.workers.dev</code>
        </div>
      </div>
      <ol className="space-y-2 text-xs text-lab-muted font-mono">
        <li className="flex gap-2"><span className="text-lab-cyan">1.</span> Vercel → KRYVLABS project → Settings → Environment Variables</li>
        <li className="flex gap-2"><span className="text-lab-cyan">2.</span> Add VITE_API_URL with the Worker URL above</li>
        <li className="flex gap-2"><span className="text-lab-cyan">3.</span> Redeploy — KRYVLABS will come online</li>
      </ol>
      <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
        className="lab-btn-primary flex items-center justify-center gap-2 py-2.5 text-xs">
        <ExternalLink className="h-3.5 w-3.5"/> Vercel Dashboard
      </a>
    </div>
  </div>
);
export default ConfigErrorPage;
