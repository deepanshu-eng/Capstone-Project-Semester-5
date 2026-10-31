import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import {
  RiCheckLine, RiCloseLine, RiFireLine, RiRepeatLine,
  RiTimeLine, RiArrowGoBackLine, RiAddLine,
} from 'react-icons/ri';
import { fetchHabits, checkInHabit, undoCheckIn, optimisticCheckIn, rollbackCheckIn } from '../../store/slices/habitsSlice';
import { fetchDashboardSummary } from '../../store/slices/dashboardSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const today = format(new Date(), 'yyyy-MM-dd');
const todayDow = new Date().getDay(); // 0=Sun,6=Sat

function isHabitDueToday(habit) {
  if (habit.status !== 'active') return false;
  const { type, days } = habit.frequency;
  if (type === 'daily') return true;
  if (type === 'weekdays') return days?.includes(todayDow);
  if (type === 'timesPerWeek') return true;
  return false;
}

function HabitCard({ habit }) {
  const dispatch = useDispatch();
  const [undoTimer, setUndoTimer] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const checked = habit.checkedInToday;

  const handleCheckIn = async () => {
    if (checked || checkingIn) return;
    setCheckingIn(true);
    // Optimistic update (FE-ST-04)
    dispatch(optimisticCheckIn({ habitId: habit.id }));
    try {
      await dispatch(checkInHabit({ habitId: habit.id, data: { date: today } })).unwrap();
      dispatch(fetchDashboardSummary());
      const toastId = toast.success(
        (t) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>✅ Checked in: <strong>{habit.title}</strong></span>
            <button
              onClick={() => { toast.dismiss(t.id); handleUndo(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-500)', fontWeight: 700, padding: 0, fontSize: '0.875rem' }}
            >
              Undo
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    } catch (err) {
      // Rollback on failure
      dispatch(rollbackCheckIn({ habitId: habit.id }));
      toast.error(err || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleUndo = async () => {
    try {
      await dispatch(undoCheckIn({ habitId: habit.id, date: today })).unwrap();
      dispatch(fetchDashboardSummary());
      toast.success('Check-in undone');
    } catch {
      toast.error('Failed to undo check-in');
    }
  };

  return (
    <div className="card" style={{
      padding: 18,
      display: 'flex', alignItems: 'center', gap: 14,
      borderLeft: checked ? '3px solid var(--color-accent-500)' : '3px solid transparent',
      transition: 'all var(--transition-base)',
      opacity: checked ? 0.85 : 1,
    }}>
      {/* Check button */}
      <button
        onClick={handleCheckIn}
        disabled={checked || checkingIn}
        aria-label={checked ? `${habit.title} completed` : `Check in ${habit.title}`}
        id={`checkin-${habit.id}`}
        style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${checked ? 'var(--color-accent-500)' : 'var(--border-color)'}`,
          background: checked ? 'var(--color-accent-500)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: checked ? 'default' : 'pointer',
          transition: 'all var(--transition-fast)',
        }}
      >
        {checked && <RiCheckLine size={20} color="white" />}
      </button>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)',
          textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1,
        }}>
          {habit.title}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
          {habit.currentStreak > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600 }}>
              <RiFireLine size={13} /> {habit.currentStreak} day streak
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <RiRepeatLine size={13} /> {habit.frequency.type === 'daily' ? 'Daily' : `${habit.frequency.days?.length} days/week`}
          </span>
          {habit.reminderTime && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <RiTimeLine size={13} /> {habit.reminderTime}
            </span>
          )}
        </div>
      </div>

      {/* Undo if checked */}
      {checked && (
        <button
          onClick={handleUndo}
          className="btn btn-ghost btn-sm"
          aria-label={`Undo check-in for ${habit.title}`}
          style={{ flexShrink: 0 }}
        >
          <RiArrowGoBackLine size={14} /> Undo
        </button>
      )}
    </div>
  );
}

export default function TodayPage() {
  const dispatch = useDispatch();
  const { items: habits, isLoading } = useSelector((s) => s.habits);

  useEffect(() => {
    dispatch(fetchHabits({ dueOn: today }));
  }, [dispatch]);

  const todaysHabits = habits.filter(isHabitDueToday);
  const completedCount = todaysHabits.filter((h) => h.checkedInToday).length;
  const pct = todaysHabits.length > 0 ? Math.round((completedCount / todaysHabits.length) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Today — Cadence</title>
        <meta name="description" content="Check in your habits for today and keep your streaks alive." />
      </Helmet>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Today</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
              {format(new Date(), 'EEEE, MMMM d')} · {completedCount} of {todaysHabits.length} done
            </p>
          </div>
          <Link to="/habits" className="btn btn-secondary btn-sm">
            <RiAddLine size={14} /> Add Habit
          </Link>
        </div>

        {/* Progress bar */}
        {todaysHabits.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Progress</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: pct === 100 ? 'var(--color-accent-500)' : 'var(--text-secondary)' }}>
                {pct}% {pct === 100 ? '🎉' : ''}
              </span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div
                className={`progress-bar-fill ${pct === 100 ? 'success' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Habit list */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="card" style={{ padding: 18, height: 80 }}>
              <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8, borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : todaysHabits.length === 0 ? (
        <div className="empty-state">
          <RiRepeatLine size={48} color="var(--text-muted)" />
          <p className="empty-state-title">No habits scheduled today</p>
          <p className="empty-state-text">Create habits linked to your Key Results and they'll appear here on their scheduled days.</p>
          <Link to="/habits" className="btn btn-primary"><RiAddLine size={16} /> Create a Habit</Link>
        </div>
      ) : (
        <>
          {/* Pending */}
          {todaysHabits.filter((h) => !h.checkedInToday).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Pending</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todaysHabits.filter((h) => !h.checkedInToday).map((h) => (
                  <HabitCard key={h.id} habit={h} />
                ))}
              </div>
            </div>
          )}
          {/* Completed */}
          {todaysHabits.filter((h) => h.checkedInToday).length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Completed ✓</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todaysHabits.filter((h) => h.checkedInToday).map((h) => (
                  <HabitCard key={h.id} habit={h} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
