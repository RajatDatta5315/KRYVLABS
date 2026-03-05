import { useState } from 'react';
import { api, setAuth } from '@/lib/api-client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = mode === 'sign_in'
        ? await api.signin(email, password)
        : await api.signup(email, password);
      setAuth(data.token, data.user);
      // Store in sessionStorage so page refresh works
      sessionStorage.setItem('kryv_token', data.token);
      sessionStorage.setItem('kryv_user', JSON.stringify(data.user));
      toast.success('Lab access granted');
      navigate('/');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lab-bg flex items-center justify-center px-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,210,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,180,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lab-cyan/4 blur-[120px] rounded-full pointer-events-none" />
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-lab-cyan flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lab-cyan/20">
            <img src="/logo.png" alt="KRYVLABS" className="w-full h-full rounded-xl object-contain" />
          </div>
          <h1 className="font-display font-black text-2xl text-white">KRYVLABS</h1>
          <p className="font-mono text-[10px] text-lab-muted mt-1">// agent factory os</p>
        </div>
        <div className="lab-panel p-6 space-y-4">
          <div className="flex gap-2">
            {(['sign_in', 'sign_up'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg font-mono text-xs transition-all ${mode === m ? 'bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan' : 'text-lab-muted hover:text-lab-text border border-transparent'}`}>
                {m === 'sign_in' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="font-mono text-[10px] text-lab-muted block mb-1.5">EMAIL</label>
              <input type="email" className="lab-input" placeholder="you@lab.dev" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="font-mono text-[10px] text-lab-muted block mb-1.5">PASSWORD</label>
              <input type="password" className="lab-input" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="lab-btn-primary w-full py-3 mt-2">
              {loading ? 'Processing...' : mode === 'sign_in' ? '→ Enter Lab' : '→ Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center font-mono text-[10px] text-lab-muted mt-4">
          Part of <a href="https://kryv.network" className="text-lab-cyan hover:underline" target="_blank">KRYV Network</a>
        </p>
      </div>
    </div>
  );
};
export default AuthPage;
