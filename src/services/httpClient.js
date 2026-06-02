import { getAccessToken } from "utils/token";
import { buildQueryParams, unwrapApiResponse } from "utils/api";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

async function parseJson(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || "API request failed");
  }
}

async function request(path, options = {}) {
  const {
    params,
    body,
    method = "GET",
    contentType = "application/json",
    multipart = false
  } = options;
  const query = params ? `?${buildQueryParams(params).toString()}` : "";
  const token = getAccessToken();

  const headers = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let fetchBody = body;
  if (body != null && multipart) {
    fetchBody = body;
  } else if (body != null && contentType === "application/json") {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  } else if (body != null && contentType === "application/x-www-form-urlencoded") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    fetchBody = body;
  }

  const response = await fetch(`${BASE_URL}${path}${query}`, {
    method,
    headers,
    body: fetchBody
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    const message =
      payload?.message ||
      (typeof payload === "string" ? payload : null) ||
      "API request failed";
    throw new Error(message);
  }

  return unwrapApiResponse(payload);
}

export const httpClient = {
  get: (path, params) => request(path, { method: "GET", params }),
  post: (path, body, params) => request(path, { method: "POST", body, params }),
  postForm: (path, formBody) =>
    request(path, {
      method: "POST",
      body: formBody,
      contentType: "application/x-www-form-urlencoded"
    }),
  putForm: (path, formBody) =>
    request(path, {
      method: "PUT",
      body: formBody,
      contentType: "application/x-www-form-urlencoded"
    }),
  postMultipart: (path, formData) =>
    request(path, { method: "POST", body: formData, multipart: true }),
  putMultipart: (path, formData) =>
    request(path, { method: "PUT", body: formData, multipart: true }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" })
};
