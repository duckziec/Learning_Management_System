import {useLocation, useNavigate} from 'react-router-dom';

export default function BlogHubSidebar({popularPosts}) {
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = location.pathname.startsWith('/instructor') ? '/instructor/blog' : '/blog';

    return (
        <div className="blog-hub-sidebar">
            {/* Create New Post CTA */}
            <button
                className="create-post-btn"
                onClick={() => navigate(`${basePath}/create`)}
            >
                <span className="material-symbols-outlined">add</span>
                Tạo bài viết mới
            </button>

            <button
                className="manage-posts-btn"
                onClick={() => navigate(`${basePath}/my-posts`)}
            >
                <span className="material-symbols-outlined">dashboard_customize</span>
                Quản lý bài viết
            </button>

            {/* Popular Posts */}
            <div className="blog-sidebar-card">
                <h4 className="sidebar-title">Bài viết phổ biến</h4>
                <div className="popular-posts-list">
                    {popularPosts.map((post) => (
                        <div key={post.id} className="popular-post-item">
                            <img src={post.image} alt={post.title} className="popular-thumb"/>
                            <div className="popular-info">
                                <span className="popular-cat">{post.category}</span>
                                <h5 className="popular-title">{post.title}</h5>
                                <div className="popular-author" style={{ justifyContent: 'space-between', width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                                        <img
                                            src={post.authorAvatar}
                                            alt={post.author}
                                            className="popular-author-avatar"
                                            referrerPolicy="no-referrer"
                                        />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.author}</span>
                                    </div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#94a3b8' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span>
                                        {post.viewCount || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
