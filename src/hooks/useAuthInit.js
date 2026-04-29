import { useEffect } from "react";
import { useAuth } from "hooks/useAuth";

export function AuthInitializer({ children }) {
  const { auth, bootstrap } = useAuth();

  useEffect(() => {
    if (!auth.initialized) {
      bootstrap();
    }
  }, [auth.initialized, bootstrap]);

  if (!auth.initialized) {
    return <div className="app-loading">세션 정보를 불러오는 중...</div>;
  }

  return children;
}
