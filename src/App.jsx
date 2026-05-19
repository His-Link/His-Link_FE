import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "pages/HomePage";
import LoginPage from "pages/LoginPage";
import AuthCallbackPage from "pages/AuthCallbackPage";
import MainLayout from "layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
