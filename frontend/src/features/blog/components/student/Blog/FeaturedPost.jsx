import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function FeaturedPost({ post }) {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/instructor') ? '/instructor/blog' : '/blog';
  if (!post) return null;

  return (
    <div className="featured-post-card">
      <div className="featured-post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="featured-post-body">
        <span className="featured-badge">{post.category}</span>
        <h2 className="featured-title">
          <Link to={`${basePath}/${post.detailParam || post.id}`}>{post.title}</Link>
        </h2>
        <p className="featured-excerpt">{post.excerpt}</p>
        <div className="featured-author">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="author-avatar"
            referrerPolicy="no-referrer"
          />
          <div className="author-info">
            <span className="author-name">{post.author}</span>
            <span className="post-date" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                {post.viewCount || 0}
              </span>
            </span>
          </div>
        </div>
        <Link to={`${basePath}/${post.detailParam || post.id}`} className="read-more-btn">Đọc thêm</Link>
      </div>
    </div>
  );
}
