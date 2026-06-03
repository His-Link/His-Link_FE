import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { SESSION_EXPIRED_EVENT } from "utils/authEvents";

function AuthSessionListener() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handler = () => {
      logout();
      if (window.location.pathname !== "/login" && !window.location.pathname.startsWith("/auth/")) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
  }, [logout, navigate]);

  return null;
}

export default AuthSessionListener;
