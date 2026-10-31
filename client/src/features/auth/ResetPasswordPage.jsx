import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiFlashlightLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.newPassword) errs.newPassword = 'Password is required';
    else if (form.newPassword.length < 8) errs.newPassword = 'Minimum 8 characters';
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.newPassword)) errs.newPassword = 'Must contain a letter and a digit';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, form.newPassword);
      toast.success('Password reset! Please log in.');
      navigate('/login');
    } catch {
      toast.error('Reset link is invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password — Cadence</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--surface-bg)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiFlashlightLine color="white" size={26} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Set new password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 6 }}>Must be at least 8 characters.</p>
          </div>
          <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-password">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                  placeholder="Min 8 chars, 1 letter, 1 digit"
                  value={form.newPassword}
                  onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                  required
                  style={{ paddingRight: 42 }}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
              {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-confirm">Confirm Password</label>
              <input id="reset-confirm" type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} required />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }} id="reset-submit">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Link to="/login" style={{ fontWeight: 600 }}>Back to sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
