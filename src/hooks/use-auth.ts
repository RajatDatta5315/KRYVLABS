import { useState, useEffect } from 'react';
import { setAuth, getToken, getUser } from '@/lib/api-client';

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from sessionStorage on page load
    const token = sessionStorage.getItem('kryv_token');
    const userStr = sessionStorage.getItem('kryv_user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setAuth(token, user);
      setSession({ user });
    }
    setLoading(false);
  }, []);

  const signOut = () => {
    sessionStorage.removeItem('kryv_token');
    sessionStorage.removeItem('kryv_user');
    setSession(null);
  };

  return {
    session,
    user: session?.user,
    loading,
    signOut,
  };
}
