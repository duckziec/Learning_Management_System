import React from 'react';
import '../../styles/CourseHub/QuickMetrics.css';

const METRICS = [];
const DEFAULT_PROGRESS = { status: 'On Track', completed: 0, total: 0, percentage: 0 };

function CircleProgress({ value, total, color }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / total, 1);
  const dash = pct * circ;

  return (
    <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--bg-light)" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
      <text
        x="36" y="36"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ transform: 'rotate(90deg) translate(0, -72px)', transformOrigin: '36px 36px', fill: 'var(--text-900)', fontSize: 13, fontWeight: 800, fontFamily: 'inherit' }}
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

export default function QuickMetrics() {
  return (
    <div className="qm-wrapper flex flex-col gap-5">

      {/* Progress Summary Card */}
      <div className="card qm-progress-card">
        <div className="qm-prog-header" style={{ padding: '20px 24px 12px' }}>
          <h3 className="qm-prog-title" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-900)' }}>Tiến độ học tập</h3>
          <span className="badge badge-success" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>{DEFAULT_PROGRESS.status}</span>
        </div>

        <div className="qm-prog-body" style={{ padding: '0 24px 16px', gap: 24 }}>
          <div className="qm-donut-wrap">
            <CircleProgress value={DEFAULT_PROGRESS.completed} total={DEFAULT_PROGRESS.total || 1} color="var(--blue)" />
          </div>
          <div className="qm-prog-legend" style={{ gap: 12 }}>
            <div className="qm-legend-item">
              <span className="qm-legend-dot" style={{ background: 'var(--blue)', width: 10, height: 10 }} />
              <span style={{ fontWeight: 700, color: 'var(--text-800)', fontSize: 13 }}>{DEFAULT_PROGRESS.completed} bài học</span>
            </div>
            <div className="qm-legend-item">
              <span className="qm-legend-dot" style={{ background: 'var(--bg-light)', width: 10, height: 10 }} />
              <span style={{ fontWeight: 600, color: 'var(--text-400)', fontSize: 13 }}>{DEFAULT_PROGRESS.total - DEFAULT_PROGRESS.completed} bài học</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '0 24px 20px' }}>
          <div className="qm-prog-bar-bg" style={{ height: 8, borderRadius: 4, background: 'var(--bg-light)' }}>
            <div className="qm-prog-bar-fill" style={{ width: `${DEFAULT_PROGRESS.percentage}%`, height: '100%', borderRadius: 4, background: 'var(--blue)' }} />
          </div>
          <div className="qm-prog-bar-label flex justify-between" style={{ marginTop: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-500)' }}>{DEFAULT_PROGRESS.completed} / {DEFAULT_PROGRESS.total} bài học</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-700)' }}>Mục tiêu: {DEFAULT_PROGRESS.total}</span>
          </div>
        </div>
      </div>

      {/* Metric cards grid */}
      <div className="qm-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {METRICS.map((m) => {
          const iconMap = {
            'lessons': (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            ),
            'completed': (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ),
            'pending': (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
            'graduated': (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            ),
          };
          return (
            <div key={m.id} className={`card qm-metric ${m.colorClass}`} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="qm-metric-icon" style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                {iconMap[m.id]}
              </div>
              <div className="qm-metric-body" style={{ flex: 1 }}>
                <div className="qm-metric-value" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-900)' }}>{m.value}</div>
                <div className="qm-metric-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-500)', marginTop: 2 }}>{m.label}</div>
              </div>
              <div className={`qm-metric-change qm-change--${m.changeType}`} style={{ fontSize: 11, fontWeight: 700 }}>
                {m.change}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}