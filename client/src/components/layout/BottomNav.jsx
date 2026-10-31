import { NavLink } from 'react-router-dom';
import {
  RiDashboardLine, RiCheckboxCircleLine, RiTargetLine,
  RiRepeatLine, RiCalendarLine,
} from 'react-icons/ri';

const NAV = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Home' },
  { to: '/today', icon: RiCheckboxCircleLine, label: 'Today' },
  { to: '/objectives', icon: RiTargetLine, label: 'OKRs' },
  { to: '/habits', icon: RiRepeatLine, label: 'Habits' },
  { to: '/calendar', icon: RiCalendarLine, label: 'Calendar' },
];

export default function BottomNav() {
  return (
    <nav
      className="show-mobile"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-card)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '8px 0 env(safe-area-inset-bottom, 8px)',
        zIndex: 100,
      }}
      aria-label="Mobile navigation"
    >
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 12px', borderRadius: 'var(--radius-md)',
            textDecoration: 'none', minWidth: 44, minHeight: 44, justifyContent: 'center',
            color: isActive ? 'var(--color-primary-500)' : 'var(--text-muted)',
            transition: 'color var(--transition-fast)',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} />
              <span style={{ fontSize: '0.625rem', fontWeight: isActive ? 700 : 500 }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
