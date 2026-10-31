import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RiArrowLeftLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiTargetLine, RiCheckLine, RiAlertLine, RiTimeLine,
} from 'react-icons/ri';
import { fetchObjective, deleteKeyResult, createKeyResult, updateKeyResult } from '../../store/slices/objectivesSlice';
import ProgressBar from '../../components/common/ProgressBar';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { differenceInDays, format } from 'date-fns';

function getPaceStatus(kr) {
  const total = differenceInDays(new Date(kr.deadline), new Date(kr.createdAt || kr.deadline));
  const elapsed = differenceInDays(new Date(), new Date(kr.createdAt || kr.deadline));
  if (total <= 0) return 'completed';
  const expected = Math.min(100, (elapsed / total) * 100);
  if (kr.progress >= expected - 10) return 'on-track';
  if (kr.progress >= expected - 25) return 'at-risk';
  return 'behind';
}

function KRForm({ objectiveId, objective, onSave, onCancel, initial }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initial || {
    title: '', metricType: 'numeric', unit: '', startValue: 0, targetValue: 100, weight: 1,
    deadline: objective?.endDate || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (Number(form.targetValue) === Number(form.startValue)) e.targetValue = 'Target must differ from start';
    if (!form.deadline) e.deadline = 'Deadline is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      const data = { ...form, startValue: Number(form.startValue), targetValue: Number(form.targetValue), weight: Number(form.weight) };
      if (initial?.id) {
        await dispatch(updateKeyResult({ id: initial.id, data })).unwrap();
        toast.success('Key Result updated');
      } else {
        await dispatch(createKeyResult({ objectiveId, data })).unwrap();
        toast.success('Key Result created!');
      }
      onSave();
    } catch (err) {
      toast.error(err || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 20, border: '2px solid var(--color-primary-500)' }}>
      <h4 style={{ marginBottom: 16, fontWeight: 700 }}>{initial ? 'Edit' : 'Add'} Key Result</h4>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="kr-title">Title *</label>
            <input id="kr-title" type="text" className={`form-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Run 150 km total" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="kr-type">Metric Type</label>
            <select id="kr-type" className="form-select" value={form.metricType} onChange={(e) => setForm((f) => ({ ...f, metricType: e.target.value }))}>
              <option value="numeric">Numeric</option>
              <option value="percentage">Percentage</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="kr-unit">Unit</label>
            <input id="kr-unit" type="text" className="form-input" placeholder="km, hrs, …" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="kr-start">Start Value</label>
            <input id="kr-start" type="number" className="form-input" value={form.startValue} onChange={(e) => setForm((f) => ({ ...f, startValue: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="kr-target">Target Value *</label>
            <input id="kr-target" type="number" className={`form-input ${errors.targetValue ? 'error' : ''}`} value={form.targetValue} onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))} required />
            {errors.targetValue && <span className="form-error" style={{ fontSize: '0.7rem' }}>{errors.targetValue}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="kr-weight">Weight (1–10)</label>
            <input id="kr-weight" type="number" className="form-input" min={1} max={10} value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label" htmlFor="kr-deadline">Deadline *</label>
          <input id="kr-deadline" type="date" className={`form-input ${errors.deadline ? 'error' : ''}`} value={form.deadline} max={objective?.endDate} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} required style={{ maxWidth: 200 }} />
          {errors.deadline && <span className="form-error">{errors.deadline}</span>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
            {isLoading ? 'Saving…' : initial ? 'Update' : 'Add Key Result'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ObjectiveDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentObjective, isLoading } = useSelector((s) => s.objectives);
  const [showKRForm, setShowKRForm] = useState(false);
  const [editingKR, setEditingKR] = useState(null);
  const [deleteKR, setDeleteKR] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { dispatch(fetchObjective(id)); }, [dispatch, id]);

  const obj = currentObjective;

  const handleDeleteKR = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteKeyResult(deleteKR.id)).unwrap();
      toast.success('Key Result deleted');
      setDeleteKR(null);
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const PACE_BADGE = { 'on-track': 'badge-on-track', 'at-risk': 'badge-at-risk', behind: 'badge-behind', completed: 'badge-completed' };
  const PACE_LABEL = { 'on-track': 'On Track', 'at-risk': 'At Risk', behind: 'Behind', completed: 'Done' };

  if (isLoading || !obj) {
    return (
      <div>
        <div className="skeleton" style={{ height: 32, width: 300, marginBottom: 12, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: 200, marginBottom: 24, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 12 }} />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>{obj.title} — Cadence</title></Helmet>

      <button onClick={() => navigate('/objectives')} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
        <RiArrowLeftLine size={16} /> Objectives
      </button>

      {/* Objective header */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{obj.title}</h1>
              <span className={`badge badge-${obj.status}`}>{obj.status}</span>
            </div>
            {obj.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>{obj.description}</p>}
            <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              {obj.category && <span>📁 {obj.category}</span>}
              <span>📅 {format(new Date(obj.startDate), 'MMM d')} – {format(new Date(obj.endDate), 'MMM d, yyyy')}</span>
              <span>🎯 {obj.keyResults?.length || 0} Key Results</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-500)' }}>{obj.progress}%</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>overall</p>
          </div>
        </div>
        <ProgressBar value={obj.progress} size="lg" showLabel={false} style={{ marginTop: 16 }} />
      </div>

      {/* Key Results */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Key Results</h2>
        <button onClick={() => { setShowKRForm(true); setEditingKR(null); }} className="btn btn-secondary btn-sm" id="add-kr-btn">
          <RiAddLine size={14} /> Add Key Result
        </button>
      </div>

      {showKRForm && (
        <div style={{ marginBottom: 16 }}>
          <KRForm objectiveId={id} objective={obj} onSave={() => { setShowKRForm(false); dispatch(fetchObjective(id)); }} onCancel={() => setShowKRForm(false)} />
        </div>
      )}

      {obj.keyResults?.length === 0 && !showKRForm ? (
        <div className="empty-state" style={{ padding: '32px 0' }}>
          <RiTargetLine size={40} color="var(--text-muted)" />
          <p className="empty-state-title">No Key Results yet</p>
          <p className="empty-state-text">Add measurable Key Results to track progress toward this Objective.</p>
          <button onClick={() => setShowKRForm(true)} className="btn btn-primary btn-sm"><RiAddLine size={14} /> Add Key Result</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {obj.keyResults?.map((kr) => {
            const pace = getPaceStatus(kr);
            const daysLeft = differenceInDays(new Date(kr.deadline), new Date());
            if (editingKR?.id === kr.id) {
              return (
                <div key={kr.id}>
                  <KRForm objectiveId={id} objective={obj} initial={kr} onSave={() => { setEditingKR(null); dispatch(fetchObjective(id)); }} onCancel={() => setEditingKR(null)} />
                </div>
              );
            }
            return (
              <div key={kr.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{kr.title}</h3>
                      <span className={`badge ${PACE_BADGE[pace]}`}>{PACE_LABEL[pace]}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>{kr.currentValue} / {kr.targetValue} {kr.unit}</span>
                      <span>Weight: {kr.weight}</span>
                      <span style={{ color: daysLeft <= 3 ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Deadline passed'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-primary-500)' }}>{kr.progress}%</span>
                  </div>
                </div>
                <ProgressBar value={kr.progress} size="md" />
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => setEditingKR(kr)} className="btn btn-ghost btn-sm">
                    <RiEditLine size={13} /> Edit
                  </button>
                  <button onClick={() => setDeleteKR(kr)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                    <RiDeleteBinLine size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteKR}
        title="Delete Key Result"
        message={`Delete "${deleteKR?.title}"? All linked habits and check-ins will also be removed.`}
        confirmLabel="Delete"
        danger
        isLoading={deleting}
        onConfirm={handleDeleteKR}
        onCancel={() => setDeleteKR(null)}
      />
    </>
  );
}
