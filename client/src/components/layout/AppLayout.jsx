import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useSelector } from 'react-redux';

export default function AppLayout() {
  const sidebarCollapsed = useSelector((s) => s.ui.sidebarCollapsed);

  return (
    <div className="app-layout" style={{ background: 'var(--surface-bg)', minHeight: '100vh' }}>
      <Sidebar />
      <main
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
        id="main-content"
      >
        <TopBar />
        <div className="page-enter" style={{ paddingTop: '80px' }}>
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
