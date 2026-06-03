import { httpClient } from "services/httpClient";
import { toFormBody } from "utils/api";

export async function fetchPosts({ category, page = 0, size = 20, sort = "createdAt,desc" } = {}) {
  return httpClient.get("/community/posts", { category, page, size, sort });
}

export async function fetchPopularPosts(size = 5) {
  return httpClient.get("/community/posts", { page: 0, size, sort: "likeCount,desc" });
}

export async function fetchPost(postId) {
  return httpClient.get(`/community/posts/${postId}`);
}

export async function createPost({ category, title, content }) {
  return httpClient.postForm("/community/posts", toFormBody({ category, title, content }));
}

export async function updatePost(postId, { category, title, content }) {
  return httpClient.putForm(`/community/posts/${postId}`, toFormBody({ category, title, content }));
}

export async function deletePost(postId) {
  return httpClient.delete(`/community/posts/${postId}`);
}

export async function togglePostLike(postId) {
  return httpClient.post(`/community/posts/${postId}/like`);
}

export async function fetchComments(postId) {
  return httpClient.get(`/community/posts/${postId}/comments`);
}

export async function fetchLatestComments(size = 5) {
  return httpClient.get("/community/comments/latest", { size });
}

export async function createComment(postId, content) {
  return httpClient.postForm(`/community/posts/${postId}/comments`, toFormBody({ content }));
}

export async function updateComment(commentId, content) {
  return httpClient.putForm(`/community/comments/${commentId}`, toFormBody({ content }));
}

export async function deleteComment(commentId) {
  return httpClient.delete(`/community/comments/${commentId}`);
}
