import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/student/DashboardSidebar.css';

const PAGE_SIZE = 3;

export default function DashboardSidebar({ events }) {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [events]);

    const totalPages = Math.ceil((events?.length || 0) / PAGE_SIZE);
    const currentEvents = events?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) || [];

    const handleEventClick = (event) => {
        if (event.meetingUrl) {
            window.open(event.meetingUrl, '_blank');
        } else if (event.courseId) {
            navigate(`/course-hub?id=${event.courseId}`);
        }
    };

    return (
        <div className="dashboard-sidebar">
            {/* Achievement card đã ẩn tạm thời */}

            <div className="sidebar-card">
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <h3 className="section-title">
                        <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>calendar_month</span>
                        Lịch học sắp tới
                    </h3>
                </div>

                <div className="event-list">
                    {currentEvents.length > 0 ? (
                        currentEvents.map((event, idx) => (
                            <div key={idx} className="event-item">
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div className="event-date">
                                        <p className="month">{event.month}</p>
                                        <p className="day">{event.day}</p>
                                    </div>
                                    <div className="event-details">
                                        <h5>{event.title}</h5>
                                        <p>{event.time}</p>
                                    </div>
                                </div>

                                {(event.meetingUrl || event.courseId) && (
                                    <button
                                        className="btn-join-event"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>video_call</span>
                                        Tham gia
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                            Không có lịch học sắp tới
                        </p>
                    )}
                </div>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 0}
                            style={{
                                background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px',
                                padding: '4px 12px', cursor: page === 0 ? 'not-allowed' : 'pointer',
                                color: page === 0 ? '#cbd5e1' : '#2563eb', fontSize: '13px'
                            }}
                        >
                            ← Trước
                        </button>

                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {page + 1} / {totalPages}
                        </span>

                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages - 1}
                            style={{
                                background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px',
                                padding: '4px 12px', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                                color: page >= totalPages - 1 ? '#cbd5e1' : '#2563eb', fontSize: '13px'
                            }}
                        >
                            Sau →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}