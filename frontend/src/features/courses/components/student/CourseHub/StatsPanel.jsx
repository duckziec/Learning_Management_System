import React, { useState } from 'react';
import '../../styles/CourseHub/StatsPanel.css';

const CHART_ITEMS = [];

const STATUS_MAP = {
  completed: { label: 'Đã chấm', color: 'var(--success)', bg: 'var(--success-bg)' },
  'in-progress': { label: 'Đang chấm', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  pending: { label: 'Chờ chấm', color: 'var(--danger)', bg: 'var(--danger-bg)' },
};

function StudentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function AssignmentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default function StatsPanel() {
  const [activeTab, setActiveTab] = useState('all');
  const completed = CHART_ITEMS.filter(c => c.status === 'completed').length;
  const inProgress = CHART_ITEMS.filter(c => c.status === 'in-progress').length;
  const pending = CHART_ITEMS.filter(c => c.status === 'pending').length;

  const filtered = activeTab === 'all' ? CHART_ITEMS
    : CHART_ITEMS.filter(c => c.status === activeTab);

  return (
    <div className="card sp-card">
      {/* Card Header */}
      <div className="sp-header">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-indigo" style={{ width: 44, height: 44, borderRadius: 12 }}>
            <StudentIcon />
          </div>
          <div>
            <h2 className="sp-title">Hoạt động học tập</h2>
            <p className="sp-subtitle">Theo dõi tiến độ bài tập</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Counts */}
          <div className="sp-count-chips flex items-center gap-2">
            <span className="badge badge-success" style={{ fontWeight: 700 }}>{completed} graded</span>
            <span className="badge badge-warning" style={{ fontWeight: 700 }}>{inProgress} review</span>
            <span className="badge badge-danger" style={{ fontWeight: 700 }}>{pending} late</span>
          </div>
          <button className="sp-view-all">View All</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sp-tabs">
        {[
          { key: 'all', label: 'All Activity', count: CHART_ITEMS.length },
          { key: 'completed', label: 'Graded', count: completed },
          { key: 'in-progress', label: 'In Review', count: inProgress },
          { key: 'pending', label: 'Pending', count: pending },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`sp-tab ${activeTab === tab.key ? 'sp-tab--active' : ''}`}
          >
            {tab.label}
            <span className="sp-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Chart List */}
      <div className="sp-list">
        {filtered.map((item) => {
          const st = STATUS_MAP[item.status];
          return (
            <div key={item.id} className="sp-item">
              {/* Left */}
              <div className="flex items-start gap-4" style={{ flex: 1, minWidth: 0 }}>
                {/* Status dot */}
                <div className="sp-dot-wrap" style={{ marginTop: 4 }}>
                  <span className="sp-dot" style={{ background: st.color, boxShadow: `0 0 0 3px ${st.bg}` }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
                    <span className="sp-patient-name" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-800)' }}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1 sp-doc-type" style={{ fontSize: 12, color: 'var(--text-500)', fontWeight: 500 }}>
                    <AssignmentIcon />
                    {item.type}
                  </div>

                  {/* Progress bar */}
                  {item.status !== 'pending' && (
                    <div className="sp-progress" style={{ marginTop: 10, height: 6, borderRadius: 3, background: 'var(--bg-light)' }}>
                      <div
                        className="sp-progress-fill"
                        style={{
                          width: `${item.progress}%`,
                          background: item.status === 'completed' ? 'var(--success)' : 'var(--warning)',
                          borderRadius: 3,
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end" style={{ flexShrink: 0, gap: 6 }}>
                <span
                  className="badge"
                  style={{ background: st.bg, color: st.color, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {st.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-500)', fontWeight: 600 }}>
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sp-footer" style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 12, color: 'var(--text-400)', fontWeight: 500 }}>Last sync: —</span>
        <button className="sp-refresh-btn" style={{ fontWeight: 600 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Đồng bộ ngay
        </button>
      </div>
    </div>
  );
}