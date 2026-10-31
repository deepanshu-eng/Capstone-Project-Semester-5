import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiBellLine, RiSunLine, RiMoonLine, RiCheckLine, RiMailLine } from 'react-icons/ri';
import { toggleTheme } from '../../store/slices/uiSlice';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../store/slices/notificationsSlice';
import { formatDistanceToNow } from 'date-fns';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/today': "Today's Habits",
  '/objectives': 'Objectives',
  '/habits': 'Habits',
  '/calendar': 'Calendar',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSelector((s) => s.ui);
  const { items: notifications } = useSelector((s) => s.notifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'Cadence';

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 'var(--sidebar-width)',
      height: 'var(--header-height)',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 50,
      transition: 'left var(--transition-base)',
    }} className="hide-mobile">
      <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="btn btn-ghost btn-icon"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
        </button>

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="btn btn-ghost btn-icon"
            aria-label={`${unreadCount} unread notifications`}
            id="notification-bell"
            style={{ position: 'relative' }}
          >
            <RiBellLine size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                background: 'var(--color-danger)',
                color: 'white', fontSize: '0.65rem', fontWeight: 700,
                borderRadius: '50%', width: 16, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 360, background: 'var(--surface-card)',
              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)', zIndex: 200,
              animation: 'slideUp var(--transition-fast)',
            }} role="dialog" aria-label="Notifications">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllNotificationsRead())}
                    style={{ fontSize: '0.8rem', color: 'var(--color-primary-500)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="empty-state" style={{ padding: '32px 20px' }}>
                    <RiMailLine size={32} color="var(--text-muted)" />
                    <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.875rem' }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && dispatch(markNotificationRead(n.id))}
                      style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: n.read ? 'default' : 'pointer',
                        background: n.read ? 'transparent' : 'rgba(99,102,241,0.04)',
                        transition: 'background var(--transition-fast)',
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                        background: n.read ? 'transparent' : 'var(--color-primary-500)',
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                          {n.message}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.read && (
                        <RiCheckLine size={14} color="var(--color-primary-500)" style={{ flexShrink: 0, marginTop: 3 }} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
