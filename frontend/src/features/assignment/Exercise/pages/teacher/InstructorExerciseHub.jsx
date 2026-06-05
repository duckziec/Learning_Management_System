import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AnimatedPage from '../../../../../components/ui/AnimatedPage';
import courseApi from '../../../../../services/course.api';
import { buildAppErrorState, getAppErrorRoute } from '../../../../../utils/appError';
import CourseExerciseCard from '../../components/teacher/InstructorExerciseHub/CourseExerciseCard';
import Pagination from '../../../../courses/components/student/ListCourse/Pagination';
import '../../styles/teacher/InstructorExerciseHub/instructorExerciseHub.css';

export default function InstructorExerciseHub() {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    courseApi.getMyCourses()
      .then(data => {
        const list = data?.content ?? data ?? [];
        setCourses(list);
      })
      .catch(err => {
        console.error('Failed to fetch courses:', err);
        setError(buildAppErrorState(err, {
          title: 'Không thể tải danh sách khóa học',
          fallbackPath: '/instructor/home',
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [courses]);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error) {
    return <Navigate to={getAppErrorRoute(location.pathname)} replace state={error} />;
  }

  return (
    <AnimatedPage>
      <div className="instructor-exercise-hub">
        <header className="exercise-hub-header">
          <h1 className="exercise-hub-title">Quản lý bài tập</h1>
          <p className="exercise-hub-subtitle">Chọn một khóa học để quản lý các bài quiz và coding challenges của khóa học.</p>
        </header>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0' }}>
            <div className="loading-screen__spinner" />
            <p style={{ color: 'var(--text-600)', marginTop: 16 }}>Đang tải khóa học...</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="empty-container" style={{ textAlign: 'center', padding: '64px 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--text-400)' }}>folder_open</span>
            <p style={{ color: 'var(--text-600)', marginTop: 12 }}>Bạn chưa có khóa học nào.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="course-grid">
            {paginatedCourses.map(course => (
              <CourseExerciseCard key={course.id ?? course.courseId} course={course} />
            ))}
          </div>
        )}
        {!loading && !error && courses.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </AnimatedPage>
  );
}
