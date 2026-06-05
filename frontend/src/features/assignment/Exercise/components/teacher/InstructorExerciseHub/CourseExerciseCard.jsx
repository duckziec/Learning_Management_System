import { useNavigate } from 'react-router-dom';
import '../../../styles/teacher/InstructorExerciseHub/courseExerciseCard.css';

export default function CourseExerciseCard({ course }) {
  const navigate = useNavigate();
  const courseId = course.id ?? course.courseId;
  const courseTitle = course.title ?? course.name ?? '';

  return (
    <div
      className="course-exercise-card"
      onClick={() => navigate(`/instructor/exercises/${courseId}`, { state: { courseTitle } })}
    >
      <div className="course-image-container">
        <img
          src={course.thumbnailUrl || `https://picsum.photos/seed/course${courseId}/400/200`}
          alt={courseTitle}
          className="course-thumbnail"
        />
        {course.categories?.[0]?.name && (
          <span className="course-category-badge">{course.categories[0].name}</span>
        )}
      </div>
      <div className="course-info">
        <h3>{courseTitle}</h3>
      </div>
      <button className="manage-btn">
        Quản lý bài tập
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}
