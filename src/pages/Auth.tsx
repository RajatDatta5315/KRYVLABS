import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kryv-bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="font-heading text-4xl font-bold">KRYV<span className="text-kryv-cyan">LABS</span></h1>
            <p className="text-kryv-text-secondary mt-2">AI Orchestration Platform</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(188, 100%, 50%)',
                  brandAccent: 'hsl(188, 100%, 40%)',
                  defaultButtonBackground: 'hsl(240, 6%, 10%)',
                  defaultButtonBackgroundHover: 'hsl(240, 5%, 18%)',
                  inputBackground: 'hsl(240, 6%, 12%)',
                  inputBorder: 'hsl(240, 5%, 18%)',
                  inputBorderHover: 'hsl(240, 5%, 30%)',
                },
              },
            },
          }}
          providers={['github', 'google']}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default AuthPage;
