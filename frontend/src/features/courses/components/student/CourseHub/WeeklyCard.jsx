import React, {useState} from 'react';
import '../../styles/CourseHub/WeeklyCard.css';

const TODAY_INDEX = 0;

const WEEK_DATA = [];

function BookIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
        </svg>
    );
}

export default function WeeklyCard() {
    const [activeDay, setActiveDay] = useState(TODAY_INDEX);
    const selected = WEEK_DATA[activeDay];

    return (
        <div className="card wk-card">
            {/* Blue Header */}
            <div className="wk-header">
                <div className="wk-header-left flex items-center gap-3">
                    <div className="avatar"
                         style={{width: 40, height: 40, background: 'rgba(255,255,255,0.2)', fontSize: 15}}>
                        📚
                    </div>
                    <div>
                        <div className="wk-header-name">Lịch học tuần này</div>
                        <div className="wk-header-sub">Theo dõi tiến độ học tập</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="wk-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        Giờ học đang diễn ra
                    </div>
                    <button className="wk-meeting-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2">
                            <path d="M23 7l-7 5 7 5V7z"/>
                            <rect x="1" y="5" width="15" height="14" rx="2"/>
                        </svg>
                        Tham gia lớp học trực tiếp
                    </button>
                </div>
            </div>

            {/* Day summary strip */}
            <div className="wk-divider-strip">
                <div className="wk-week-label">
                    <span>Tuần này</span>
                    <span
                        className="wk-week-totals">{WEEK_DATA.reduce((a, d) => a + d.lessons, 0)} bài học · {WEEK_DATA.reduce((a, d) => a + d.assignments, 0)} bài tập</span>
                </div>
                <div className="wk-nav-arrows">
                    <button className="wk-arrow-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button className="wk-arrow-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Day columns */}
            <div className="wk-days">
                {WEEK_DATA.map((d, i) => (
                    <div
                        key={d.day}
                        className={`wk-day-card ${d.status === 'today' ? 'wk-day-card--today' : ''} ${i === activeDay ? 'wk-day-card--active' : ''}`}
                        onClick={() => setActiveDay(i)}
                    >
                        {/* Header */}
                        <div className="wk-day-header">
                            <span className="wk-day-label">{d.day}</span>
                            <span
                                className={`wk-day-date ${d.status === 'today' ? 'wk-day-date--today' : ''}`}>{d.date}</span>
                        </div>

                        {/* Body */}
                        <div className="wk-day-body">
                            {d.lessons === 0 && d.assignments === 0 ? (
                                <div className="wk-day-empty">
                                    <BookIcon/>
                                </div>
                            ) : (
                                <div className="wk-day-stats">
                                    <div className="wk-day-stat-row">
                                        <span className="wk-day-stat-value">{d.lessons}</span>
                                        <span className="wk-day-stat-label">Bài học</span>
                                    </div>
                                    <div className="wk-day-stat-row">
                                        <span className="wk-day-stat-value">{d.assignments}</span>
                                        <span className="wk-day-stat-label">Bài tập</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="wk-day-footer">
                            {d.status === 'today' ? (
                                <button className="wk-today-btn">Bài tập ngày hôm nay</button>
                            ) : d.status === 'done' ? (
                                <div className="wk-done-badge flex items-center gap-1">
                                    <CheckIcon/>
                                    <span>Hoàn thành</span>
                                </div>
                            ) : (
                                <span className="wk-off-label">Không có lớp</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected day detail */}
            {selected.lessons + selected.assignments > 0 && (
                <div className="wk-detail-bar">
          <span className="wk-detail-label">
            <strong>{selected.day} {selected.status === 'today' ? '— Hôm nay' : `Tháng 12 ${selected.date}`}</strong>
          </span>
                    <div className="flex items-center gap-4">
            <span className="flex items-center gap-1" style={{fontSize: 13, color: 'var(--text-600)'}}>
              <span className="wk-dot" style={{background: 'var(--blue)'}}/>
                {selected.lessons} bài học
            </span>
                        <span className="flex items-center gap-1" style={{fontSize: 13, color: 'var(--text-600)'}}>
              <span className="wk-dot" style={{background: 'var(--success)'}}/>
                            {selected.assignments} bài tập
            </span>
                    </div>
                    <button className="wk-detail-action">Xem tài liệu khóa học</button>
                </div>
            )}
        </div>
    );
}