import { useState } from 'react';
import '../../styles/CourseHub/EncountersTable.css';

const ENCOUNTERS = [];
const BOTTOM_STATS = [];

const STATUS_CONFIG = {
  new: { label: 'New', color: 'var(--blue)', bg: 'var(--blue-10)' },
  active: { label: 'Learning', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  critical: { label: 'Exam', color: 'var(--danger)', bg: 'var(--danger-bg)' },
  done: { label: 'Passed', color: 'var(--success)', bg: 'var(--success-bg)' },
  overdue: { label: 'Late', color: 'var(--danger)', bg: 'var(--danger-bg)' },
};

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export default function EncountersTable() {
  const [sort, setSort] = useState({ col: null, dir: 'asc' });
  const newCount = ENCOUNTERS.filter(e => e.status === 'new').length;

  function toggleSort(col) {
    setSort(prev => prev.col === col
      ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { col, dir: 'asc' }
    );
  }

  const sorted = [...ENCOUNTERS].sort((a, b) => {
    if (!sort.col) return 0;
    const va = a[sort.col] ?? '';
    const vb = b[sort.col] ?? '';
    return sort.dir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  return (
    <div className="card et-card">

      {/* Info Banner */}
      <div className="et-banner" style={{ background: 'var(--blue-5)', border: '1px solid var(--blue-10)', borderRadius: 12, margin: 16 }}>
        <div className="flex items-center gap-3">
          <div className="et-banner-icon" style={{ background: 'var(--blue)', color: 'white', borderRadius: 8 }}>
            <BellIcon />
          </div>
          <span className="et-banner-text" style={{ color: 'var(--text-700)', fontSize: 13, fontWeight: 500 }}>
            <strong>{newCount} Học viên mới</strong> đã đăng ký khóa học của bạn hôm nay.
          </span>
        </div>
        <button className="et-banner-dismiss" style={{ fontWeight: 700, fontSize: 12 }}>Bỏ qua</button>
      </div>

      {/* Table Header */}
      <div className="et-table-header flex items-center justify-between" style={{ padding: '0 24px 16px' }}>
        <h3 className="et-table-title" style={{ fontSize: 16, fontWeight: 800 }}>Danh sách học viên</h3>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 12, color: 'var(--text-500)', fontWeight: 600 }}>{ENCOUNTERS.length} học viên</span>
          <button className="et-action-btn" style={{ fontWeight: 600 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            Filter
          </button>
          <button className="et-action-btn et-action-btn--primary" style={{ fontWeight: 700 }}>+ Enrollment</button>
        </div>
      </div>

      {/* Table */}
      <div className="et-table-wrap">
        <table className="et-table">
          <thead>
            <tr>
              {['student', 'class', 'type', 'time', 'status'].map(col => (
                <th key={col} onClick={() => toggleSort(col)} className="et-th" style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      {col === 'student' ? 'Student' : col === 'class' ? 'Course' : col.charAt(0).toUpperCase() + col.slice(1)}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                      style={{ opacity: sort.col === col ? 1 : 0.2 }}>
                      {sort.dir === 'asc' ? <path d="M12 5l7 7-7 7" /> : <path d="M12 19l-7-7 7-7" />}
                    </svg>
                  </div>
                </th>
              ))}
              <th className="et-th" style={{ padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((enc) => {
              const st = STATUS_CONFIG[enc.status];
              return (
                <tr key={enc.id} className={`et-row ${enc.urgent ? 'et-row--urgent' : ''}`}>
                  <td className="et-td" style={{ padding: '16px' }}>
                    <div className="flex items-center gap-3">
                      {enc.urgent && <span className="et-urgent-dot" style={{ width: 8, height: 8, background: 'var(--danger)' }} />}
                      <div>
                        <div className="et-patient-name" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-900)' }}>{enc.student}</div>
                        <div className="et-patient-id" style={{ fontSize: 12, color: 'var(--text-400)', fontWeight: 500 }}>ID: {enc.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="et-td" style={{ padding: '16px' }}>
                    <span className="et-room" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-700)' }}>{enc.class}</span>
                  </td>
                  <td className="et-td" style={{ padding: '16px' }}>
                    <span className="et-type" style={{ fontSize: 13, color: 'var(--text-600)', fontWeight: 500 }}>{enc.type}</span>
                  </td>
                  <td className="et-td et-time" style={{ padding: '16px', fontSize: 13, color: 'var(--text-500)', fontWeight: 500 }}>{enc.time}</td>
                  <td className="et-td" style={{ padding: '16px' }}>
                    <span
                      className="badge"
                      style={{ background: st.bg, color: st.color, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="et-td" style={{ padding: '16px' }}>
                    <div className="flex items-center gap-2">
                      <button className="et-row-btn" title="Student Profile" style={{ width: 32, height: 32, borderRadius: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </button>
                      <button className="et-row-btn" title="Message" style={{ width: 32, height: 32, borderRadius: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Stats Row */}
      <div className="et-bottom-stats" style={{ padding: '16px 24px', background: 'var(--bg-light)', borderTop: '1px solid var(--border)' }}>
        {BOTTOM_STATS.map((s) => (
          <div key={s.label} className="et-stat" style={{ gap: 12 }}>
            <span className="et-stat-icon" style={{ fontSize: 20 }}>{s.icon}</span>
            <div>
              <div className="et-stat-value" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-900)' }}>{s.value}</div>
              <div className="et-stat-label" style={{ fontSize: 11, color: 'var(--text-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}