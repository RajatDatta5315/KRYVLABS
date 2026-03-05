import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };
  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:block font-mono text-[11px] text-lab-muted truncate max-w-[150px]">
        {user?.email}
      </span>
      <button onClick={handleSignOut}
        className="p-1.5 rounded-lg border border-lab-border hover:border-lab-cyan/40 hover:text-lab-cyan text-lab-muted transition-all">
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
