import { httpClient } from "services/httpClient";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

export function getGoogleLoginUrl() {
  return `${SERVER_URL}/oauth2/authorization/google`;
}

export async function fetchCurrentUser() {
  return httpClient.get("/auth/me");
}

export async function refreshAccessToken(refreshToken) {
  return httpClient.post("/auth/refresh", undefined, { refreshToken });
}

export async function logout(refreshToken) {
  await httpClient.post("/auth/logout", undefined, { refreshToken });
}
