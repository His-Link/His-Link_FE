import { useEffect } from "react";
import { useAuth } from "hooks/useAuth";
import { fetchCurrentUser } from "services/authService";
import { clearTokens, getAccessToken } from "utils/token";

export function AuthInitializer({ children }) {
  const { auth, bootstrap } = useAuth();

  useEffect(() => {
    if (auth.initialized) {
      return;
    }

    async function initializeAuth() {
      const token = getAccessToken();
      if (!token) {
        bootstrap();
        return;
      }

      try {
        const user = await fetchCurrentUser();
        bootstrap(user);
      } catch {
        clearTokens();
        bootstrap();
      }
    }

    initializeAuth();
  }, [auth.initialized, bootstrap]);

  if (!auth.initialized) {
    return <div className="app-loading">세션 정보를 불러오는 중...</div>;
  }

  return children;
}
