import React, { useEffect } from 'react';
import { Bot, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function CommandK() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(o => !o); } };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const handleSignOut = () => { signOut(); navigate('/auth'); };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-32 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="lab-panel w-full max-w-lg p-4 space-y-2" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-3 bg-lab-bg rounded-lg border border-lab-border mb-3">
          <Search className="h-4 w-4 text-lab-muted" />
          <span className="font-mono text-xs text-lab-muted">Command palette (⌘K)</span>
        </div>
        <button onClick={() => { navigate('/builder'); setOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-lab-glow transition-all text-left">
          <Bot className="h-4 w-4 text-lab-cyan" /><span className="font-mono text-xs text-white">Create New Agent</span>
        </button>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-lab-glow transition-all text-left">
          <LogOut className="h-4 w-4 text-lab-muted" /><span className="font-mono text-xs text-lab-muted">Log Out</span>
        </button>
      </div>
    </div>
  );
}
