import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "components/auth/RequireAuth";
import CommunityPostForm from "components/community/CommunityPostForm";
import { createPost } from "services/communityService";
import "styles/CommunityPage.css";

function CommunityPostCreateForm() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const post = await createPost(payload);
    navigate(`/community/${post.id}`, { replace: true });
  };

  return (
    <div className="community-page-container community-page-container--narrow">
      <header className="community-form-header">
        <Link to="/community" className="community-back-link">
          ← 커뮤니티 목록
        </Link>
        <h1>글 작성</h1>
        <p className="community-form-header__lead">
          Q&amp;A, 정보, 트러블슈팅 등 카테고리를 선택해 질문·정보를 공유해 보세요.
        </p>
      </header>

      <CommunityPostForm
        submitLabel="등록하기"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/community")}
      />
    </div>
  );
}

function CommunityPostCreatePage() {
  return (
    <RequireAuth>
      <CommunityPostCreateForm />
    </RequireAuth>
  );
}

export default CommunityPostCreatePage;
