import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiFlashlightLine, RiTargetLine, RiRepeatLine, RiBarChartLine, RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const FEATURES = [
  { icon: RiTargetLine, title: 'OKR Framework', desc: 'Set Objectives with measurable Key Results. Know exactly where you stand at every moment.' },
  { icon: RiRepeatLine, title: 'Habit Linking', desc: 'Connect daily habits directly to your Key Results. Every check-in automatically advances your goals.' },
  { icon: RiBarChartLine, title: 'Real-Time Progress', desc: 'Visual dashboards, trend charts, and streak calendars show your momentum at a glance.' },
];

const BENEFITS = [
  'Daily habit check-ins auto-update your KR progress',
  'Streak tracking to keep your momentum alive',
  'Email reminders at your chosen time',
  'PDF reports for weekly and monthly review',
  'Calendar view of every check-in',
  'Secure JWT-based auth with token refresh',
];

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Cadence — OKR-Driven Habit & Goal Tracker</title>
        <meta name="description" content="Cadence unifies OKR goal-setting with daily habit tracking so your progress is always visible." />
      </Helmet>
      <div style={{ minHeight: '100vh', background: 'var(--surface-bg)' }}>

        {/* Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 48px', borderBottom: '1px solid var(--border-color)',
          background: 'var(--surface-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RiFlashlightLine color="white" size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Cadence</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '100px 24px 80px',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 'var(--radius-full)', padding: '6px 16px',
            marginBottom: 24, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-400)',
          }}>
            <RiFlashlightLine size={14} /> OKR-Driven Habit Tracking
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 720,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--color-primary-400) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Turn Your Goals Into Daily Wins
          </h1>
          <p style={{
            fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 560, marginBottom: 40, lineHeight: 1.7,
          }}>
            Cadence links your OKRs to daily habits so every check-in automatically moves the needle on your goals. No more manual updates. No more guessing.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta">
              Start Tracking Free <RiArrowRightLine size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 8, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Everything you need to hit your goals
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}>
            Built on proven frameworks — OKRs from Measure What Matters, habits from Atomic Habits.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: 28 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 16,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}>
                  <Icon size={24} color="var(--color-primary-500)" />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1.0625rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section style={{
          padding: '80px 48px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.05))',
          borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 48, letterSpacing: '-0.02em' }}>
              Built for serious goal-setters
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, textAlign: 'left' }}>
              {BENEFITS.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <RiCheckLine size={12} color="var(--color-accent-500)" />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 48 }}>
              <Link to="/register" className="btn btn-primary btn-lg" id="benefits-cta">
                Create Free Account <RiArrowRightLine size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '32px 48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', borderTop: '1px solid var(--border-color)' }}>
          <p>© 2026 Cadence · OKR-Driven Habit & Goal Tracker · Capstone Project</p>
        </footer>
      </div>
    </>
  );
}
