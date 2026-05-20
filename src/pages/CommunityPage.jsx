import { Link } from "react-router-dom";
import "styles/PlaceholderPage.css";

function CommunityPage() {
  return (
    <section className="placeholder-page">
      <h1>커뮤니티</h1>
      <p>게시판 목록·상세 화면은 다음 단계에서 연결됩니다.</p>
      <Link to="/" className="placeholder-page__link">
        메인으로
      </Link>
    </section>
  );
}

export default CommunityPage;
