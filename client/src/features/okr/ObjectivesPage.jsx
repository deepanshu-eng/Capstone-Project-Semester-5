import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiAddLine, RiSearchLine, RiFilterLine, RiTargetLine } from 'react-icons/ri';
import { fetchObjectives, deleteObjective } from '../../store/slices/objectivesSlice';
import ProgressBar from '../../components/common/ProgressBar';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';

const STATUS_COLORS = { active: 'badge-active', completed: 'badge-completed', archived: 'badge-archived' };

export default function ObjectivesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading } = useSelector((s) => s.objectives);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchObjectives({ status: statusFilter || undefined, q: search || undefined }));
  }, [dispatch, statusFilter, search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteObjective(deleteModal.id)).unwrap();
      toast.success('Objective deleted');
      setDeleteModal(null);
    } catch {
      toast.error('Failed to delete objective');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = items.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (search && !o.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Objectives — Cadence</title>
        <meta name="description" content="Manage your OKRs — Objectives and Key Results." />
      </Helmet>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Objectives</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Track your OKRs and Key Results</p>
        </div>
        <Link to="/objectives/new" className="btn btn-primary" id="create-objective-btn">
          <RiAddLine size={16} /> New Objective
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <RiSearchLine size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="search"
            className="form-input"
            placeholder="Search objectives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
            aria-label="Search objectives"
            id="search-objectives"
          />
        </div>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 160 }}
          aria-label="Filter by status"
          id="filter-status"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((k) => (
            <div key={k} className="card" style={{ padding: 24, height: 120 }}>
              <div className="skeleton" style={{ height: 18, width: '50%', marginBottom: 10, borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 12, width: '80%', marginBottom: 16, borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 8, width: '100%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <RiTargetLine size={48} color="var(--text-muted)" />
          <p className="empty-state-title">No objectives found</p>
          <p className="empty-state-text">
            {search || statusFilter ? 'Try adjusting your filters.' : 'Create your first Objective to get started.'}
          </p>
          {!search && !statusFilter && (
            <Link to="/objectives/new" className="btn btn-primary"><RiAddLine size={16} /> Create Objective</Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((obj) => {
            const daysLeft = differenceInDays(new Date(obj.endDate), new Date());
            return (
              <div
                key={obj.id}
                className="card"
                style={{ padding: 24, cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                onClick={() => navigate(`/objectives/${obj.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{obj.title}</h3>
                      <span className={`badge ${STATUS_COLORS[obj.status] || ''}`}>{obj.status}</span>
                      {obj.category && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--surface-bg)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                          {obj.category}
                        </span>
                      )}
                    </div>
                    {obj.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480 }}>
                        {obj.description}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-500)' }}>{obj.progress}%</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{daysLeft > 0 ? `${daysLeft}d left` : 'Ended'}</p>
                  </div>
                </div>
                <ProgressBar value={obj.progress} size="md" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {format(new Date(obj.startDate), 'MMM d')} – {format(new Date(obj.endDate), 'MMM d, yyyy')}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteModal(obj); }}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-danger)', fontSize: '0.75rem', padding: '4px 10px' }}
                    aria-label={`Delete ${obj.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Delete Objective"
        message={`Are you sure you want to delete "${deleteModal?.title}"? This will also remove all associated Key Results and habits.`}
        confirmLabel="Delete Objective"
        danger
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </>
  );
}
