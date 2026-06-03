import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentForm from "components/community/CommentForm";
import CommentList from "components/community/CommentList";
import { POST_CATEGORY_LABEL } from "constants/postCategory";
import { useAuthValue } from "hooks/useAuth";
import {
  createComment,
  deleteComment,
  deletePost,
  fetchComments,
  fetchPost,
  togglePostLike,
  updateComment,
} from "services/communityService";
import { shouldIncrementCommunityView } from "utils/communityViewDedupe";
import { formatDate } from "utils/format";
import "styles/CommunityPage.css";

function CommunityPostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthValue();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeBusy, setLikeBusy] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const load = useCallback(async ({ countView = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [postData, commentData] = await Promise.all([
        fetchPost(postId, { countView }),
        fetchComments(postId),
      ]);
      setPost(postData);
      setComments(commentData);
    } catch (err) {
      setError(err.message || "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    const countView = shouldIncrementCommunityView(postId);
    load({ countView });
  }, [postId, load]);

  const isOwner = post && user && post.author?.id === user.id;

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const result = await togglePostLike(postId);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likeCount: result.likeCount,
              likedByMe: result.liked,
            }
          : prev
      );
    } catch (err) {
      window.alert(err.message || "추천 처리에 실패했습니다.");
    } finally {
      setLikeBusy(false);
    }
  };

  const handleCreateComment = async (content) => {
    await createComment(postId, content);
    setShowCommentForm(false);
    await load();
  };

  const handleUpdateComment = async (commentId, content) => {
    await updateComment(commentId, content);
    await load();
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    await load();
  };

  const handleDeletePost = async () => {
    if (!window.confirm("게시글과 모든 댓글을 삭제할까요?")) return;
    await deletePost(postId);
    navigate("/community", { replace: true });
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
    <div className="community-page-container">
      <Link to="/community" className="community-back-link">
        ← 커뮤니티 목록
      </Link>

      <article className="community-detail">
        <header className="community-detail__header">
          <div className="community-detail__title-row">
            <div>
              <span className="community-detail__category">
                {POST_CATEGORY_LABEL[post.category] || post.category}
              </span>
              <h1>{post.title}</h1>
            </div>
            <button
              type="button"
              className={`community-like-btn${post.likedByMe ? " community-like-btn--on" : ""}`}
              onClick={handleToggleLike}
              disabled={likeBusy}
              aria-pressed={Boolean(post.likedByMe)}
            >
              <span aria-hidden="true">{post.likedByMe ? "♥" : "♡"}</span>
              <span>{post.likeCount}</span>
            </button>
          </div>
          <p className="community-detail__meta">
            {post.author?.name} · {formatDate(post.createdAt)} · 조회 {post.viewCount} · 댓글{" "}
            {post.commentCount}
          </p>
        </header>

        <div className="community-detail__content">{post.content}</div>

        {isOwner && (
          <div className="community-detail__owner-actions">
            <Link to={`/community/${postId}/edit`} className="community-btn community-btn--secondary">
              수정
            </Link>
            <button
              type="button"
              className="community-btn community-btn--danger"
              onClick={handleDeletePost}
            >
              삭제
            </button>
          </div>
        )}

        <section className="community-detail__comments">
          <div className="community-detail__comments-head">
            <h2>댓글 ({comments.length})</h2>
            {isAuthenticated && !showCommentForm && (
              <button
                type="button"
                className="community-btn community-btn--primary"
                onClick={() => setShowCommentForm(true)}
              >
                댓글 작성
              </button>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="community-btn community-btn--secondary">
                로그인 후 작성
              </Link>
            )}
          </div>

          {showCommentForm && (
            <CommentForm
              onSubmit={handleCreateComment}
              onCancel={() => setShowCommentForm(false)}
            />
          )}

          <CommentList
            comments={comments}
            currentUserId={user?.id}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
        </section>
      </article>
    </div>
  );
}

export default CommunityPostDetailPage;
