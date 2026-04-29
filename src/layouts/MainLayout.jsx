import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          HIS-Link
        </Link>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
