import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import AgentBuilderPage from './pages/AgentBuilder';
import KnowledgePage from './pages/Knowledge';
import PublishPage from './pages/Publish';
import SettingsPage from './pages/Settings';
import AuthPage from './pages/Auth';
import LoadingPage from './pages/LoadingPage';
import { useAuth } from './hooks/use-auth';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext';

const ProtectedRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="builder" element={<AgentBuilderPage />} />
      <Route path="knowledge" element={<KnowledgePage />} />
      <Route path="publish" element={<PublishPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const PublicRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="*" element={<Navigate to="/auth" replace />} />
  </Routes>
);

function App() {
  const { session, loading } = useAuth();
  if (loading) return <LoadingPage />;
  return (
    <ThemeProvider>
      <Toaster theme="dark" position="bottom-right"
        toastOptions={{ style: { background: '#070C12', border: '1px solid rgba(0,210,180,0.2)', color: '#C8D8E8', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' } }} />
      <BrowserRouter>
        {session ? <ProtectedRoutes /> : <PublicRoutes />}
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
