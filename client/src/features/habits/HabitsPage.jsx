import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RiAddLine, RiFireLine, RiRepeatLine, RiPauseLine, RiPlayLine,
  RiDeleteBinLine, RiEditLine, RiCheckLine,
} from 'react-icons/ri';
import { fetchHabits, updateHabit, deleteHabit, createHabit } from '../../store/slices/habitsSlice';
import { fetchObjectives } from '../../store/slices/objectivesSlice';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function HabitForm({ objectives, habits, onSave, onCancel, initial }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initial || {
    title: '', keyResult: '', frequency: { type: 'daily', days: [] },
    contributionValue: 1, reminderTime: '08:00',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Build KR options grouped by objective
  const krOptions = [];
  objectives.forEach((obj) => {
    if (obj.keyResults?.length) {
      obj.keyResults.forEach((kr) => {
        krOptions.push({ value: kr.id, label: `${kr.title}`, group: obj.title });
      });
    }
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Name is required';
    if (!form.keyResult) e.keyResult = 'Select a Key Result';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      if (initial?.id) {
        await dispatch(updateHabit({ id: initial.id, data: form })).unwrap();
        toast.success('Habit updated');
      } else {
        await dispatch(createHabit(form)).unwrap();
        toast.success('Habit created!');
      }
      onSave();
    } catch (err) {
      toast.error(err || 'Failed to save habit');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (d) => {
    const days = form.frequency.days || [];
    const newDays = days.includes(d) ? days.filter((x) => x !== d) : [...days, d];
    setForm((f) => ({ ...f, frequency: { ...f.frequency, days: newDays.sort() } }));
  };

  return (
    <div className="card" style={{ padding: 20, border: '2px solid var(--color-primary-500)', marginBottom: 16 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{initial ? 'Edit' : 'New'} Habit</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="hab-name">Habit Name *</label>
            <input id="hab-name" type="text" className={`form-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Morning Run" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="hab-kr">Linked Key Result *</label>
            <select id="hab-kr" className={`form-select ${errors.keyResult ? 'error' : ''}`} value={form.keyResult} onChange={(e) => setForm((f) => ({ ...f, keyResult: e.target.value }))} required>
              <option value="">Select Key Result…</option>
              {objectives.map((obj) => (
                <optgroup key={obj.id} label={obj.title}>
                  {obj.keyResults?.map((kr) => (
                    <option key={kr.id} value={kr.id}>{kr.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.keyResult && <span className="form-error">{errors.keyResult}</span>}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="form-label">Frequency</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {['daily', 'weekdays', 'timesPerWeek'].map((t) => (
              <button
                key={t} type="button"
                onClick={() => setForm((f) => ({ ...f, frequency: { ...f.frequency, type: t } }))}
                className={`btn btn-sm ${form.frequency.type === t ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t === 'daily' ? 'Daily' : t === 'weekdays' ? 'Select Days' : 'X times/week'}
              </button>
            ))}
          </div>
          {form.frequency.type === 'weekdays' && (
            <div style={{ display: 'flex', gap: 6 }}>
              {DAYS.map((day, i) => (
                <button
                  key={day} type="button"
                  onClick={() => toggleDay(i)}
                  aria-pressed={(form.frequency.days || []).includes(i)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: '2px solid',
                    borderColor: (form.frequency.days || []).includes(i) ? 'var(--color-primary-500)' : 'var(--border-color)',
                    background: (form.frequency.days || []).includes(i) ? 'var(--color-primary-500)' : 'transparent',
                    color: (form.frequency.days || []).includes(i) ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem',
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
          {form.frequency.type === 'timesPerWeek' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="number" className="form-input" min={1} max={7} value={form.frequency.timesPerWeek || 3} onChange={(e) => setForm((f) => ({ ...f, frequency: { ...f.frequency, timesPerWeek: Number(e.target.value) } }))} style={{ width: 80 }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>times per week</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="hab-contrib">Contribution per check-in</label>
            <input id="hab-contrib" type="number" className="form-input" min={0} step="0.1" value={form.contributionValue} onChange={(e) => setForm((f) => ({ ...f, contributionValue: Number(e.target.value) }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="hab-reminder">Reminder Time</label>
            <input id="hab-reminder" type="time" className="form-input" value={form.reminderTime} onChange={(e) => setForm((f) => ({ ...f, reminderTime: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
            {isLoading ? 'Saving…' : initial ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function HabitsPage() {
  const dispatch = useDispatch();
  const { items: habits, isLoading } = useSelector((s) => s.habits);
  const { items: objectives } = useSelector((s) => s.objectives);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchObjectives());
  }, [dispatch]);

  const objectivesWithKRs = objectives.filter((o) => o.keyResults?.length > 0 || o.status === 'active');

  const filtered = habits.filter((h) => filter === 'all' || h.status === filter);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteHabit({ id: deleteModal.id, hard: false })).unwrap();
      toast.success('Habit archived');
      setDeleteModal(null);
    } catch { toast.error('Failed to archive habit'); }
    finally { setDeleting(false); }
  };

  const handleTogglePause = async (habit) => {
    try {
      await dispatch(updateHabit({ id: habit.id, data: { status: habit.status === 'paused' ? 'active' : 'paused' } })).unwrap();
      toast.success(habit.status === 'paused' ? 'Habit resumed' : 'Habit paused');
    } catch { toast.error('Failed to update habit'); }
  };

  return (
    <>
      <Helmet>
        <title>Habits — Cadence</title>
        <meta name="description" content="Manage your daily and weekly habits linked to Key Results." />
      </Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Habits</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Daily actions linked to your Key Results</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingHabit(null); }} className="btn btn-primary" id="create-habit-btn">
          <RiAddLine size={16} /> New Habit
        </button>
      </div>

      {showForm && !editingHabit && (
        <HabitForm
          objectives={objectives}
          onSave={() => { setShowForm(false); dispatch(fetchHabits()); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', padding: 4, width: 'fit-content', border: '1px solid var(--border-color)' }}>
        {['active', 'paused', 'archived', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((k) => <div key={k} className="card" style={{ padding: 20, height: 90 }}><div className="skeleton" style={{ height: 16, width: '50%', marginBottom: 10, borderRadius: 4 }} /><div className="skeleton" style={{ height: 12, width: '80%', borderRadius: 4 }} /></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <RiRepeatLine size={48} color="var(--text-muted)" />
          <p className="empty-state-title">No {filter !== 'all' ? filter : ''} habits</p>
          <p className="empty-state-text">Habits are daily actions that contribute to your Key Results automatically on each check-in.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><RiAddLine size={14} /> New Habit</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((h) => {
            if (editingHabit?.id === h.id) {
              return (
                <div key={h.id}>
                  <HabitForm
                    objectives={objectives}
                    initial={h}
                    onSave={() => { setEditingHabit(null); dispatch(fetchHabits()); }}
                    onCancel={() => setEditingHabit(null)}
                  />
                </div>
              );
            }
            return (
              <div key={h.id} className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14, opacity: h.status === 'archived' ? 0.6 : 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: h.status === 'paused' ? 'rgba(148,163,184,0.12)' : 'rgba(99,102,241,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <RiRepeatLine size={20} color={h.status === 'paused' ? 'var(--text-muted)' : 'var(--color-primary-500)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{h.title}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                    {h.currentStreak > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600 }}>
                        <RiFireLine size={12} /> {h.currentStreak} day streak
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {h.frequency.type === 'daily' ? 'Every day' : h.frequency.type === 'weekdays' ? `${h.frequency.days?.length} days/week` : `${h.frequency.timesPerWeek}x/week`}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best: {h.longestStreak} days</span>
                    <span className={`badge ${h.status === 'active' ? 'badge-active' : h.status === 'paused' ? 'badge-archived' : 'badge-archived'}`}>{h.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {h.status !== 'archived' && (
                    <>
                      <button onClick={() => handleTogglePause(h)} className="btn btn-ghost btn-icon" title={h.status === 'paused' ? 'Resume' : 'Pause'} aria-label={h.status === 'paused' ? `Resume ${h.title}` : `Pause ${h.title}`}>
                        {h.status === 'paused' ? <RiPlayLine size={16} /> : <RiPauseLine size={16} />}
                      </button>
                      <button onClick={() => { setEditingHabit(h); setShowForm(false); }} className="btn btn-ghost btn-icon" title="Edit habit" aria-label={`Edit ${h.title}`}>
                        <RiEditLine size={16} />
                      </button>
                    </>
                  )}
                  <button onClick={() => setDeleteModal(h)} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-danger)' }} title="Archive habit" aria-label={`Archive ${h.title}`}>
                    <RiDeleteBinLine size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Archive Habit"
        message={`Archive "${deleteModal?.title}"? History and streaks are preserved.`}
        confirmLabel="Archive"
        danger
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </>
  );
}
