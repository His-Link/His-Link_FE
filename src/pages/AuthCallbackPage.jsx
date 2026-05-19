import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { fetchCurrentUser } from "services/authService";
import { setTokens } from "utils/token";
import "styles/LoginPage.css";

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      setError("로그인 정보를 받지 못했습니다. 다시 시도해 주세요.");
      return;
    }

    async function completeLogin() {
      try {
        setTokens(accessToken, refreshToken);
        const user = await fetchCurrentUser();
        login(accessToken, refreshToken, user);
        navigate("/", { replace: true });
      } catch {
        setError("사용자 정보를 불러오지 못했습니다. 다시 로그인해 주세요.");
      }
    }

    completeLogin();
  }, [login, navigate, searchParams]);

  if (error) {
    return (
      <div className="login-page">
        <div className="auth-callback-card">
          <h1>로그인 실패</h1>
          <p>{error}</p>
          <Link to="/login" className="auth-callback-link">
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="auth-callback-card">
        <p>로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default AuthCallbackPage;
