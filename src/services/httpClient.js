import { refreshAccessTokenRaw } from "services/tokenRefresh";
import { emitSessionExpired } from "utils/authEvents";
import { HttpError } from "utils/httpError";
import { showToast } from "utils/toast";
import { getAccessToken, clearTokens } from "utils/token";
import { buildQueryParams, unwrapApiResponse } from "utils/api";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

function isAuthRefreshPath(path) {
  return path === "/auth/refresh" || path === "/auth/logout";
}

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

function resolveErrorMessage(payload, fallback) {
  return (
    payload?.message ||
    (typeof payload === "string" ? payload : null) ||
    fallback
  );
}

async function request(path, options = {}, isRetry = false) {
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
    const message = resolveErrorMessage(payload, "API request failed");

    if (response.status === 401 && !isRetry && !isAuthRefreshPath(path)) {
      try {
        await refreshAccessTokenRaw();
        return request(path, options, true);
      } catch {
        clearTokens();
        showToast("로그인이 만료되었습니다. 다시 로그인해 주세요.", { variant: "error" });
        emitSessionExpired();
        throw new HttpError("로그인이 만료되었습니다. 다시 로그인해 주세요.", 401);
      }
    }

    if (response.status === 403) {
      showToast(message || "권한이 없습니다.", { variant: "error" });
    }

    throw new HttpError(message, response.status);
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
