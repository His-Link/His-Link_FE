import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "components/auth/RequireAuth";
import LabProjectForm from "components/lab/LabProjectForm";
import { createProject } from "services/labService";
import "styles/LabPage.css";

function LabProjectCreateForm() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const project = await createProject(payload);
    navigate(`/lab/${project.id}`, { replace: true });
  };

  return (
    <div className="lab-page lab-page--narrow">
      <header className="lab-page__header">
        <div>
          <Link to="/lab" className="lab-back-link">
            ← Lab 목록
          </Link>
          <h1 className="lab-page__title">프로젝트 등록</h1>
          <p className="lab-page__lead">
            스크린샷·UI 캡처 등을 여러 장 업로드하면 테스터가 순서대로 확인할 수 있습니다.
          </p>
        </div>
      </header>

      <LabProjectForm
        submitLabel="등록하기"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/lab")}
      />
    </div>
  );
}

function LabProjectCreatePage() {
  return (
    <RequireAuth>
      <LabProjectCreateForm />
    </RequireAuth>
  );
}

export default LabProjectCreatePage;
