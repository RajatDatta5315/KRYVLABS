import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-kryv-bg-dark text-kryv-text-primary">
      <Header />
      <div className="flex h-[calc(100vh-65px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
