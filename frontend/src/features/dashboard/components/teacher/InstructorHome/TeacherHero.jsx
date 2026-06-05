import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faPlus, faMagic } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import instructorDashboardApi from '../../../../../services/instructorDashboard.api';
import '../../../styles/teacher/InstructorHome/TeacherHero.css';

const TeacherHero = ({ teacherName = 'Instructor' }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    instructorDashboardApi
      .getMyStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <motion.section
      className="teacher-hero-premium"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="hero-content-wrapper">
        <div className="hero-text-side">
          <motion.div
            className="premium-badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FontAwesomeIcon icon={faMagic} className="sparkle-icon" />
            <span>Dashboard Giáo viên</span>
          </motion.div>

          <h1 className="hero-main-title">
            Rất vui được gặp lại, <br />
            <span className="gradient-text">{teacherName}!</span>
          </h1>

          <p className="hero-subtext">
            {stats ? (
              <>
                Bạn đang có{' '}
                <strong>{stats.totalCourses} khóa học</strong> với tổng{' '}
                <strong>{stats.totalStudents.toLocaleString()} học sinh</strong> đang theo học.
              </>
            ) : (
              'Chào mừng trở lại! Hãy kiểm tra tiến độ các khóa học của bạn.'
            )}
          </p>

          <div className="hero-cta-group">
            <Link to="/manage/courses/create" className="btn-primary-gradient">
              <FontAwesomeIcon icon={faPlus} />
              Tạo khóa học mới
            </Link>
            <Link to="/manage/courses" className="btn-glass-secondary">
              <FontAwesomeIcon icon={faChartPie} />
              Quản lý khóa học
            </Link>
          </div>
        </div>

        <div className="hero-visual-side">
          <div className="visual-abstract-elements">
            <motion.div
              className="floating-card info-card-1"
              animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="icon-box-blue">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              <div className="card-data">
                <span className="label">Bài tập</span>
                <span className="value">{stats ? `+${stats.totalExercises}` : '...'}</span>
              </div>
            </motion.div>

            <motion.div
              className="floating-card info-card-2"
              animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="avatar-stack">
                <img src="https://i.pravatar.cc/32?img=1" alt="Student" />
                <img src="https://i.pravatar.cc/32?img=2" alt="Student" />
                <img src="https://i.pravatar.cc/32?img=3" alt="Student" />
              </div>
              <span className="avatar-text">
                {stats ? `${stats.totalStudents.toLocaleString()} students` : '...'}
              </span>
            </motion.div>

            <div className="main-sphere">
              <div className="sphere-inner"></div>
              <svg viewBox="0 0 200 200" className="rotating-svg">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#grad1)"
                  strokeWidth="0.5"
                  fill="none"
                  strokeDasharray="10 5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TeacherHero;
