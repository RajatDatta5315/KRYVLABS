import { useState } from 'react';
import { Settings, Key, Globe, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const KRYV_PRODUCTS = [
  ['KRIYEX', 'kriyex.kryv.network'],
  ['VIGILIS', 'vigilis.kryv.network'],
  ['GENESIS', 'genesis.kryv.network'],
  ['MINDEN', 'minden.kryv.network'],
  ['NEURAL', 'neural.kryv.network'],
];

const SecretInput = ({ label, placeholder, envKey }: { label: string; placeholder: string; envKey: string }) => {
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState('');
  return (
    <div>
      <label className="font-mono text-[10px] text-lab-muted uppercase tracking-widest block mb-1.5">{label}</label>
      <div className="relative">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-lab-muted" />
        <input type={visible ? 'text' : 'password'} className="lab-input pl-8 pr-10 text-xs" placeholder={placeholder} value={val} onChange={e => setVal(e.target.value)} />
        <button onClick={() => setVisible(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-lab-muted hover:text-lab-cyan transition-colors">
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
      <p className="font-mono text-[9px] text-lab-muted mt-1 opacity-60">env: {envKey}</p>
    </div>
  );
};

const SettingsPage = () => {
  const handleSave = () => toast.success('Settings saved to session');

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-5">
      <div>
        <p className="font-mono text-[10px] text-lab-cyan tracking-widest uppercase mb-1">// config_panel</p>
        <h1 className="font-display font-bold text-xl text-white">Settings</h1>
        <p className="text-lab-muted text-xs mt-1">Configure API keys and system preferences</p>
      </div>

      {/* API Keys */}
      <div className="lab-panel p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-lab-border">
          <Key className="h-4 w-4 text-lab-cyan" />
          <p className="font-mono text-xs text-lab-cyan">API_KEYS // LLM PROVIDERS</p>
        </div>
        <SecretInput label="OpenAI API Key" placeholder="sk-..." envKey="SUPABASE_OPENAI_API_KEY" />
        <SecretInput label="Anthropic API Key" placeholder="sk-ant-..." envKey="ANTHROPIC_API_KEY" />
        <SecretInput label="Groq API Key" placeholder="gsk_..." envKey="GROQ_API_KEY" />
        <div className="flex justify-end pt-2">
          <button onClick={handleSave} className="lab-btn-primary flex items-center gap-2 px-5 py-2">
            <Save className="h-3.5 w-3.5" /> Save Keys
          </button>
        </div>
      </div>

      {/* Integrations */}
      <div className="lab-panel p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-lab-border">
          <Globe className="h-4 w-4 text-lab-cyan" />
          <p className="font-mono text-xs text-lab-cyan">INTEGRATIONS // KRYV ECOSYSTEM</p>
        </div>
        <div className="space-y-2">
          {KRYV_PRODUCTS.map(([name, domain]) => (
            <div key={name} className="flex items-center justify-between py-2 px-3 rounded-lg border border-lab-border hover:border-lab-cyan/20 transition-colors">
              <div className="flex items-center gap-2">
                <span className="status-dot-active" />
                <span className="font-mono text-xs text-lab-text">{name}</span>
              </div>
              <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] text-lab-muted hover:text-lab-cyan transition-colors">{domain}</a>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="lab-panel p-4 border-lab-amber/20 bg-lab-amber/5 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-lab-amber flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-mono text-xs text-lab-amber font-bold">PRODUCTION NOTE</p>
          <p className="font-mono text-[10px] text-lab-muted mt-1">
            API keys should be set as Supabase Edge Function secrets, not stored in the client. Set them in your Supabase dashboard under Settings → Edge Functions → Secrets.
          </p>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
