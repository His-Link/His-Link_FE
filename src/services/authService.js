import { httpClient } from "services/httpClient";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

export function getGoogleLoginUrl() {
  return `${SERVER_URL}/oauth2/authorization/google`;
}

export async function fetchCurrentUser() {
  const response = await httpClient.get("/auth/me");
  return response.data;
}

export async function refreshAccessToken(refreshToken) {
  const response = await httpClient.post("/auth/refresh", { refreshToken });
  return response.data;
}

export async function logout(refreshToken) {
  await httpClient.post("/auth/logout", { refreshToken });
}
