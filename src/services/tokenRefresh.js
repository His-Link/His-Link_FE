import { buildQueryParams, unwrapApiResponse } from "utils/api";
import { getRefreshToken, setTokens } from "utils/token";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

let inflightRefresh = null;

export async function refreshAccessTokenRaw() {
  if (inflightRefresh) {
    return inflightRefresh;
  }

  inflightRefresh = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("NO_REFRESH_TOKEN");
    }

    const query = buildQueryParams({ refreshToken }).toString();
    const response = await fetch(`${API_BASE}/auth/refresh?${query}`, { method: "POST" });
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error(text || "토큰 갱신에 실패했습니다.");
      }
    }

    if (!response.ok) {
      throw new Error(payload?.message || "토큰 갱신에 실패했습니다.");
    }

    const data = unwrapApiResponse(payload);
    setTokens(data.accessToken, data.refreshToken);
    return data;
  })();

  try {
    return await inflightRefresh;
  } finally {
    inflightRefresh = null;
  }
}
