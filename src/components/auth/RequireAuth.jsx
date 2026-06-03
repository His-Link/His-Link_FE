import { Navigate, useLocation } from "react-router-dom";
import { useAuthValue } from "hooks/useAuth";

function RequireAuth({ children }) {
  const { isAuthenticated, initialized } = useAuthValue();
  const location = useLocation();

  if (!initialized) {
    return <p className="lab-muted">로그인 상태 확인 중...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default RequireAuth;
