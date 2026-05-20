import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { logout as logoutApi } from "services/authService";
import "styles/MainLayout.css";

const NAV_ITEMS = [
  { to: "/", label: "홈", end: true },
  { to: "/community", label: "커뮤니티", end: false },
  { to: "/lab", label: "User Testing Lab", end: false },
  { to: "/recruitment", label: "팀 모집", end: false },
];

function MainLayout() {
  const navigate = useNavigate();
  const { auth, logout, getStoredRefreshToken } = useAuth();

  const handleLogout = async () => {
    const refreshToken = getStoredRefreshToken();
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // ignore API errors on logout
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          HIS-Link
        </Link>

        <nav className="app-nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `app-nav__link${isActive ? " app-nav__link--active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="app-header-actions">
          {auth.isAuthenticated && auth.user ? (
            <>
              <span className="app-header-user">{auth.user.name}</span>
              <button type="button" className="header-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className="header-btn header-btn--solid">
              로그인
            </Link>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
