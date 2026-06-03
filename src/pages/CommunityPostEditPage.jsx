import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RequireAuth from "components/auth/RequireAuth";
import CommunityPostForm from "components/community/CommunityPostForm";
import { useAuthValue } from "hooks/useAuth";
import { fetchPost, updatePost } from "services/communityService";
import "styles/CommunityPage.css";

function CommunityPostEditForm() {
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
        const data = await fetchPost(postId, { countView: false });
        if (!cancelled) {
          if (user && data.author?.id !== user.id) {
            setError("게시글을 수정할 권한이 없습니다.");
          } else {
            setPost(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "게시글을 불러오지 못했습니다.");
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
  }, [postId, user]);

  const handleSubmit = async (payload) => {
    const updated = await updatePost(postId, payload);
    navigate(`/community/${updated.id}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="community-page-container">
        <p className="community-muted">불러오는 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="community-page-container">
        <p className="community-form-error" role="alert">
          {error || "게시글을 찾을 수 없습니다."}
        </p>
        <Link to="/community" className="community-back-link">
          ← 커뮤니티 목록
        </Link>
      </div>
    );
  }

  return (
    <div className="community-page-container community-page-container--narrow">
      <header className="community-form-header">
        <Link to={`/community/${postId}`} className="community-back-link">
          ← 게시글 상세
        </Link>
        <h1>글 수정</h1>
        <p className="community-form-header__lead">제목·카테고리·본문을 수정할 수 있습니다.</p>
      </header>

      <CommunityPostForm
        submitLabel="저장하기"
        initialPost={post}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/community/${postId}`)}
      />
    </div>
  );
}

function CommunityPostEditPage() {
  return (
    <RequireAuth>
      <CommunityPostEditForm />
    </RequireAuth>
  );
}

export default CommunityPostEditPage;
