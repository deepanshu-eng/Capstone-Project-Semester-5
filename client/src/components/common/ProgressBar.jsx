export default function ProgressBar({ value = 0, size = 'md', className = '', showLabel = false, color }) {
  const clampedValue = Math.min(100, Math.max(0, value));

  // Auto-color based on value if no color specified
  const barColor = color || (clampedValue >= 70 ? 'success' : clampedValue >= 40 ? '' : 'danger');

  const heights = { sm: 4, md: 8, lg: 12 };
  const height = heights[size] || 8;

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div
        className={`progress-bar ${className}`}
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${Math.round(clampedValue)}% complete`}
      >
        <div
          className={`progress-bar-fill ${barColor}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
