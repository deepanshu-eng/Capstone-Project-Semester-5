import { useEffect } from 'react';
import { RiCloseLine, RiAlertLine } from 'react-icons/ri';

export default function ConfirmModal({
  isOpen, onConfirm, onCancel,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  danger = false,
  isLoading = false,
}) {
  useEffect(() => {
    if (isOpen) {
      const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-content" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {danger && <RiAlertLine size={20} color="var(--color-danger)" />}
            <h3 id="confirm-title" style={{ fontSize: '1rem', margin: 0 }}>{title}</h3>
          </div>
          <button onClick={onCancel} className="btn btn-ghost btn-icon" aria-label="Close dialog">
            <RiCloseLine size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            disabled={isLoading}
            id="confirm-action-btn"
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
