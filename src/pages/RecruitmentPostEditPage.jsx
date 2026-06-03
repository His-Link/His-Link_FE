import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RequireAuth from "components/auth/RequireAuth";
import RecruitmentPostForm from "components/recruitment/RecruitmentPostForm";
import { useAuthValue } from "hooks/useAuth";
import { fetchRecruitmentPost, updateRecruitmentPost } from "services/recruitmentService";
import "styles/RecruitmentPage.css";

function RecruitmentPostEditForm() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthValue();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchRecruitmentPost(postId);
        if (!cancelled) {
          if (user && data.author?.id !== user.id) {
            setError("수정 권한이 없습니다.");
          } else {
            setPost(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "모집글을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [postId, user]);

  const handleSubmit = async (payload) => {
    const updated = await updateRecruitmentPost(postId, payload);
    navigate(`/recruitment/${updated.id}`, { replace: true });
  };

  if (loading) return <p className="recruitment-muted">불러오는 중...</p>;

  if (error || !post) {
    return (
      <div className="recruitment-page">
        <p className="recruitment-form-error" role="alert">
          {error || "모집글을 찾을 수 없습니다."}
        </p>
        <Link to="/recruitment" className="recruitment-back-link">
          ← 팀 모집 목록
        </Link>
      </div>
    );
  }

  return (
    <div className="recruitment-page recruitment-page--narrow">
      <Link to={`/recruitment/${postId}`} className="recruitment-back-link">
        ← 모집글 상세
      </Link>
      <h1 className="recruitment-page__title">모집글 수정</h1>

      <RecruitmentPostForm
        submitLabel="저장하기"
        initialPost={post}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/recruitment/${postId}`)}
      />
    </div>
  );
}

function RecruitmentPostEditPage() {
  return (
    <RequireAuth>
      <RecruitmentPostEditForm />
    </RequireAuth>
  );
}

export default RecruitmentPostEditPage;
