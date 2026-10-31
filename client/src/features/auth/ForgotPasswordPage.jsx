import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiFlashlightLine, RiMailLine, RiArrowLeftLine } from 'react-icons/ri';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password — Cadence</title>
      </Helmet>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: 'var(--surface-bg)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RiFlashlightLine color="white" size={26} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Reset your password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 6 }}>
              {submitted ? "Check your inbox for the reset link." : "Enter your email and we'll send a reset link."}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">
                  <RiMailLine size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  required
                />
                {error && <span className="form-error">{error}</span>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }} id="forgot-submit">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RiMailLine size={28} color="var(--color-accent-500)" />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                If <strong>{email}</strong> is registered, a reset link has been sent. Check your inbox (and spam folder).
              </p>
            </div>
          )}

          <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <RiArrowLeftLine size={16} /> Back to sign in
          </Link>
        </div>
      </div>
    </>
  );
}
