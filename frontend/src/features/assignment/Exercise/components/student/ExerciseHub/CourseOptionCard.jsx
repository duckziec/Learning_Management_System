import React from 'react';
import '../../../styles/student/ExerciseHub/CourseOptionCard.css';

const getCourseId = (course) => course?.id || course?.courseId;

const CourseOptionCard = ({ course, type, onSelect }) => {
  const courseId = getCourseId(course);
  const title = course?.title || course?.name || `Course ${courseId}`;
  const description = course?.description || 'Open this course to view available exercises.';
  const categories = Array.isArray(course?.categories)
    ? course.categories.map(category => category.name || category.title).filter(Boolean)
    : [];
  const label = categories[0] || course?.category || 'Enrolled';
  const imageSeed = encodeURIComponent(courseId || title);
  const image = course?.thumbnailUrl || `https://picsum.photos/seed/course${imageSeed}/400/200`;
  const actionText = type === 'quiz' ? 'View quizzes' : 'View challenges';

  return (
    <button type="button" className="course-option-card" onClick={() => onSelect(course)}>
      <div className="course-option-card__image">
        <img src={image} alt={title} />
      </div>
      <div className="course-option-card__content">
        <span className="topic-badge status-published">{label}</span>
        <h3 className="topic-title">{title}</h3>
        <p className="topic-desc">{description}</p>
        <span className="course-option-card__action">
          {actionText}
          <span className="material-symbols-outlined">chevron_right</span>
        </span>
      </div>
    </button>
  );
};

export default CourseOptionCard;
