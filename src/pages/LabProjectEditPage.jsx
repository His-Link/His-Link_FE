import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RequireAuth from "components/auth/RequireAuth";
import LabProjectForm from "components/lab/LabProjectForm";
import { useAuthValue } from "hooks/useAuth";
import { fetchProject, updateProject } from "services/labService";
import "styles/LabPage.css";

function LabProjectEditForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthValue();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchProject(projectId, { countView: false });
        if (!cancelled) {
          if (user && data.author?.id !== user.id && user.role !== "ADMIN") {
            setError("프로젝트를 수정할 권한이 없습니다.");
          } else {
            setProject(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "프로젝트를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId, user]);

  const handleSubmit = async (payload) => {
    const updated = await updateProject(projectId, payload);
    navigate(`/lab/${updated.id}`, { replace: true });
  };

  if (loading) {
    return <p className="lab-muted">불러오는 중...</p>;
  }

  if (error || !project) {
    return (
      <div className="lab-page">
        <p className="lab-form-error" role="alert">
          {error || "프로젝트를 찾을 수 없습니다."}
        </p>
        <Link to="/lab" className="lab-back-link">
          ← Lab 목록
        </Link>
      </div>
    );
  }

  return (
    <div className="lab-page lab-page--narrow">
      <header className="lab-page__header">
        <div>
          <Link to={`/lab/${projectId}`} className="lab-back-link">
            ← 프로젝트 상세
          </Link>
          <h1 className="lab-page__title">프로젝트 수정</h1>
          <p className="lab-page__lead">텍스트·기술 스택·이미지를 변경할 수 있습니다.</p>
        </div>
      </header>

      <LabProjectForm
        submitLabel="저장하기"
        initialProject={project}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/lab/${projectId}`)}
      />
    </div>
  );
}

function LabProjectEditPage() {
  return (
    <RequireAuth>
      <LabProjectEditForm />
    </RequireAuth>
  );
}

export default LabProjectEditPage;
