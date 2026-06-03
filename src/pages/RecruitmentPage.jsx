import { useCallback, useEffect, useState } from "react";
import RecruitmentCard from "components/home/RecruitmentCard";
import RecruitmentFilters from "components/recruitment/RecruitmentFilters";
import { useAuthValue } from "hooks/useAuth";
import { fetchRecruitmentPosts } from "services/recruitmentService";
import { fetchTechStacks } from "services/techStackService";
import "styles/RecruitmentPage.css";

function RecruitmentPage() {
  const { isAuthenticated } = useAuthValue();
  const [activityType, setActivityType] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [techStack, setTechStack] = useState("");
  const [techStacks, setTechStacks] = useState([]);
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTechStacks().then(setTechStacks).catch(() => setTechStacks([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRecruitmentPosts({
        role: role || undefined,
        status: status || undefined,
        techStack: techStack || undefined,
        page,
        size: 12,
      });
      setData(result);
    } catch (err) {
      setError(err.message || "모집글 목록을 불러오지 못했습니다.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [activityType, role, status, techStack, page]);

  useEffect(() => {
    load();
  }, [load]);

  const resetPage = () => setPage(0);

  return (
    <div className="recruitment-page">
      <header className="recruitment-page__header">
        <div>
          <p className="recruitment-page__eyebrow">AR5 · Team Recruitment</p>
          <h1 className="recruitment-page__title">팀 모집</h1>
          <p className="recruitment-page__lead">
            프로젝트·해커톤·공모전·대회 등 유형과 역할·기술 스택으로 팀원을 찾을 수 있습니다.
          </p>
        </div>
      </header>

      <RecruitmentFilters
        activityType={activityType}
        role={role}
        status={status}
        techStack={techStack}
        techStacks={techStacks}
        onActivityTypeChange={(v) => {
          setActivityType(v);
          resetPage();
        }}
        onRoleChange={(v) => {
          setRole(v);
          resetPage();
        }}
        onStatusChange={(v) => {
          setStatus(v);
          resetPage();
        }}
        onTechStackChange={(v) => {
          setTechStack(v);
          resetPage();
        }}
        isAuthenticated={isAuthenticated}
      />

      {loading && <p className="recruitment-muted">불러오는 중...</p>}
      {error && (
        <p className="recruitment-form-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="recruitment-page__grid">
            {data?.content?.length ? (
              data.content.map((post, index) => (
                <RecruitmentCard key={post.id} post={post} accentIndex={index} />
              ))
            ) : (
              <p className="recruitment-page__empty">등록된 모집글이 없습니다. 첫 모집글을 작성해 보세요.</p>
            )}
          </div>

          {data && data.totalPages > 1 && (
            <nav className="recruitment-pagination" aria-label="페이지">
              <button
                type="button"
                className="recruitment-btn recruitment-btn--ghost"
                disabled={page <= 0}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </button>
              <span>
                {page + 1} / {data.totalPages}
              </span>
              <button
                type="button"
                className="recruitment-btn recruitment-btn--ghost"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default RecruitmentPage;
