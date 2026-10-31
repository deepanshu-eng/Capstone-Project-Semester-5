import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import { createObjective } from '../../store/slices/objectivesSlice';
import toast from 'react-hot-toast';
import { format, addMonths } from 'date-fns';

const QUARTERS = [
  { label: 'Q1 2027', start: '2027-01-01', end: '2027-03-31' },
  { label: 'Q2 2027', start: '2027-04-01', end: '2027-06-30' },
  { label: 'Q3 2027', start: '2027-07-01', end: '2027-09-30' },
  { label: 'Q4 2026', start: '2026-10-01', end: '2026-12-31' },
];

const CATEGORIES = ['Health', 'Career', 'Personal Growth', 'Finance', 'Relationships', 'Learning', 'Projects', 'Other'];

export default function NewObjectivePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 120) e.title = 'Max 120 characters';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    else if (form.endDate <= form.startDate) e.endDate = 'End date must be after start date';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }));
  };

  const applyQuarter = (q) => {
    setForm((f) => ({ ...f, startDate: q.start, endDate: q.end }));
    setErrors((e) => ({ ...e, startDate: '', endDate: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      const result = await dispatch(createObjective(form)).unwrap();
      toast.success('Objective created!');
      navigate(`/objectives/${result.id}`);
    } catch (err) {
      toast.error(err || 'Failed to create objective');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>New Objective — Cadence</title></Helmet>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
          <RiArrowLeftLine size={16} /> Back
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24, letterSpacing: '-0.02em' }}>Create Objective</h1>

        <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="obj-title">Objective Title *</label>
            <input
              id="obj-title"
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Improve physical fitness"
              value={form.title}
              onChange={handleChange('title')}
              onBlur={() => { const e = validate(); setErrors((er) => ({ ...er, title: e.title || '' })); }}
              maxLength={120}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {errors.title ? <span className="form-error">{errors.title}</span> : <span />}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.title.length}/120</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="obj-desc">Description</label>
            <textarea id="obj-desc" className="form-textarea" placeholder="What does success look like?" value={form.description} onChange={handleChange('description')} rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="obj-category">Category</label>
            <select id="obj-category" className="form-select" value={form.category} onChange={handleChange('category')}>
              <option value="">Select category (optional)</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Quarter presets */}
          <div className="form-group">
            <label className="form-label">Quarter Presets</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {QUARTERS.map((q) => (
                <button
                  key={q.label} type="button"
                  onClick={() => applyQuarter(q)}
                  className="btn btn-secondary btn-sm"
                  style={{ background: form.startDate === q.start ? 'rgba(99,102,241,0.12)' : '' }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="obj-start">Start Date *</label>
              <input id="obj-start" type="date" className={`form-input ${errors.startDate ? 'error' : ''}`} value={form.startDate} onChange={handleChange('startDate')} required />
              {errors.startDate && <span className="form-error">{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="obj-end">End Date *</label>
              <input id="obj-end" type="date" className={`form-input ${errors.endDate ? 'error' : ''}`} value={form.endDate} onChange={handleChange('endDate')} min={form.startDate} required />
              {errors.endDate && <span className="form-error">{errors.endDate}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} id="save-objective-btn" style={{ flex: 1 }}>
              <RiSaveLine size={16} /> {isLoading ? 'Creating...' : 'Create Objective'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
