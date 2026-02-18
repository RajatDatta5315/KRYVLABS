import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserNav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-kryv-text-secondary">{user?.email}</span>
      <button onClick={handleSignOut} className="flex items-center gap-2 p-2 rounded-md hover:bg-kryv-panel-dark transition-colors">
        <LogOut className="h-4 w-4 text-kryv-text-secondary" />
      </button>
    </div>
  );
}
