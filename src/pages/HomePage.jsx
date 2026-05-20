import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "components/home/DashboardCard";
import CommunityPreviewList from "components/home/CommunityPreviewList";
import LabPreviewList from "components/home/LabPreviewList";
import RecruitmentCard from "components/home/RecruitmentCard";
import { fetchDashboard } from "services/dashboardService";
import { mergeDashboardWithMock } from "mocks/dashboardMock";
import "styles/HomePage.css";

const DASHBOARD_RECRUITMENT_COUNT = 6;

function HomePage() {
  const [dashboard, setDashboard] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchDashboard();
        if (!cancelled) {
          setDashboard(mergeDashboardWithMock(data));
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
          setDashboard(mergeDashboardWithMock(null));
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
  }, []);

  const recruitmentStrip = useMemo(() => {
    const list = dashboard?.latestRecruitmentPosts || [];
    return list.slice(0, DASHBOARD_RECRUITMENT_COUNT);
  }, [dashboard]);

  return (
    <div className="home-page">
      <section className="home-top-row" aria-label="소개 및 최신 커뮤니티">
        <div className="home-intro-panel">
          <p className="home-intro-panel__eyebrow">Handong Global University</p>
          <h1 className="home-intro-panel__title">HIS-Link</h1>
          <p className="home-intro-panel__lead">
            한동대 개발자를 위한 올인원 커뮤니티. 질문·정보·실험·팀 빌딩을 한곳에서.
          </p>
          <ul className="home-intro-panel__features">
            <li>
              <strong>커뮤니티</strong>
              <span>Q&amp;A · 정보</span>
            </li>
            <li>
              <strong>UT Lab</strong>
              <span>피드백 · UX</span>
            </li>
            <li>
              <strong>팀 모집</strong>
              <span>역할 매칭</span>
            </li>
          </ul>
        </div>
        <div className="home-top-aside">
          {!loading && dashboard ? (
            <DashboardCard
              title="최신 커뮤니티"
              subtitle="방금 올라온 글"
              actionLabel="더보기"
              actionTo="/community"
              className="dashboard-card--top-community"
            >
              <div className="dashboard-card__scroll">
                <CommunityPreviewList posts={dashboard.latestCommunityPosts} />
              </div>
            </DashboardCard>
          ) : (
            <div className="home-top-aside__placeholder">
              {loading ? "불러오는 중…" : "데이터 없음"}
            </div>
          )}
        </div>
      </section>

      <section className="home-dashboard" aria-label="메인 대시보드">
        {loading ? (
          <p className="home-dashboard__status">불러오는 중...</p>
        ) : (
          <>
            {dashboard?._isMock ? (
              <p className="home-dashboard__mock-notice">
                {loadFailed
                  ? "API 연결 실패 — 아래는 레이아웃 확인용 목 데이터입니다."
                  : "일부 섹션은 레이아웃 확인용 목 데이터로 표시됩니다."}
              </p>
            ) : null}

            <section className="home-recruitment" aria-label="팀 모집 미리보기">
              <header className="home-recruitment__header">
                <div>
                  <h2 className="home-recruitment__title">팀 모집</h2>
                  <p className="home-recruitment__subtitle">최근 모집 중인 프로젝트</p>
                </div>
                <Link to="/recruitment" className="home-recruitment__see-all">
                  전체 보기
                </Link>
              </header>
              <div className="home-recruitment__strip">
                {recruitmentStrip.map((post, index) => (
                  <RecruitmentCard key={post.id} post={post} accentIndex={index} />
                ))}
              </div>
            </section>

            <div className="home-projects-row">
              <DashboardCard
                title="최신 프로젝트"
                subtitle="User Testing Lab"
                actionLabel="Lab"
                actionTo="/lab"
                className="dashboard-card--project-slot"
              >
                <div className="dashboard-card__scroll">
                  <LabPreviewList projects={dashboard?.latestProjects} />
                </div>
              </DashboardCard>
              <DashboardCard
                title="인기 프로젝트"
                subtitle="좋아요 순"
                actionLabel="Lab"
                actionTo="/lab"
                className="dashboard-card--project-slot"
              >
                <div className="dashboard-card__scroll">
                  <LabPreviewList projects={dashboard?.popularProjects} />
                </div>
              </DashboardCard>
              <DashboardCard
                title="피드백 TOP"
                subtitle="많은 피드백을 받은 프로젝트"
                actionLabel="Lab"
                actionTo="/lab"
                className="dashboard-card--project-slot"
              >
                <div className="dashboard-card__scroll">
                  <LabPreviewList projects={dashboard?.topFeedbackProjects} showFeedback />
                </div>
              </DashboardCard>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;
