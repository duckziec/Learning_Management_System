import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BlogCard({ post }) {
  const location = useLocation();
  const isAdminBlog = location.pathname.startsWith('/admin/blog');
  const basePath = isAdminBlog
    ? '/admin/blog'
    : location.pathname.startsWith('/instructor')
      ? '/instructor/blog'
      : '/blog';
  const detailParam = isAdminBlog ? post.id : (post.detailParam || post.id);
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={post.image} alt={post.title} />
        <span className="blog-badge">{post.category}</span>
      </div>
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="blog-date">{post.date}</span>
        </div>
        <h3 className="blog-card-title">
          <Link to={`${basePath}/${detailParam}`}>{post.title}</Link>
        </h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-author">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="blog-card-author-avatar"
            referrerPolicy="no-referrer"
          />
          <div className="blog-card-author-info">
            <span className="blog-card-author-name">{post.author}</span>
            <span className="blog-card-author-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span>{post.readTime}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span>
                {post.viewCount || 0}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
