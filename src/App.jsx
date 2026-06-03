import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "pages/HomePage";
import CommunityPage from "pages/CommunityPage";
import CommunityPostCreatePage from "pages/CommunityPostCreatePage";
import CommunityPostDetailPage from "pages/CommunityPostDetailPage";
import CommunityPostEditPage from "pages/CommunityPostEditPage";
import LabPage from "pages/LabPage";
import LabProjectCreatePage from "pages/LabProjectCreatePage";
import LabProjectEditPage from "pages/LabProjectEditPage";
import LabProjectDetailPage from "pages/LabProjectDetailPage";
import RecruitmentPage from "pages/RecruitmentPage";
import RecruitmentPostCreatePage from "pages/RecruitmentPostCreatePage";
import RecruitmentPostDetailPage from "pages/RecruitmentPostDetailPage";
import RecruitmentPostEditPage from "pages/RecruitmentPostEditPage";
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
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/new" element={<CommunityPostCreatePage />} />
        <Route path="/community/:postId/edit" element={<CommunityPostEditPage />} />
        <Route path="/community/:postId" element={<CommunityPostDetailPage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/lab/new" element={<LabProjectCreatePage />} />
        <Route path="/lab/:projectId/edit" element={<LabProjectEditPage />} />
        <Route path="/lab/:projectId" element={<LabProjectDetailPage />} />
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/recruitment/new" element={<RecruitmentPostCreatePage />} />
        <Route path="/recruitment/:postId/edit" element={<RecruitmentPostEditPage />} />
        <Route path="/recruitment/:postId" element={<RecruitmentPostDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
