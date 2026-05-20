import { Link } from "react-router-dom";
import RecruitmentCard from "components/home/RecruitmentCard";
import { MOCK_RECRUITMENT_POSTS_FULL } from "mocks/dashboardMock";
import "styles/RecruitmentPage.css";

function RecruitmentPage() {
  return (
    <div className="recruitment-page">
      <header className="recruitment-page__header">
        <div>
          <h1 className="recruitment-page__title">팀 모집</h1>
          <p className="recruitment-page__lead">
            역할별로 팀원을 찾고 있습니다. (현재는 UI 목 데이터 — AR5 API 연동 예정)
          </p>
        </div>
        <Link to="/" className="recruitment-page__back">
          메인으로
        </Link>
      </header>
      <div className="recruitment-page__grid">
        {MOCK_RECRUITMENT_POSTS_FULL.map((post, index) => (
          <RecruitmentCard key={post.id} post={post} accentIndex={index} />
        ))}
      </div>
    </div>
  );
}

export default RecruitmentPage;
