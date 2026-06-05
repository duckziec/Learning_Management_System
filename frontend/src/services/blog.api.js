import apiClient from './api.client';
import { ENDPOINTS } from '../constants/endpoints';

// =============================================
// Blog Service API
// =============================================

export const blogApi = {
  getPublicPosts: (params) => apiClient.get(ENDPOINTS.BLOG.PUBLIC_POSTS, {
    params,
    skipAuth: true,
    skipAuthRefresh: true,
  }),
  getPublicPost: (slug) => apiClient.get(ENDPOINTS.BLOG.PUBLIC_DETAIL(slug), {
    skipAuth: true,
    skipAuthRefresh: true,
  }),
  getPosts: (params) => apiClient.get(ENDPOINTS.BLOG.POSTS, { params }),
  getAdminPosts: (params) => apiClient.get(ENDPOINTS.BLOG.ADMIN_POSTS, { params }),
  getMyPosts: (params) => apiClient.get(ENDPOINTS.BLOG.MY_POSTS, { params }),
  getPost: (id) => apiClient.get(ENDPOINTS.BLOG.DETAIL(id)),
  createPost: (data) => apiClient.post(ENDPOINTS.BLOG.POSTS, data),
  updatePost: (id, data) => apiClient.put(ENDPOINTS.BLOG.DETAIL(id), data),
  deletePost: (id) => apiClient.delete(ENDPOINTS.BLOG.DETAIL(id)),

  // Tags / categories
  getTags: () => apiClient.get(ENDPOINTS.BLOG.TAGS, {
    skipAuth: true,
    skipAuthRefresh: true,
  }),

  // Comments
  getComments: (postId, params) => apiClient.get(ENDPOINTS.BLOG.COMMENTS(postId), {
    params,
    skipAuth: true,
    skipAuthRefresh: true,
  }),
  addComment: (postId, data) => apiClient.post(ENDPOINTS.BLOG.COMMENTS(postId), data),

  // Voting
  vote: (postId, voteType) => apiClient.post(ENDPOINTS.BLOG.VOTE(postId), { voteType }), // voteType: 'UPVOTE' | 'DOWNVOTE'
};

export default blogApi;
