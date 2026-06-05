-- =====================================================
-- BLOG SERVICE DATABASE
-- Database: lms_blog_db
-- =====================================================

CREATE DATABASE IF NOT EXISTS lms_blog_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE lms_blog_db;

-- -----------------------------------------------------
-- Table: tags
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
                                    id          BIGINT          NOT NULL AUTO_INCREMENT,
                                    name        VARCHAR(100)    NOT NULL,
    slug        VARCHAR(100)    NOT NULL,
    created_at  DATETIME        NOT NULL,
    updated_at  DATETIME        NOT NULL,

    CONSTRAINT pk_tags          PRIMARY KEY (id),
    CONSTRAINT uq_tags_name     UNIQUE (name),
    CONSTRAINT uq_tags_slug     UNIQUE (slug)
    );

-- -----------------------------------------------------
-- Table: posts
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
                                     id          BIGINT          NOT NULL AUTO_INCREMENT,
                                     title       VARCHAR(500)    NOT NULL,
    slug        VARCHAR(500)    NOT NULL,
    summary     VARCHAR(1000)   NULL,
    content     LONGTEXT        NOT NULL,
    thumbnail   VARCHAR(1000)   NULL,
    author_id   VARCHAR(36)     NOT NULL,
    status      ENUM(
                        'DRAFT',
                        'PUBLISHED',
                        'HIDDEN'
                    )               NOT NULL DEFAULT 'DRAFT',
    view_count  BIGINT          NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL,
    updated_at  DATETIME        NOT NULL,

    CONSTRAINT pk_posts         PRIMARY KEY (id),
    CONSTRAINT uq_posts_slug    UNIQUE (slug)
    );

-- -----------------------------------------------------
-- Table: post_tags (junction table)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS post_tags (
                                         post_id     BIGINT  NOT NULL,
                                         tag_id      BIGINT  NOT NULL,

                                         CONSTRAINT pk_post_tags PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_pt_post
    FOREIGN KEY (post_id)
    REFERENCES posts (id)
    ON DELETE CASCADE,
    CONSTRAINT fk_pt_tag
    FOREIGN KEY (tag_id)
    REFERENCES tags (id)
    ON DELETE CASCADE
    );

-- -----------------------------------------------------
-- Table: comments
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
                                        id          BIGINT      NOT NULL AUTO_INCREMENT,
                                        post_id     BIGINT      NOT NULL,
                                        user_id     VARCHAR(36) NOT NULL,
    parent_id   BIGINT      NULL,
    content     TEXT        NOT NULL,
    created_at  DATETIME    NOT NULL,
    updated_at  DATETIME    NOT NULL,

    CONSTRAINT pk_comments  PRIMARY KEY (id),
    CONSTRAINT fk_cmt_post
    FOREIGN KEY (post_id)
    REFERENCES posts (id)
    ON DELETE CASCADE,
    CONSTRAINT fk_cmt_parent
    FOREIGN KEY (parent_id)
    REFERENCES comments (id)
    ON DELETE CASCADE
    );

-- -----------------------------------------------------
-- Table: votes
-- Polymorphic: target_type = 'POST' | 'COMMENT'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS votes (
                                     id          BIGINT      NOT NULL AUTO_INCREMENT,
                                     user_id     VARCHAR(36) NOT NULL,
    target_id   BIGINT      NOT NULL,
    target_type ENUM(
                        'POST',
                        'COMMENT'
                    )           NOT NULL,
    vote_type   ENUM(
                        'UPVOTE',
                        'DOWNVOTE'
                    )           NOT NULL,
    created_at  DATETIME    NOT NULL,

    CONSTRAINT pk_votes                     PRIMARY KEY (id),
    CONSTRAINT uq_votes_user_target         UNIQUE (user_id, target_id, target_type)
    );