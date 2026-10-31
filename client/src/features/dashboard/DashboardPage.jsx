import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  RiTargetLine, RiRepeatLine, RiFireLine, RiTrophyLine,
  RiTimeLine, RiArrowRightLine, RiAddLine,
} from 'react-icons/ri';
import { fetchDashboardSummary, fetchTrends } from '../../store/slices/dashboardSlice';
import ProgressBar from '../../components/common/ProgressBar';
import { format, parseISO } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, sub, color = 'var(--color-primary-500)' }) => (
  <div className="card" style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
      background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</p>}
    </div>
  </div>
);

const Skeleton = ({ h = 20, w = '100%', mb = 8 }) => (
  <div className="skeleton" style={{ height: h, width: w, marginBottom: mb, borderRadius: 6 }} />
);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { summary, trends, isLoading } = useSelector((s) => s.dashboard);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchTrends(12));
  }, [dispatch]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 14px', fontSize: '0.8rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--color-primary-400)', fontWeight: 700 }}>{payload[0].value}% completion</p>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Dashboard — Cadence</title>
        <meta name="description" content="Your OKR progress, habit streaks, and daily summary at a glance." />
      </Helmet>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')} · Here's your progress overview
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {isLoading ? (
          [1, 2, 3, 4].map((k) => (
            <div key={k} className="card" style={{ padding: 20, height: 96 }}>
              <Skeleton h={16} w="60%" mb={12} />
              <Skeleton h={28} w="40%" mb={6} />
              <Skeleton h={12} w="50%" />
            </div>
          ))
        ) : summary ? (
          <>
            <StatCard icon={RiTargetLine} label="Overall Progress" value={`${summary.overallProgress}%`} sub={`${summary.stats.activeObjectives} active objectives`} color="var(--color-primary-500)" />
            <StatCard icon={RiRepeatLine} label="Today's Habits" value={`${summary.stats.todayCompleted}/${summary.stats.todayTotal}`} sub="completed today" color="var(--color-accent-500)" />
            <StatCard icon={RiFireLine} label="Top Streak" value={`${summary.topStreaks[0]?.currentStreak || 0} days`} sub={summary.topStreaks[0]?.title || '—'} color="var(--color-warning)" />
            <StatCard icon={RiTrophyLine} label="Active OKRs" value={summary.stats.activeObjectives} sub={`${summary.stats.totalHabits} habits linked`} color="var(--color-info)" />
          </>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        {/* Trend Chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Habit Completion Trend</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Last 12 weeks</p>
            </div>
          </div>
          {isLoading ? (
            <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
          ) : trends.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No trend data yet. Start checking in habits!</p>
            </div>
          ) : (
            <div aria-label={`Trend chart: weekly habit completion over the last ${trends.length} weeks`}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trends.map((t) => ({ ...t, week: format(parseISO(t.week), 'MMM d') }))}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="completionRate" stroke="#6366f1" strokeWidth={2.5} fill="url(#trendGrad)" dot={false} activeDot={{ r: 5, fill: '#6366f1' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Upcoming Deadlines</h2>
            <RiTimeLine size={18} color="var(--text-muted)" />
          </div>
          {isLoading ? (
            [1, 2, 3].map((k) => <div key={k}><Skeleton h={14} mb={6} /><Skeleton h={10} w="70%" mb={16} /></div>)
          ) : summary?.upcomingDeadlines?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No deadlines in the next 14 days 🎉</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {summary?.upcomingDeadlines?.slice(0, 5).map((kr) => {
                const daysLeft = Math.ceil((new Date(kr.deadline) - new Date()) / 86400000);
                return (
                  <div key={kr.id} style={{ padding: '12px', background: 'var(--surface-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{kr.title}</p>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)',
                        background: daysLeft <= 3 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                        color: daysLeft <= 3 ? 'var(--color-danger)' : 'var(--color-warning)',
                      }}>
                        {daysLeft}d left
                      </span>
                    </div>
                    <ProgressBar value={kr.progress} size="sm" />
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{kr.objectiveTitle}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Objectives + Top Streaks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Active Objectives */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Active Objectives</h2>
            <Link to="/objectives" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--color-primary-500)', fontWeight: 600 }}>
              View all <RiArrowRightLine size={14} />
            </Link>
          </div>
          {isLoading ? (
            [1, 2, 3].map((k) => <div key={k} style={{ marginBottom: 16 }}><Skeleton h={14} mb={8} /><Skeleton h={8} mb={4} /><Skeleton h={12} w="30%" /></div>)
          ) : summary?.activeObjectives?.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 12 }}>No objectives yet</p>
              <Link to="/objectives/new" className="btn btn-primary btn-sm"><RiAddLine size={14} /> Create Objective</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {summary?.activeObjectives?.map((obj) => (
                <div key={obj.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Link to={`/objectives/${obj.id}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                      {obj.title}
                    </Link>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-400)' }}>{obj.progress}%</span>
                  </div>
                  <ProgressBar value={obj.progress} size="sm" />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{obj.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Streaks */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Top Streaks 🔥</h2>
            <Link to="/habits" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--color-primary-500)', fontWeight: 600 }}>
              All habits <RiArrowRightLine size={14} />
            </Link>
          </div>
          {isLoading ? (
            [1, 2, 3, 4, 5].map((k) => (
              <div key={k} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <Skeleton h={36} w={36} mb={0} />
                <div style={{ flex: 1 }}><Skeleton h={14} mb={4} /><Skeleton h={10} w="50%" mb={0} /></div>
              </div>
            ))
          ) : summary?.topStreaks?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Check in some habits to build streaks!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {summary?.topStreaks?.map((h, i) => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                      i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                        i === 2 ? 'linear-gradient(135deg, #cd7c3a, #92400e)' :
                          'rgba(99,102,241,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i < 3 ? 'white' : 'var(--color-primary-500)',
                    fontSize: '0.8rem', fontWeight: 800,
                  }}>
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.currentStreak} day streak</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
