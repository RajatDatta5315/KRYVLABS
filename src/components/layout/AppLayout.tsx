import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => (
  <div className="min-h-screen bg-lab-bg text-lab-text flex flex-col overflow-hidden">
    <Header />
    <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-5">
        <Outlet />
      </main>
    </div>
  </div>
);
export default AppLayout;
