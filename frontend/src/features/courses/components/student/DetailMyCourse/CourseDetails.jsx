import '../../../styles/student/DetailMyCourse/CourseDetails.css';

const CourseDetails = ({ course }) => {
  if (!course) return null;

  const {
    title,
    chapterTitle,
    chapterSubtitle,
    instructor,
    courseProgress,
    video,
    resources,
    overview,
  } = course;

  return (
    <div className="course-details">
      <div className="course-details__container">
        <div className="course-details__header">
          <div>
            <h1 className="course-details__title">{title}</h1>
            <p className="course-details__subtitle">{chapterTitle} • {chapterSubtitle}</p>
          </div>
          <div className="course-details__summary">
            <div>
              <span className="course-details__summary-label">Instructor</span>
              <strong>{instructor}</strong>
            </div>
            <div>
              <span className="course-details__summary-label">Progress</span>
              <strong>{courseProgress}%</strong>
            </div>
            <div>
              <span className="course-details__summary-label">Next up</span>
              <strong>{video.nextUp}</strong>
            </div>
          </div>
        </div>

        <div className="course-details__content">
          <div className="course-details__section">
            <div className="course-details__section-header">
              <h3 className="course-details__section-title">Course Resources</h3>
              <span className="course-details__section-subtitle">{resources.length} Files Available</span>
            </div>

            <div className="course-details__resources-grid">
              {resources.map((resource) => (
                <div key={resource.id} className="course-details__resource-card">
                  <div className={`course-details__resource-icon course-details__resource-icon--${resource.type}`}>
                    <span className="material-symbols-outlined">
                      {resource.type === 'pdf' ? 'picture_as_pdf' : resource.type === 'zip' ? 'folder_zip' : resource.type === 'link' ? 'link' : 'description'}
                    </span>
                  </div>
                  <div className="course-details__resource-content">
                    <p className="course-details__resource-title">{resource.title}</p>
                    <p className="course-details__resource-meta">{resource.meta}</p>
                  </div>
                  <button className="course-details__resource-button" type="button">
                    <span className="material-symbols-outlined course-details__resource-button-icon">download</span>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="course-details__section course-details__section--about">
            <h3 className="course-details__section-title">About this Lesson</h3>
            <p className="course-details__lesson-description">{overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;