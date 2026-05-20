import { Link } from "react-router-dom";
import "styles/PlaceholderPage.css";

function LabPage() {
  return (
    <section className="placeholder-page">
      <h1>User Testing Lab</h1>
      <p>프로젝트 등록·피드백 기능(AR4)은 준비 중입니다.</p>
      <Link to="/" className="placeholder-page__link">
        메인으로
      </Link>
    </section>
  );
}

export default LabPage;
