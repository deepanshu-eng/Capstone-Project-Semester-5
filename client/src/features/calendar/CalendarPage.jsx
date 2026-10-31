import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { RiArrowLeftLine, RiArrowRightLine, RiCalendarLine } from 'react-icons/ri';
import { fetchCalendar } from '../../store/slices/dashboardSlice';
import { format, addMonths, subMonths, startOfMonth, getDay, getDaysInMonth, parseISO } from 'date-fns';

const STATE_COLORS = {
  complete: { bg: 'rgba(34,197,94,0.7)', label: 'All done' },
  partial: { bg: 'rgba(245,158,11,0.6)', label: 'Partial' },
  missed: { bg: 'rgba(239,68,68,0.5)', label: 'Missed' },
  none: { bg: 'transparent', label: 'None scheduled' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const dispatch = useDispatch();
  const { calendar } = useSelector((s) => s.dashboard);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthKey = format(currentMonth, 'yyyy-MM');

  useEffect(() => {
    dispatch(fetchCalendar(monthKey));
  }, [dispatch, monthKey]);

  const firstDow = getDay(startOfMonth(currentMonth));
  const daysInMonth = getDaysInMonth(currentMonth);

  // Map calendar data by date
  const calMap = {};
  (calendar || []).forEach((d) => { calMap[d.date] = d; });

  const selectedData = selectedDay ? calMap[selectedDay] : null;

  return (
    <>
      <Helmet>
        <title>Calendar — Cadence</title>
        <meta name="description" content="View your habit check-in history in a monthly calendar." />
      </Helmet>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Calendar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn btn-ghost btn-icon" aria-label="Previous month"><RiArrowLeftLine size={18} /></button>
          <span style={{ fontWeight: 700, minWidth: 140, textAlign: 'center' }}>{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn btn-ghost btn-icon" aria-label="Next month"><RiArrowRightLine size={18} /></button>
          <button onClick={() => setCurrentMonth(new Date())} className="btn btn-secondary btn-sm">Today</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Calendar grid */}
        <div className="card" style={{ padding: 20 }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {d}
              </div>
            ))}
          </div>
          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {/* Empty cells for first week offset */}
            {Array.from({ length: firstDow }).map((_, i) => <div key={`empty-${i}`} />)}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${monthKey}-${String(day).padStart(2, '0')}`;
              const data = calMap[dateStr];
              const state = data?.state || 'none';
              const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
              const isSel = selectedDay === dateStr;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSel ? null : dateStr)}
                  aria-label={`${dateStr}: ${STATE_COLORS[state]?.label || 'no data'}`}
                  aria-pressed={isSel}
                  style={{
                    aspectRatio: '1', borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isSel ? 'var(--color-primary-500)' : isToday ? 'var(--color-primary-500)' : 'transparent'}`,
                    background: state !== 'none' ? STATE_COLORS[state].bg : isToday ? 'rgba(99,102,241,0.08)' : 'var(--surface-bg)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all var(--transition-fast)', gap: 2,
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--color-primary-500)' : 'var(--text-primary)' }}>{day}</span>
                  {data && data.scheduled > 0 && (
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>
                      {data.completed}/{data.scheduled}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {Object.entries(STATE_COLORS).filter(([k]) => k !== 'none').map(([key, { bg, label }]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: bg }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day panel */}
        <div className="card" style={{ padding: 20 }}>
          {selectedDay ? (
            <>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                {format(parseISO(selectedDay), 'EEEE, MMM d')}
              </h2>
              {selectedData && selectedData.scheduled > 0 ? (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
                    padding: '10px 14px', borderRadius: 'var(--radius-md)',
                    background: STATE_COLORS[selectedData.state]?.bg || 'var(--surface-bg)',
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {selectedData.completed} / {selectedData.scheduled} habits completed
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 8, marginBottom: 16 }}>
                    <div className="progress-bar-fill success" style={{ width: `${(selectedData.completed / selectedData.scheduled) * 100}%` }} />
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No habits scheduled this day.</p>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <RiCalendarLine size={32} color="var(--text-muted)" />
              <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: '0.875rem' }}>
                Click a day to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
