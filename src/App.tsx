import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <Navigation session={session} />
      {!session ? (
        <Hero />
      ) : (
        <Dashboard user={session.user} />
      )}
    </div>
  );
}
