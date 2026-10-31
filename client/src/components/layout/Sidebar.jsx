import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  RiDashboardLine, RiCheckboxCircleLine, RiTargetLine,
  RiRepeatLine, RiCalendarLine, RiFileChartLine,
  RiSettingsLine, RiLogoutBoxLine, RiMenuFoldLine,
  RiMenuUnfoldLine, RiFlashlightLine,
} from 'react-icons/ri';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/today', icon: RiCheckboxCircleLine, label: 'Today' },
  { to: '/objectives', icon: RiTargetLine, label: 'Objectives' },
  { to: '/habits', icon: RiRepeatLine, label: 'Habits' },
  { to: '/calendar', icon: RiCalendarLine, label: 'Calendar' },
  { to: '/reports', icon: RiFileChartLine, label: 'Reports' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        background: 'var(--surface-card)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-base)',
        zIndex: 100,
        overflow: 'hidden',
      }}
      className="hide-mobile"
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        padding: '20px 16px',
        borderBottom: '1px solid var(--border-color)',
        minHeight: 'var(--header-height)',
      }}>
        {!sidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <RiFlashlightLine color="white" size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Cadence
            </span>
          </div>
        )}
        {sidebarCollapsed && (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RiFlashlightLine color="white" size={18} />
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="btn btn-ghost btn-icon"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <RiMenuFoldLine size={18} />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="btn btn-ghost btn-icon"
          style={{ margin: '8px auto' }}
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <RiMenuUnfoldLine size={18} />
        </button>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', overflow: 'auto' }} aria-label="Main navigation">
        {!sidebarCollapsed && (
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 12px 4px' }}>
            Menu
          </p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={sidebarCollapsed ? label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: sidebarCollapsed ? '10px' : '10px 12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 2,
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              transition: 'all var(--transition-fast)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.08))'
                : 'transparent',
              color: isActive ? 'var(--color-primary-500)' : 'var(--text-secondary)',
              borderLeft: isActive ? '3px solid var(--color-primary-500)' : '3px solid transparent',
            })}
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-color)' }}>
        {!sidebarCollapsed && (
          <div style={{ padding: '8px 12px', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>
        )}
        <NavLink
          to="/settings"
          title={sidebarCollapsed ? 'Settings' : undefined}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: sidebarCollapsed ? '10px' : '10px 12px',
            borderRadius: 'var(--radius-md)', marginBottom: 2,
            fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            color: isActive ? 'var(--color-primary-500)' : 'var(--text-secondary)',
          })}
        >
          <RiSettingsLine size={20} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Log out' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: sidebarCollapsed ? '10px' : '10px 12px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            width: '100%', border: 'none', background: 'transparent',
            color: 'var(--color-danger)',
          }}
        >
          <RiLogoutBoxLine size={20} />
          {!sidebarCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
