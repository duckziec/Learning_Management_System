import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import blogApi from '../../../../../services/blog.api';
import {
  mapBlogPost,
  mapBlogTagToCategory,
  unwrapApiData,
  unwrapPageContent,
} from '../../../../../utils/blogMappers';

const STATUS_LABELS = {
  PUBLISHED: 'Đang hiển thị',
  HIDDEN: 'Đã ẩn',
  DRAFT: 'Bản nháp',
};

const buildPostUpdateFormData = (post, status) => {
  const formData = new FormData();
  formData.append('title', post.title || '');
  formData.append('summary', post.summary || '');
  formData.append('content', post.content || '');
  formData.append('status', status);

  if (post.tags?.length) {
    post.tags.forEach(tag => formData.append('tagIds', tag.id));
  } else {
    formData.append('clearTags', 'true');
  }

  return formData;
};

const BlogMgmt = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchBlogData = async () => {
      setLoading(true);
      setError('');

      try {
        const [postsResponse, tagsResponse] = await Promise.all([
          blogApi.getAdminPosts({ page: 0, size: 100, sort: 'createdAt,desc' }),
          blogApi.getTags(),
        ]);

        if (ignore) return;

        setPosts(unwrapPageContent(postsResponse).map(mapBlogPost));
        setCategories((unwrapApiData(tagsResponse) || []).map(mapBlogTagToCategory));
      } catch (_err) {
        if (ignore) return;

        setPosts([]);
        setCategories([]);
        setError('Không thể tải dữ liệu blog từ server.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBlogData();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return posts.filter(post => {
      const matchesSearch = !normalizedSearch ||
        post.title?.toLowerCase().includes(normalizedSearch) ||
        post.author?.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === 'All' || post.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [posts, searchQuery, statusFilter, categoryFilter]);

  const stats = {
    total: posts.length,
    published: posts.filter(post => post.status === 'PUBLISHED').length,
    hidden: posts.filter(post => post.status === 'HIDDEN').length,
    draft: posts.filter(post => post.status === 'DRAFT').length,
  };

  const getStatusCardStyle = (targetStatus) => ({
    cursor: 'pointer',
    border: statusFilter === targetStatus ? '1px solid var(--admin-accent)' : undefined,
    boxShadow: statusFilter === targetStatus ? '0 0 0 3px rgba(99, 102, 241, 0.14)' : undefined,
  });

  const handleStatusCardKeyDown = (event, targetStatus) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setStatusFilter(targetStatus);
    }
  };

  const toggleStatus = async (post) => {
    const nextStatus = post.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';

    try {
      const detailResponse = await blogApi.getPost(post.id);
      const detailPost = unwrapApiData(detailResponse);
      const updateResponse = await blogApi.updatePost(post.id, buildPostUpdateFormData(detailPost, nextStatus));
      const updatedPost = mapBlogPost(unwrapApiData(updateResponse));

      setPosts(currentPosts =>
        currentPosts.map(item => item.id === post.id ? updatedPost : item),
      );
      setError('');
    } catch (_err) {
      setError('Không thể cập nhật trạng thái bài viết. Vui lòng thử lại.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-stats-grid">
        <div
          className="admin-stat-card"
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('All')}
          onKeyDown={(event) => handleStatusCardKeyDown(event, 'All')}
          style={getStatusCardStyle('All')}
        >
          <div className="admin-stat-label">Tổng bài viết</div>
          <div className="admin-stat-val" style={{ color: 'var(--admin-accent)' }}>{stats.total}</div>
          <div className="admin-stat-sub">Trong toàn hệ thống</div>
        </div>
        <div
          className="admin-stat-card"
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('PUBLISHED')}
          onKeyDown={(event) => handleStatusCardKeyDown(event, 'PUBLISHED')}
          style={getStatusCardStyle('PUBLISHED')}
        >
          <div className="admin-stat-label">Đang hiển thị</div>
          <div className="admin-stat-val" style={{ color: 'var(--admin-green)' }}>{stats.published}</div>
          <div className="admin-stat-sub">Công khai trên blog</div>
        </div>
        <div
          className="admin-stat-card"
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('HIDDEN')}
          onKeyDown={(event) => handleStatusCardKeyDown(event, 'HIDDEN')}
          style={getStatusCardStyle('HIDDEN')}
        >
          <div className="admin-stat-label">Đã bị ẩn</div>
          <div className="admin-stat-val" style={{ color: 'var(--admin-red)' }}>{stats.hidden}</div>
          <div className="admin-stat-sub neg">Không hiển thị công khai</div>
        </div>
        <div
          className="admin-stat-card"
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('DRAFT')}
          onKeyDown={(event) => handleStatusCardKeyDown(event, 'DRAFT')}
          style={getStatusCardStyle('DRAFT')}
        >
          <div className="admin-stat-label">Bản nháp</div>
          <div className="admin-stat-val" style={{ color: 'var(--admin-purple)' }}>{stats.draft}</div>
          <div className="admin-stat-sub">Chưa xuất bản</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-hd" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ti ti-message-circle"></i>
            Quản lý Diễn đàn & Blog
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="admin-search-wrapper" style={{ position: 'relative' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-muted)' }}></i>
              <input
                type="text"
                placeholder="Tìm tiêu đề, tác giả..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                style={{
                  padding: '6px 12px 6px 32px',
                  borderRadius: '6px',
                  border: '1px solid var(--admin-card-hover)',
                  background: 'var(--admin-bg)',
                  color: 'var(--admin-text)',
                  fontSize: '0.85rem',
                  width: '220px',
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--admin-card-hover)',
                background: 'var(--admin-bg)',
                color: 'var(--admin-text)',
                fontSize: '0.85rem',
              }}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đang hiển thị</option>
              <option value="HIDDEN">Đã ẩn</option>
              <option value="DRAFT">Bản nháp</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--admin-card-hover)',
                background: 'var(--admin-bg)',
                color: 'var(--admin-text)',
                fontSize: '0.85rem',
              }}
            >
              <option value="All">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', color: 'var(--admin-red)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bài viết</th>
                <th>Tác giả</th>
                <th>Ngày đăng</th>
                <th>Danh mục</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                    Đang tải dữ liệu blog...
                  </td>
                </tr>
              ) : filteredPosts.length > 0 ? filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={post.image} alt="" style={{ width: '40px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div style={{ fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title}
                      </div>
                    </div>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.date}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>{post.category}</span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--admin-muted)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>visibility</span>
                      {post.viewCount || 0}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      background: post.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: post.status === 'PUBLISHED' ? '#10b981' : 'var(--admin-red)',
                      fontWeight: 600,
                    }}>
                      {STATUS_LABELS[post.status] || post.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => toggleStatus(post)}
                        className="admin-btn"
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          background: post.status === 'PUBLISHED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: post.status === 'PUBLISHED' ? 'var(--admin-red)' : '#10b981',
                          border: post.status === 'PUBLISHED' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        <i className={post.status === 'PUBLISHED' ? 'ti ti-eye-off' : 'ti ti-eye'}></i>
                        {post.status === 'PUBLISHED' ? ' Ẩn' : ' Hiện'}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                    Không tìm thấy bài viết nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogMgmt;
