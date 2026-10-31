import { Component } from 'react';
import { RiAlertLine, RiRefreshLine } from 'react-icons/ri';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-bg)', padding: 24,
        }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            }}>
              <RiAlertLine size={36} color="var(--color-danger)" />
            </div>
            <h1 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <RiRefreshLine size={16} /> Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
