import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import AuthPage from './pages/Auth';
import { useAuth } from './hooks/use-auth';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-kryv-bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-kryv-border border-t-kryv-cyan rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Toaster theme="dark" position="bottom-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/" element={session ? <AppLayout /> : <Navigate to="/auth" />}>
            <Route index element={<DashboardPage />} />
            {/* Add more protected routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
