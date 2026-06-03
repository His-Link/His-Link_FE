import { httpClient } from "services/httpClient";
import { refreshAccessTokenRaw } from "services/tokenRefresh";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

export function getGoogleLoginUrl() {
  return `${SERVER_URL}/oauth2/authorization/google`;
}

export async function fetchCurrentUser() {
  return httpClient.get("/auth/me");
}

/** httpClient 401 재시도와 동일한 갱신 로직 (수동 호출용) */
export async function refreshAccessToken() {
  return refreshAccessTokenRaw();
}

export async function logout(refreshToken) {
  await httpClient.post("/auth/logout", undefined, { refreshToken });
}
