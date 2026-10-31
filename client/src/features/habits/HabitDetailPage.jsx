import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { RiArrowLeftLine, RiFireLine, RiTrophyLine, RiRepeatLine, RiTimeLine } from 'react-icons/ri';
import habitService from '../../services/habitService';
import { useState } from 'react';
import { format } from 'date-fns';

export default function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const r1 = await habitService.getHabit(id);
        setHabit(r1.data);
        const r2 = await habitService.getCheckIns(id, {});
        setCheckIns(r2.data || []);
      } catch { navigate('/habits'); }
      finally { setIsLoading(false); }
    };
    load();
  }, [id, navigate]);

  if (isLoading || !habit) {
    return <div style={{ padding: 24 }}><div className="skeleton" style={{ height: 28, width: 300, marginBottom: 12, borderRadius: 6 }} /></div>;
  }

  const recentCheckIns = [...checkIns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

  return (
    <>
      <Helmet><title>{habit.title} — Cadence</title></Helmet>

      <button onClick={() => navigate('/habits')} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
        <RiArrowLeftLine size={16} /> Habits
      </button>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{habit.title}</h1>
      <span className={`badge badge-${habit.status}`} style={{ marginBottom: 20, display: 'inline-block' }}>{habit.status}</span>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { icon: RiFireLine, label: 'Current Streak', value: `${habit.currentStreak} days`, color: 'var(--color-warning)' },
          { icon: RiTrophyLine, label: 'Longest Streak', value: `${habit.longestStreak} days`, color: 'var(--color-primary-500)' },
          { icon: RiRepeatLine, label: 'Frequency', value: habit.frequency.type === 'daily' ? 'Daily' : `${habit.frequency.days?.length} days/week`, color: 'var(--color-accent-500)' },
          { icon: RiTimeLine, label: 'Reminder', value: habit.reminderTime || 'None', color: 'var(--color-info)' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Icon size={16} color={color} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Check-in history */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Recent Check-ins</h2>
        {recentCheckIns.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No check-ins recorded yet. Start checking in from the Today view!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentCheckIns.map((ci) => (
              <div key={ci.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: 'var(--surface-bg)', borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {format(new Date(ci.date), 'EEE, MMM d, yyyy')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {ci.value !== undefined && ci.value !== null && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ci.value} {habit.unit || ''}</span>
                  )}
                  {ci.note && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{ci.note}"</span>}
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RiFireLine size={12} color="white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
