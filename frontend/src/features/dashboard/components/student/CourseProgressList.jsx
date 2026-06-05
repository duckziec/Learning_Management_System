import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/student/CourseProgressList.css';

const PAGE_SIZE = 4;
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';

const STATUS_VI = {
  'Completed': 'Hoàn thành',
  'In Progress': 'Đang học',
};

export default function CourseProgressList({ courses }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [courses]);

  if (!courses || courses.length === 0) return null;

  const totalPages = Math.ceil(courses.length / PAGE_SIZE);
  const currentCourses = courses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="progress-section">
      <div className="section-header">
        <h3 className="section-title">Tiến độ khóa học</h3>
      </div>

      <div className="progress-list">
        {currentCourses.map(course => (
          <div
            key={course.id}
            className="progress-item-card"
            onClick={() => navigate(`/course-hub?id=${course.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={course.image}
              alt={course.title}
              className="course-mini-img"
              onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
            />

            <div className="course-info-row">
              <h4>{course.title}</h4>
              <div className="progress-bar-bg" style={{ height: '6px' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${course.progress}%`,
                    backgroundColor: course.progress === 100 ? '#10b981' : '#2563eb'
                  }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`status-badge ${course.status === 'Completed' ? 'completed' : 'in-progress'}`}>
                {STATUS_VI[course.status] || course.status}
              </span>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                {course.status === 'Completed' ? 'Hoàn thành lúc' : 'Lần cuối cập nhật'}
              </p>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{course.date}</p>
            </div>

            <button
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              onClick={e => e.stopPropagation()}
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        ))}
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
  );
}