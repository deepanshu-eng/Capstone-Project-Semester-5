import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { RiUserLine, RiBellLine, RiShieldLine, RiSunLine, RiMoonLine, RiDeleteBinLine } from 'react-icons/ri';
import { updateProfile } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import ConfirmModal from '../../components/common/ConfirmModal';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TIMEZONES = ['Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'UTC'];

function Section({ title, icon: Icon, children }) {
  return (
    <div className="card" style={{ padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
        <Icon size={18} color="var(--color-primary-500)" />
        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.ui);

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', timezone: user?.timezone || 'Asia/Kolkata', reminderTime: user?.settings?.reminderTime || '08:00' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPw, setIsSavingPw] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const validatePw = () => {
    const e = {};
    if (!pwForm.currentPassword) e.currentPassword = 'Enter current password';
    if (!pwForm.newPassword) e.newPassword = 'Enter new password';
    else if (pwForm.newPassword.length < 8) e.newPassword = 'Min 8 characters';
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(pwForm.newPassword)) e.newPassword = 'Must contain letter and digit';
    if (pwForm.newPassword !== pwForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setIsSavingPw(true);
    try {
      await authService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Current password is incorrect');
    } finally {
      setIsSavingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await authService.deleteAccount();
      dispatch(logoutUser());
      navigate('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings — Cadence</title>
        <meta name="description" content="Manage your profile, notifications, and account settings." />
      </Helmet>

      <h1 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: 24, letterSpacing: '-0.02em' }}>Settings</h1>

      <div style={{ maxWidth: 680 }}>
        {/* Profile */}
        <Section title="Profile" icon={RiUserLine}>
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label" htmlFor="set-name">Full Name</label>
              <input id="set-name" type="text" className="form-input" value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="set-tz">Timezone</label>
                <select id="set-tz" className="form-select" value={profileForm.timezone} onChange={(e) => setProfileForm((f) => ({ ...f, timezone: e.target.value }))}>
                  {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="set-reminder">Default Reminder Time</label>
                <input id="set-reminder" type="time" className="form-input" value={profileForm.reminderTime} onChange={(e) => setProfileForm((f) => ({ ...f, reminderTime: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSavingProfile} id="save-profile-btn">
              {isSavingProfile ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </Section>

        {/* Appearance */}
        <Section title="Appearance" icon={theme === 'dark' ? RiMoonLine : RiSunLine}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Theme</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Currently using <strong>{theme}</strong> mode
              </p>
            </div>
            <button onClick={() => dispatch(toggleTheme())} className="btn btn-secondary" id="theme-toggle-btn">
              {theme === 'dark' ? <><RiSunLine size={16} /> Switch to Light</> : <><RiMoonLine size={16} /> Switch to Dark</>}
            </button>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={RiBellLine}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Notification preferences are saved to your account and respected by the reminder scheduler.
          </p>
          {[
            { key: 'emailReminders', label: 'Email Reminders', desc: 'Get reminded about pending habits at your reminder time' },
            { key: 'dailyDigest', label: 'Daily Digest', desc: 'A daily summary of your habit completion and progress' },
            { key: 'deadlineAlerts', label: 'Deadline Alerts', desc: 'Alert when a Key Result deadline is within 3 days' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              <label style={{ cursor: 'pointer' }} aria-label={label}>
                <input
                  type="checkbox"
                  defaultChecked={user?.settings?.[key] !== false}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary-500)' }}
                />
              </label>
            </div>
          ))}
        </Section>

        {/* Security */}
        <Section title="Security" icon={RiShieldLine}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
          <form onSubmit={handleChangePw}>
            {[
              { id: 'set-curpw', field: 'currentPassword', label: 'Current Password', placeholder: 'Your current password' },
              { id: 'set-newpw', field: 'newPassword', label: 'New Password', placeholder: 'Min 8 chars, 1 letter, 1 digit' },
              { id: 'set-confpw', field: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
            ].map(({ id, field, label, placeholder }) => (
              <div className="form-group" key={field}>
                <label className="form-label" htmlFor={id}>{label}</label>
                <input
                  id={id} type="password" className={`form-input ${pwErrors[field] ? 'error' : ''}`}
                  placeholder={placeholder}
                  value={pwForm[field]}
                  onChange={(e) => { setPwForm((f) => ({ ...f, [field]: e.target.value })); setPwErrors((er) => ({ ...er, [field]: '' })); }}
                />
                {pwErrors[field] && <span className="form-error">{pwErrors[field]}</span>}
              </div>
            ))}
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSavingPw} id="change-password-btn">
              {isSavingPw ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </Section>

        {/* Danger Zone */}
        <div className="card" style={{ padding: 24, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--color-danger)', marginBottom: 4 }}>Delete Account</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setDeleteModal(true)}
              className="btn btn-danger btn-sm"
              id="delete-account-btn"
            >
              <RiDeleteBinLine size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        title="Delete Your Account"
        message="This will permanently delete your account, all objectives, key results, habits, and check-in history. This action cannot be undone."
        confirmLabel="Delete My Account"
        danger
        isLoading={isDeletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModal(false)}
      />
    </>
  );
}
