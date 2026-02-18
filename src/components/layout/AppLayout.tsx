import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-kryv-bg-dark text-kryv-text-primary">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ height: 'calc(100vh - 65px)' }}>
          <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
