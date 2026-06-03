import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "components/auth/RequireAuth";
import RecruitmentPostForm from "components/recruitment/RecruitmentPostForm";
import { createRecruitmentPost } from "services/recruitmentService";
import "styles/RecruitmentPage.css";

function RecruitmentPostCreateForm() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const post = await createRecruitmentPost(payload);
    navigate(`/recruitment/${post.id}`, { replace: true });
  };

  return (
    <div className="recruitment-page recruitment-page--narrow">
      <Link to="/recruitment" className="recruitment-back-link">
        ← 팀 모집 목록
      </Link>
      <h1 className="recruitment-page__title">모집글 작성</h1>
      <p className="recruitment-page__lead">
        활동 유형·역할·이미지·기술 스택을 설정해 팀원을 모집해 보세요.
      </p>

      <RecruitmentPostForm
        submitLabel="등록하기"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/recruitment")}
      />
    </div>
  );
}

function RecruitmentPostCreatePage() {
  return (
    <RequireAuth>
      <RecruitmentPostCreateForm />
    </RequireAuth>
  );
}

export default RecruitmentPostCreatePage;
