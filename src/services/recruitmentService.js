import { httpClient } from "services/httpClient";
import { appendRecruitmentPostFields } from "utils/recruitmentFormData";
import { toFormBody } from "utils/api";

export async function fetchRecruitmentPosts({
  activityType,
  role,
  status,
  techStack,
  page = 0,
  size = 12,
  sort = "createdAt,desc",
} = {}) {
  return httpClient.get("/recruitment/posts", {
    activityType,
    role,
    status,
    techStack,
    page,
    size,
    sort,
  });
}

export async function fetchRecruitmentPost(postId) {
  return httpClient.get(`/recruitment/posts/${postId}`);
}

export async function createRecruitmentPost({ fields, techStackIds, newFiles }) {
  const formData = new FormData();
  appendRecruitmentPostFields(formData, fields, { techStackIds, newFiles });
  return httpClient.postMultipart("/recruitment/posts", formData);
}

export async function updateRecruitmentPost(postId, { fields, techStackIds, deleteImageIds, newFiles }) {
  const formData = new FormData();
  appendRecruitmentPostFields(formData, fields, { techStackIds, deleteImageIds, newFiles });
  return httpClient.putMultipart(`/recruitment/posts/${postId}`, formData);
}

export async function deleteRecruitmentPost(postId) {
  return httpClient.delete(`/recruitment/posts/${postId}`);
}

export async function fetchRecruitmentComments(postId) {
  return httpClient.get(`/recruitment/posts/${postId}/comments`);
}

export async function createRecruitmentComment(postId, content, application = false) {
  return httpClient.postForm(
    `/recruitment/posts/${postId}/comments`,
    toFormBody({ content, application })
  );
}

export async function updateRecruitmentComment(commentId, content) {
  return httpClient.putForm(`/recruitment/comments/${commentId}`, toFormBody({ content }));
}

export async function deleteRecruitmentComment(commentId) {
  return httpClient.delete(`/recruitment/comments/${commentId}`);
}
