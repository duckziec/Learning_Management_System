-- =====================================================
-- COURSE SERVICE DATABASE
-- Database: lms_course_db
-- =====================================================

CREATE DATABASE IF NOT EXISTS course_lms
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE course_lms;

-- -----------------------------------------------------
-- Table: categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(200)    NOT NULL,
    slug        VARCHAR(200)    NULL,
    created_at  DATETIME        NOT NULL,

    CONSTRAINT pk_categories        PRIMARY KEY (id),
    CONSTRAINT uq_categories_name   UNIQUE (name),
    CONSTRAINT uq_categories_slug   UNIQUE (slug)
);

-- -----------------------------------------------------
-- Table: courses
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    id                  VARCHAR(36)     NOT NULL,
    title               VARCHAR(500)    NOT NULL,
    description         TEXT            NULL,
    instructor_id       VARCHAR(36)     NOT NULL,
    duration            INT             NULL,
    level               ENUM(
                                'BEGINNER',
                                'INTERMEDIATE',
                                'ADVANCED'
                            )           NULL,
    thumbnail_url       VARCHAR(1000)   NULL,
    status              ENUM(
                                'PRIVATE',
                                'PUBLIC',
                                'LOCKED'
                            )           NOT NULL DEFAULT 'PRIVATE',
    meeting_url         VARCHAR(500)    NULL,
    google_event_id     VARCHAR(200)    NULL,
    mongo_structure_id  VARCHAR(36)     NOT NULL,
    created_at          DATETIME        NOT NULL,
    updated_at          DATETIME        NOT NULL,

    CONSTRAINT pk_courses                   PRIMARY KEY (id),
    CONSTRAINT uq_courses_mongo_structure   UNIQUE (mongo_structure_id)
    );

-- -----------------------------------------------------
-- Table: course_categories (junction table)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS course_categories (
    course_id       VARCHAR(36) NOT NULL,
    category_id     BIGINT      NOT NULL,

    CONSTRAINT pk_course_categories
            PRIMARY KEY (course_id, category_id),
    CONSTRAINT fk_cc_course
            FOREIGN KEY (course_id) REFERENCES courses (id)
                ON DELETE CASCADE,
    CONSTRAINT fk_cc_category
            FOREIGN KEY (category_id) REFERENCES categories (id)
                ON DELETE CASCADE
    );

-- -----------------------------------------------------
-- Table: enrollments
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    user_id     VARCHAR(36) NOT NULL,
    course_id   VARCHAR(36) NOT NULL,
    status      ENUM(
                    'ACTIVE',
                    'CANCELLED'
                )           NOT NULL DEFAULT 'ACTIVE',
    enrolled_at DATETIME    NOT NULL,
    updated_at DATETIME     NOT NULL,

    CONSTRAINT pk_enrollments               PRIMARY KEY (id),
    CONSTRAINT uq_enrollments_user_course   UNIQUE (user_id, course_id),
    CONSTRAINT fk_enrollments_course
            FOREIGN KEY (course_id) REFERENCES courses (id)
                ON DELETE CASCADE
    );

-- -----------------------------------------------------
-- Table: schedules
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS schedules (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    course_id   VARCHAR(36)     NOT NULL,
    title       VARCHAR(500)    NOT NULL,
    start_time  DATETIME        NOT NULL,
    end_time    DATETIME        NOT NULL,
    note        TEXT            NULL,
    created_at  DATETIME        NOT NULL,

    CONSTRAINT pk_schedules     PRIMARY KEY (id),
    CONSTRAINT fk_sch_course
            FOREIGN KEY (course_id) REFERENCES courses (id)
                ON DELETE CASCADE
    );

-- -----------------------------------------------------
-- Table: announcements
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    course_id   VARCHAR(36)     NOT NULL,
    title       VARCHAR(500)    NOT NULL,
    content     TEXT            NOT NULL,
    created_at  DATETIME        NOT NULL,

    CONSTRAINT pk_announcements PRIMARY KEY (id),
    CONSTRAINT fk_ann_course
            FOREIGN KEY (course_id) REFERENCES courses (id)
                ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table: lesson_progress
-- -----------------------------------------------------
CREATE TABLE lesson_progress (
     id            BIGINT PRIMARY KEY AUTO_INCREMENT,
     student_id    VARCHAR(36)  NOT NULL,
     course_id     VARCHAR(36)  NOT NULL,
     lesson_id     VARCHAR(36)  NOT NULL,
     lesson_type   ENUM (
                        'VIDEO',
                        'DOCUMENT'
                    ) NOT NULL,  -- 'video' hoặc 'document'
     is_completed  BOOLEAN      DEFAULT FALSE,
     last_accessed DATETIME,
     UNIQUE KEY uq_student_lesson (student_id, lesson_id)
);