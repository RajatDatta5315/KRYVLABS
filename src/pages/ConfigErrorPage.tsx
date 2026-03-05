import { AlertTriangle, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";

const ConfigErrorPage = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-lab-bg flex items-center justify-center p-6"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,210,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,180,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
      <div className="w-full max-w-xl">
        <div className="lab-panel p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest">// config_error</p>
              <h1 className="font-display font-bold text-white">Backend Not Connected</h1>
            </div>
          </div>

          <div className="bg-lab-bg rounded-xl border border-lab-border p-5 space-y-3">
            <p className="font-mono text-[10px] text-lab-muted uppercase tracking-widest">Required Vercel Environment Variables:</p>
            {[
              { key: 'VITE_SUPABASE_URL', val: 'https://xxx.supabase.co' },
              { key: 'VITE_SUPABASE_ANON_KEY', val: 'eyJhbGci...' },
            ].map(({ key, val }) => (
              <div key={key} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-lab-panel border border-lab-border">
                <code className="text-lab-cyan font-mono text-xs">{key}</code>
                <span className="text-lab-muted font-mono text-[10px]">{val}</span>
                <button onClick={() => copy(key)} className="p-1 hover:text-lab-cyan text-lab-muted transition-colors">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] text-lab-muted uppercase tracking-widest">Steps to fix:</p>
            <ol className="space-y-2 text-xs text-lab-muted font-mono">
              <li className="flex gap-2"><span className="text-lab-cyan">1.</span> Go to Vercel → Your Project → Settings → Environment Variables</li>
              <li className="flex gap-2"><span className="text-lab-cyan">2.</span> Add both vars above with your Supabase project values</li>
              <li className="flex gap-2"><span className="text-lab-cyan">3.</span> Redeploy — KRYVLABS will come online</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
              className="lab-btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Supabase Dashboard
            </a>
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
              className="lab-btn-ghost flex-1 flex items-center justify-center gap-2 py-2.5 text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Vercel Settings
            </a>
          </div>

          {copied && <p className="text-center font-mono text-[10px] text-lab-green">Copied to clipboard</p>}
        </div>
      </div>
    </div>
  );
};
export default ConfigErrorPage;
