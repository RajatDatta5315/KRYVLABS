import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import AuthPage from './pages/Auth';
import ConfigErrorPage from './pages/ConfigErrorPage';
import LoadingPage from './pages/LoadingPage';
import { useAuth } from './hooks/use-auth';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext';

// Helper component for protected routes
const ProtectedRoutes = () => (
    <Routes>
        <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            {/* Add more protected routes here in the future */}
        </Route>
        {/* Any other route redirects to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

// Helper component for public routes
const PublicRoutes = () => (
    <Routes>
        <Route path="/auth" element={<AuthPage />} />
        {/* Any other route redirects to the auth page */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
);

function App() {
    const { session, loading } = useAuth();

    // 1. Explicitly check if environment variables are set.
    const supabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseConfigured) {
        return <ConfigErrorPage />;
    }

    // 2. Show a dedicated loading page while auth state is being resolved.
    if (loading) {
        return <LoadingPage />;
    }

    // 3. Render the correct router ONLY AFTER loading is complete.
    return (
        <ThemeProvider>
            <Toaster theme="dark" position="bottom-right" />
            <BrowserRouter>
                {session ? <ProtectedRoutes /> : <PublicRoutes />}
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
