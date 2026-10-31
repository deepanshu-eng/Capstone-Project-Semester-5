import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { RiFlashlightLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { registerUser, clearError } from '../../store/slices/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) errs.password = 'Password must contain a letter and a digit';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password, timezone: 'Asia/Kolkata' }));
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (fieldErrors[field]) setFieldErrors((fe) => ({ ...fe, [field]: '' }));
  };

  return (
    <>
      <Helmet>
        <title>Create Account — Cadence</title>
        <meta name="description" content="Create your free Cadence account and start tracking your OKRs and habits today." />
      </Helmet>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RiFlashlightLine color="white" size={26} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Create your account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 6 }}>
              Start achieving your goals with Cadence
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16,
              color: 'var(--color-danger)', fontSize: '0.875rem',
            }} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }} noValidate>
            {[
              { id: 'reg-name', field: 'name', label: 'Full Name', type: 'text', placeholder: 'Alex Johnson', autoComplete: 'name' },
              { id: 'reg-email', field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
            ].map(({ id, field, label, type, placeholder, autoComplete }) => (
              <div className="form-group" key={field}>
                <label className="form-label" htmlFor={id}>{label}</label>
                <input
                  id={id}
                  type={type}
                  className={`form-input ${fieldErrors[field] ? 'error' : ''}`}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={handleChange(field)}
                  onBlur={() => { const e = validate(); setFieldErrors((fe) => ({ ...fe, [field]: e[field] || '' })); }}
                  autoComplete={autoComplete}
                  required
                />
                {fieldErrors[field] && <span className="form-error">{fieldErrors[field]}</span>}
              </div>
            ))}

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  placeholder="Min 8 chars, 1 letter, 1 digit"
                  value={form.password}
                  onChange={handleChange('password')}
                  autoComplete="new-password"
                  required
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                >
                  {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
              {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                autoComplete="new-password"
                required
              />
              {fieldErrors.confirmPassword && <span className="form-error">{fieldErrors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              id="register-submit"
              style={{ width: '100%', marginTop: 4 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
