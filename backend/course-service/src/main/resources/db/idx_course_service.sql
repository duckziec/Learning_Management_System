-- =====================================================
-- COURSE SERVICE INDEXES
-- Database: lms_course_db
-- Chạy sau course-service-db.sql
-- =====================================================

USE course_lms;

-- -----------------------------------------------------
-- Indexes: courses
-- -----------------------------------------------------

-- Tìm khóa học theo giảng viên (màn hình dashboard instructor)
CREATE INDEX idx_courses_instructor_id
    ON courses (instructor_id);

-- Lọc khóa học theo trạng thái (PRIVATE / PUBLIC)
CREATE INDEX idx_courses_status
    ON courses (status);

-- Kết hợp: lọc theo instructor + status
CREATE INDEX idx_courses_instructor_status
    ON courses (instructor_id, status);

-- Tìm kiếm theo tiêu đề (LIKE '%keyword%')
CREATE INDEX idx_courses_title
    ON courses (title);

-- Sắp xếp theo thời gian tạo (danh sách mới nhất)
CREATE INDEX idx_courses_created_at
    ON courses (created_at DESC);

-- -----------------------------------------------------
-- Indexes: enrollments
-- -----------------------------------------------------

-- Lấy tất cả khóa học của một học viên
CREATE INDEX idx_enrollments_user_id
    ON enrollments (user_id);

-- Lấy tất cả học viên của một khóa học
CREATE INDEX idx_enrollments_course_id
    ON enrollments (course_id);

-- Sắp xếp theo thời gian đăng ký
CREATE INDEX idx_enrollments_enrolled_at
    ON enrollments (enrolled_at DESC);

-- Lọc enrollment theo status
CREATE INDEX idx_enrollments_status
    ON enrollments (status);

-- Kết hợp: học viên + status (kiểm tra còn active không)
CREATE INDEX idx_enrollments_user_status
    ON enrollments (user_id, status);

-- -----------------------------------------------------
-- Indexes: schedules
-- -----------------------------------------------------

-- Lấy lịch học của một khóa học
CREATE INDEX idx_schedules_course_id
    ON schedules (course_id);

-- Kết hợp: lịch học của khóa học trong khoảng thời gian
CREATE INDEX idx_schedules_course_time
    ON schedules (course_id, start_time);

-- -----------------------------------------------------
-- Indexes: announcements
-- -----------------------------------------------------

-- Lấy thông báo của một khóa học, sắp xếp mới nhất
CREATE INDEX idx_announcements_course_id
    ON announcements (course_id);

CREATE INDEX idx_announcements_created_at
    ON announcements (created_at DESC);

-- Kết hợp: thông báo của khóa học theo thời gian
CREATE INDEX idx_announcements_course_created
    ON announcements (course_id, created_at DESC);

-- -----------------------------------------------------
-- Indexes: categories
-- -----------------------------------------------------

-- Tìm danh mục theo slug (URL-friendly lookup)
CREATE INDEX idx_categories_slug
    ON categories (slug);

-- -----------------------------------------------------
-- Indexes: course_categories
-- -----------------------------------------------------

-- Lấy tất cả danh mục của một khóa học
CREATE INDEX idx_cc_course_id
    ON course_categories (course_id);

-- Lấy tất cả khóa học trong một danh mục
CREATE INDEX idx_cc_category_id
    ON course_categories (category_id);