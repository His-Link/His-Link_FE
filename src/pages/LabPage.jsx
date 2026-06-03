import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LabProjectCard from "components/lab/LabProjectCard";
import { PROJECT_SORT_OPTIONS } from "constants/projectSort";
import { useAuthValue } from "hooks/useAuth";
import { fetchProjects } from "services/labService";
import { fetchTechStacks } from "services/techStackService";
import "styles/LabPage.css";

function LabPage() {
  const { isAuthenticated } = useAuthValue();
  const [sort, setSort] = useState("LATEST");
  const [keyword, setKeyword] = useState("");
  const [techStack, setTechStack] = useState("");
  const [draftKeyword, setDraftKeyword] = useState("");
  const [techStacks, setTechStacks] = useState([]);
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTechStacks()
      .then(setTechStacks)
      .catch(() => setTechStacks([]));
  }, []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProjects({ sort, keyword, techStack, page, size: 12 });
      setData(result);
    } catch (err) {
      setError(err.message || "프로젝트 목록을 불러오지 못했습니다.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [sort, keyword, techStack, page]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleSearch = (event) => {
    event.preventDefault();
    setKeyword(draftKeyword.trim());
    setPage(0);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(0);
  };

  const handleTechStackChange = (value) => {
    setTechStack(value);
    setPage(0);
  };

  return (
    <div className="lab-page">
      <header className="lab-page__header">
        <div>
          <p className="lab-page__eyebrow">AR4 · User Testing Lab</p>
          <h1 className="lab-page__title">User Testing Lab</h1>
          <p className="lab-page__lead">
            프로젝트를 등록하고 동료들의 UX·기능 피드백을 받아 보세요. 배포 URL과 테스트
            요청 사항을 함께 공유할 수 있습니다.
          </p>
        </div>
        <div className="lab-page__header-actions">
          {isAuthenticated ? (
            <Link to="/lab/new" className="lab-btn lab-btn--primary">
              프로젝트 등록
            </Link>
          ) : (
            <Link to="/login" className="lab-btn lab-btn--primary">
              로그인 후 등록
            </Link>
          )}
        </div>
      </header>

      <section className="lab-toolbar" aria-label="검색 및 정렬">
        <form className="lab-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={draftKeyword}
            onChange={(e) => setDraftKeyword(e.target.value)}
            placeholder="제목·요약·테스트 요청 검색"
            className="lab-search__input"
          />
          <button type="submit" className="lab-btn lab-btn--secondary">
            검색
          </button>
        </form>

        <select
          className="lab-select"
          value={techStack}
          onChange={(e) => handleTechStackChange(e.target.value)}
          aria-label="기술 스택 필터"
        >
          <option value="">전체 기술 스택</option>
          {techStacks.map((stack) => (
            <option key={stack.id} value={stack.name}>
              {stack.name}
            </option>
          ))}
        </select>

        <div className="lab-sort-tabs" role="tablist" aria-label="정렬">
          {PROJECT_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={sort === option.value}
              className={`lab-sort-tab${sort === option.value ? " lab-sort-tab--active" : ""}`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {loading && <p className="lab-muted">불러오는 중...</p>}
      {error && (
        <p className="lab-form-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="lab-page__grid">
            {data?.content?.length ? (
              data.content.map((project, index) => (
                <LabProjectCard
                  key={project.id}
                  project={project}
                  accentIndex={index}
                  sortMode={sort}
                />
              ))
            ) : (
              <p className="lab-muted lab-page__empty">
                등록된 프로젝트가 없습니다. 첫 프로젝트를 등록해 보세요.
              </p>
            )}
          </div>

          {data && data.totalPages > 1 && (
            <nav className="lab-pagination" aria-label="페이지">
              <button
                type="button"
                className="lab-btn lab-btn--ghost"
                disabled={page <= 0}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </button>
              <span className="lab-pagination__info">
                {page + 1} / {data.totalPages}
              </span>
              <button
                type="button"
                className="lab-btn lab-btn--ghost"
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

export default LabPage;
