import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import blogApi from '../../../../services/blog.api';
import { buildAppErrorState, getAppErrorRoute } from '../../../../utils/appError';
import {
  ALL_BLOG_CATEGORY,
  mapBlogPost,
  mapBlogTagToCategory,
  unwrapApiData,
  unwrapPageContent,
} from '../../../../utils/blogMappers';
import { attachBlogAuthorProfiles } from '../../../../utils/blogAuthorProfiles';
import BlogFilters from '../../components/student/Blog/BlogFilters';
import FeaturedPost from '../../components/student/Blog/FeaturedPost';
import BlogCard from '../../components/student/Blog/BlogCard';
import BlogHubSidebar from '../../components/student/Blog/BlogHubSidebar';
import AnimatedPage from '../../../../components/ui/AnimatedPage';
import LockedFeature from '../../../../components/ui/LockedFeature';
import useAuth from '../../../../hooks/useAuth';

import '../../styles/student/BlogCommon.css';
import '../../styles/student/BlogHub.css';

const RECENT_POSTS_BATCH_SIZE = 6;

const isNumericCategoryId = (value) =>
  value !== null && value !== undefined && value !== '' && !Number.isNaN(Number(value));

export default function BlogHubPage() {
  const { user } = useAuth();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/instructor') ? '/instructor/blog' : '/blog';
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([{ id: null, name: ALL_BLOG_CATEGORY }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blockingError, setBlockingError] = useState(null);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [visibleRecentCount, setVisibleRecentCount] = useState(RECENT_POSTS_BATCH_SIZE);

  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const response = await blogApi.getTags();
        const tagCategories = (unwrapApiData(response) || []).map(mapBlogTagToCategory);
        if (!ignore) {
          setCategories([{ id: null, name: ALL_BLOG_CATEGORY }, ...tagCategories]);
          setActiveCategory((currentCategory) => {
            if (currentCategory == null) return null;

            const categoryStillExists = tagCategories.some(
              (category) => String(category.id) === String(currentCategory),
            );

            return categoryStillExists ? currentCategory : null;
          });
          setRequiresLogin(false);
          setBlockingError(null);
        }
      } catch (err) {
        if (!ignore) {
          setCategories([{ id: null, name: ALL_BLOG_CATEGORY }]);
          setActiveCategory(null);
          if (err.response?.status === 401) {
            setRequiresLogin(true);
            return;
          }

          setBlockingError(buildAppErrorState(err, {
            title: 'Không thể tải danh mục blog',
            fallbackPath: basePath,
          }));
        }
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, [basePath]);

  useEffect(() => {
    let ignore = false;

    setVisibleRecentCount(RECENT_POSTS_BATCH_SIZE);

    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      setRequiresLogin(false);
      setBlockingError(null);

      try {
        const keyword = searchQuery.trim();
        const tagId = isNumericCategoryId(activeCategory) ? Number(activeCategory) : undefined;
        const response = await blogApi.getPublicPosts({
          page: 0,
          size: 20,
          tagId,
          keyword: tagId ? undefined : keyword || undefined,
          sort: 'createdAt,desc',
        });

        if (!ignore) {
          const postsWithAuthors = await attachBlogAuthorProfiles(unwrapPageContent(response), user);
          let mappedPosts = postsWithAuthors.map(mapBlogPost);

          if (activeCategory && !isNumericCategoryId(activeCategory)) {
            mappedPosts = mappedPosts.filter((post) => post.category === activeCategory);
          }

          if (activeCategory && keyword) {
            const normalizedKeyword = keyword.toLowerCase();
            mappedPosts = mappedPosts.filter((post) =>
              post.title.toLowerCase().includes(normalizedKeyword) ||
              post.excerpt.toLowerCase().includes(normalizedKeyword),
            );
          }

          setPosts(mappedPosts);
          setRequiresLogin(false);
          setBlockingError(null);
        }
      } catch (err) {
        if (!ignore) {
          setPosts([]);
          if (err.response?.status === 401) {
            setRequiresLogin(true);
          } else {
            setBlockingError(buildAppErrorState(err, {
              title: 'Không thể tải danh sách bài viết',
              fallbackPath: basePath,
            }));
            setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [activeCategory, basePath, searchQuery, user]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);
  const visibleRecentPosts = otherPosts.slice(0, visibleRecentCount);
  const hasMoreRecentPosts = visibleRecentCount < otherPosts.length;
  const popularPosts = useMemo(
    () => [...posts].sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0)).slice(0, 3),
    [posts],
  );

  const handleLoadMore = () => {
    setVisibleRecentCount((count) => count + RECENT_POSTS_BATCH_SIZE);
  };

  if (blockingError) {
    return <Navigate to={getAppErrorRoute(location.pathname)} replace state={blockingError} />;
  }

  return (
    <AnimatedPage>
      {requiresLogin ? (
        <LockedFeature featureName="Blog">
          <div className="blog-page">
            <div className="blog-empty-state">
              Không thể tải blog. Vui lòng đăng nhập lại hoặc thử lại sau.
            </div>
          </div>
        </LockedFeature>
      ) : (
        <div className="blog-page">
          <BlogFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />

          <div className="blog-main-grid">
            <div className="blog-content-area">
              {!loading && !error && <FeaturedPost post={featuredPost} />}
            </div>

            <BlogHubSidebar popularPosts={popularPosts} />
          </div>

          <div className="blog-recent-section blog-recent-section-full">
            <h3 className="blog-recent-title">
              <span className="material-symbols-outlined">article</span>
              Bài viết gần đây
            </h3>

            {loading ? (
              <div className="blog-empty-state">Đang tải bài viết...</div>
            ) : error ? (
              <div className="blog-empty-state">{error}</div>
            ) : (
              <>
                <div className="blog-grid blog-grid-recent">
                  {visibleRecentPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {hasMoreRecentPosts && (
                  <div className="load-more-container">
                    <button className="load-more-btn" type="button" onClick={handleLoadMore}>
                      <span className="material-symbols-outlined">expand_more</span>
                      Tải thêm bài viết
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="blog-empty-state">
                Không tìm thấy bài viết phù hợp với tiêu chí của bạn.
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
