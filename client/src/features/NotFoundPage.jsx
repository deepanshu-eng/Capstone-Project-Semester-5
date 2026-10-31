import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiHome4Line, RiArrowLeftLine, RiCompass3Line } from 'react-icons/ri';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found — Cadence</title>
      </Helmet>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'var(--bg-primary)',
        textAlign: 'center',
      }}>
        {/* Animated compass icon */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          <RiCompass3Line size={48} color="var(--color-primary-500)" />
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-300))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: 12,
          letterSpacing: '-0.04em',
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          Lost your rhythm?
        </h2>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          maxWidth: 420,
          marginBottom: 32,
          lineHeight: 1.6,
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            <RiArrowLeftLine size={16} /> Go Back
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            <RiHome4Line size={16} /> Dashboard
          </Link>
        </div>
      </div>

      {/* Inline keyframes for the pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </>
  );
}
