import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RiFileChartLine, RiDownloadLine, RiTimeLine } from 'react-icons/ri';
import reportService from '../../services/reportService';
import toast from 'react-hot-toast';
import { format, subWeeks, subMonths } from 'date-fns';

export default function ReportsPage() {
  const [period, setPeriod] = useState('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState([]);
  const [generated, setGenerated] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const anchorDate = format(new Date(), 'yyyy-MM-dd');
      const result = await reportService.generateReport({ period, anchorDate });
      setGenerated(result.data);
      toast.success('Report generated!');
    } catch {
      toast.error('Failed to generate report. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reports — Cadence</title>
        <meta name="description" content="Generate weekly and monthly progress reports." />
      </Helmet>

      <h1 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>Reports</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Generate progress summaries for any period</p>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20 }}>
        {/* Generator */}
        <div className="card" style={{ padding: 24, height: 'fit-content' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Generate Report</h2>

          <div className="form-group">
            <label className="form-label">Period</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['weekly', 'monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface-bg)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>This report will include:</p>
            <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>OKR progress change over the {period === 'weekly' ? 'week' : 'month'}</li>
              <li>Habit completion rate</li>
              <li>Current and longest streaks</li>
              <li>Best and worst performing habits</li>
            </ul>
          </div>

          <button
            onClick={handleGenerate}
            className="btn btn-primary"
            disabled={isGenerating}
            style={{ width: '100%' }}
            id="generate-report-btn"
          >
            <RiFileChartLine size={16} />
            {isGenerating ? 'Generating PDF...' : `Generate ${period === 'weekly' ? 'Weekly' : 'Monthly'} Report`}
          </button>
        </div>

        {/* Preview */}
        <div>
          {generated ? (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Report Preview</h2>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => toast.success('PDF download requires the backend to be connected.')}
                >
                  <RiDownloadLine size={14} /> Download PDF
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Overall Progress', value: `${generated.summary.overallProgress}%`, color: 'var(--color-primary-500)' },
                  { label: 'Habit Completion', value: `${generated.summary.habitCompletionRate}%`, color: 'var(--color-accent-500)' },
                  { label: 'Total Check-ins', value: generated.summary.totalCheckIns, color: 'var(--color-info)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--surface-bg)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-accent-500)', fontWeight: 700, marginBottom: 4 }}>🏆 Best Habit</p>
                  <p style={{ fontWeight: 600 }}>{generated.summary.bestHabit}</p>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 700, marginBottom: 4 }}>📉 Needs Attention</p>
                  <p style={{ fontWeight: 600 }}>{generated.summary.worstHabit}</p>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                <RiTimeLine size={12} /> Generated {format(new Date(generated.generatedAt), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          ) : (
            <div className="empty-state" style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <RiFileChartLine size={48} color="var(--text-muted)" />
              <p className="empty-state-title">No report generated yet</p>
              <p className="empty-state-text">Select a period and click Generate to create your progress report.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
