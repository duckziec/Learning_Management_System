-- =====================================================
-- BLOG SERVICE INDEXES
-- Database: lms_blog_db
-- Chạy sau blog-service-db.sql
-- =====================================================

USE lms_blog_db;

-- -----------------------------------------------------
-- Indexes: posts
-- -----------------------------------------------------

-- Lấy bài viết theo tác giả
CREATE INDEX idx_posts_author_id
    ON posts (author_id);

-- Lọc bài viết theo trạng thái
CREATE INDEX idx_posts_status
    ON posts (status);

-- Kết hợp: tác giả + status
CREATE INDEX idx_posts_author_status
    ON posts (author_id, status);

-- Sắp xếp theo thời gian tạo (mới nhất)
CREATE INDEX idx_posts_created_at
    ON posts (created_at DESC);

-- Sắp xếp theo lượt xem (phổ biến nhất)
CREATE INDEX idx_posts_view_count
    ON posts (view_count DESC);

-- Tìm kiếm theo tiêu đề
CREATE INDEX idx_posts_title
    ON posts (title);

-- -----------------------------------------------------
-- Indexes: comments
-- -----------------------------------------------------

-- Lấy tất cả comment của một bài viết
CREATE INDEX idx_comments_post_id
    ON comments (post_id);

-- Lấy tất cả reply của một comment
CREATE INDEX idx_comments_parent_id
    ON comments (parent_id);

-- Lấy tất cả comment của một user
CREATE INDEX idx_comments_user_id
    ON comments (user_id);

-- Sắp xếp comment theo thời gian
CREATE INDEX idx_comments_created_at
    ON comments (created_at);

-- -----------------------------------------------------
-- Indexes: votes
-- -----------------------------------------------------

-- Đếm vote theo target
CREATE INDEX idx_votes_target
    ON votes (target_id, target_type);

-- Lọc vote theo loại
CREATE INDEX idx_votes_target_type
    ON votes (target_id, target_type, vote_type);

-- Kiểm tra user đã vote chưa
CREATE INDEX idx_votes_user_target
    ON votes (user_id, target_id, target_type);

-- -----------------------------------------------------
-- Indexes: post_tags
-- -----------------------------------------------------

-- Lấy tất cả tag của một bài viết
CREATE INDEX idx_pt_post_id
    ON post_tags (post_id);

-- Lấy tất cả bài viết của một tag
CREATE INDEX idx_pt_tag_id
    ON post_tags (tag_id);

-- -----------------------------------------------------
-- Indexes: tags
-- -----------------------------------------------------

-- Tìm tag theo slug
CREATE INDEX idx_tags_slug
    ON tags (slug);