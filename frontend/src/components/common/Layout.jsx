import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080808' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ background: '#080808' }}>
        <Outlet />
      </main>
    </div>
  );
}
