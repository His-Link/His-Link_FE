import { httpClient } from "services/httpClient";
import { appendLabProjectFields } from "utils/labFormData";

export async function fetchProjects({ sort = "LATEST", keyword, techStack, page = 0, size = 12 } = {}) {
  return httpClient.get("/lab/projects", { sort, keyword, techStack, page, size });
}

export async function fetchProject(projectId, { countView = true } = {}) {
  return httpClient.get(`/lab/projects/${projectId}`, { countView });
}

export async function createProject({ fields, techStackIds, newFiles }) {
  const formData = new FormData();
  appendLabProjectFields(formData, fields, { techStackIds, newFiles });
  return httpClient.postMultipart("/lab/projects", formData);
}

export async function updateProject(projectId, { fields, techStackIds, deleteImageIds, newFiles }) {
  const formData = new FormData();
  appendLabProjectFields(formData, fields, { techStackIds, deleteImageIds, newFiles });
  return httpClient.putMultipart(`/lab/projects/${projectId}`, formData);
}

export async function deleteProject(projectId) {
  return httpClient.delete(`/lab/projects/${projectId}`);
}

export async function toggleProjectLike(projectId) {
  return httpClient.post(`/lab/projects/${projectId}/like`);
}

export async function fetchFeedbacks(projectId) {
  return httpClient.get(`/lab/projects/${projectId}/feedbacks`);
}

export async function createFeedback(projectId, payload) {
  return httpClient.post(`/lab/projects/${projectId}/feedbacks`, payload);
}

export async function updateFeedback(feedbackId, payload) {
  return httpClient.put(`/lab/feedbacks/${feedbackId}`, payload);
}

export async function deleteFeedback(feedbackId) {
  return httpClient.delete(`/lab/feedbacks/${feedbackId}`);
}
