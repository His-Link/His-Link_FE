import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FeedbackForm from "components/lab/FeedbackForm";
import FeedbackList from "components/lab/FeedbackList";
import FeedbackSummary from "components/lab/FeedbackSummary";
import ImageCarousel from "components/lab/ImageCarousel";
import LabUtGuide from "components/lab/LabUtGuide";
import { useAuthValue } from "hooks/useAuth";
import {
  createFeedback,
  deleteFeedback,
  deleteProject,
  fetchFeedbacks,
  fetchProject,
  toggleProjectLike,
  updateFeedback
} from "services/labService";
import { formatDate, formatScore } from "utils/format";
import "styles/LabPage.css";
import "styles/LabProjectDetail.css";

function LabProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthValue();

  const [project, setProject] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [likeBusy, setLikeBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, feedbackData] = await Promise.all([
        fetchProject(projectId),
        fetchFeedbacks(projectId)
      ]);
      setProject(projectData);
      setFeedbacks(feedbackData);
    } catch (err) {
      setError(err.message || "프로젝트를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const myFeedback = useMemo(
    () => feedbacks.find((item) => item.author?.id === user?.id),
    [feedbacks, user?.id]
  );

  const isOwner = project && user && project.author?.id === user.id;

  const handleCreateFeedback = async (payload) => {
    await createFeedback(projectId, payload);
    setShowFeedbackForm(false);
    await load();
  };

  const handleUpdateFeedback = async (payload) => {
    await updateFeedback(editingFeedback.id, payload);
    setEditingFeedback(null);
    await load();
  };

  const handleDeleteFeedback = async () => {
    if (!myFeedback || !window.confirm("피드백을 삭제할까요?")) return;
    await deleteFeedback(myFeedback.id);
    await load();
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("프로젝트와 모든 피드백을 삭제할까요?")) return;
    await deleteProject(projectId);
    navigate("/lab", { replace: true });
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const result = await toggleProjectLike(projectId);
      setProject((prev) =>
        prev
          ? {
              ...prev,
              likeCount: result.likeCount,
              likedByMe: result.liked
            }
          : prev
      );
    } catch (err) {
      window.alert(err.message || "좋아요 처리에 실패했습니다.");
    } finally {
      setLikeBusy(false);
    }
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
    <div className="lab-detail">
      <Link to="/lab" className="lab-back-link">
        ← Lab 목록
      </Link>

      <div className="lab-detail__layout">
        <article className="lab-detail__main">
          {project.images?.length > 0 ? (
            <ImageCarousel images={project.images} altPrefix={project.title} />
          ) : null}

          <header className="lab-detail__header">
            <div className="lab-detail__title-row">
              <h1>{project.title}</h1>
              <button
                type="button"
                className={`lab-like-btn${project.likedByMe ? " lab-like-btn--on" : ""}`}
                onClick={handleToggleLike}
                disabled={likeBusy}
                aria-pressed={Boolean(project.likedByMe)}
                title={isAuthenticated ? undefined : "로그인 후 좋아요할 수 있습니다"}
              >
                <span aria-hidden="true">{project.likedByMe ? "♥" : "♡"}</span>
                <span>{project.likeCount ?? 0}</span>
              </button>
            </div>
            <p className="lab-detail__summary">{project.summary}</p>
            <p className="lab-detail__author">
              {project.author?.name} · {formatDate(project.createdAt)}
            </p>
          </header>

          {project.techStacks?.length > 0 && (
            <ul className="lab-detail__stacks">
              {project.techStacks.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}

          <LabUtGuide project={project} />

          {(project.serviceUrl || project.githubUrl) && (
            <div className="lab-detail__service-cta">
              <p className="lab-detail__service-cta-label">
                {project.serviceUrl ? "테스트할 서비스" : "프로젝트 링크"}
              </p>
              <div className="lab-detail__service-actions">
                {project.serviceUrl && (
                  <a
                    href={project.serviceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lab-btn lab-btn--primary lab-detail__service-link"
                  >
                    서비스 열기 ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lab-btn lab-btn--secondary lab-detail__github-link"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
              <p className="lab-detail__service-hint">
                {project.serviceUrl
                  ? "새 탭에서 열립니다. 테스트 후 아래 피드백을 작성해 주세요."
                  : "배포 URL이 없습니다. GitHub에서 프로젝트를 확인해 주세요."}
              </p>
            </div>
          )}

          <section
            className={`lab-detail__section lab-detail__section--test-request${
              project.testRequest ? "" : " lab-detail__section--empty"
            }`}
          >
            <h2>테스트 요청 사항</h2>
            {project.testRequest ? (
              <p>{project.testRequest}</p>
            ) : (
              <p className="lab-muted">등록된 테스트 요청이 없습니다.</p>
            )}
          </section>

          <dl className="lab-detail__stats">
            <div>
              <dt>좋아요</dt>
              <dd>{project.likeCount ?? 0}</dd>
            </div>
            <div>
              <dt>조회</dt>
              <dd>{project.viewCount}</dd>
            </div>
            <div>
              <dt>피드백</dt>
              <dd>{project.feedbackCount}</dd>
            </div>
            <div>
              <dt>평균 만족도</dt>
              <dd>{formatScore(project.avgOverallScore)}</dd>
            </div>
            <div>
              <dt>UI/UX</dt>
              <dd>{formatScore(project.avgUiUxScore)}</dd>
            </div>
            <div>
              <dt>기능</dt>
              <dd>{formatScore(project.avgFunctionalityScore)}</dd>
            </div>
          </dl>

          {isOwner && (
            <div className="lab-detail__owner-actions">
              <Link to={`/lab/${projectId}/edit`} className="lab-btn lab-btn--secondary">
                프로젝트 수정
              </Link>
              <button
                type="button"
                className="lab-btn lab-btn--danger"
                onClick={handleDeleteProject}
              >
                프로젝트 삭제
              </button>
            </div>
          )}
        </article>

        <aside className="lab-detail__aside">
          <FeedbackSummary project={project} feedbacks={feedbacks} />

          <section className="lab-detail__feedback-panel">
            <div className="lab-detail__feedback-head">
              <h2>피드백 ({feedbacks.length})</h2>
              {isAuthenticated && !myFeedback && !showFeedbackForm && !editingFeedback && (
                <button
                  type="button"
                  className="lab-btn lab-btn--primary"
                  onClick={() => setShowFeedbackForm(true)}
                >
                  피드백 남기기
                </button>
              )}
              {!isAuthenticated && (
                <Link to="/login" className="lab-btn lab-btn--secondary">
                  로그인 후 작성
                </Link>
              )}
            </div>

            {showFeedbackForm && (
              <FeedbackForm
                submitLabel="피드백 등록"
                onSubmit={handleCreateFeedback}
                onCancel={() => setShowFeedbackForm(false)}
              />
            )}

            {editingFeedback && (
              <FeedbackForm
                initial={editingFeedback}
                submitLabel="수정 저장"
                onSubmit={handleUpdateFeedback}
                onCancel={() => setEditingFeedback(null)}
              />
            )}

            {myFeedback && !editingFeedback && !showFeedbackForm && (
              <div className="lab-detail__my-feedback">
                <p>내 피드백을 등록했습니다.</p>
                <div className="lab-form-actions">
                  <button
                    type="button"
                    className="lab-btn lab-btn--secondary"
                    onClick={() => setEditingFeedback(myFeedback)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="lab-btn lab-btn--ghost"
                    onClick={handleDeleteFeedback}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}

            <FeedbackList feedbacks={feedbacks} />
          </section>
        </aside>
      </div>
    </div>
  );
}

export default LabProjectDetailPage;
