import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageCarousel from "components/lab/ImageCarousel";
import RecruitmentCommentForm from "components/recruitment/RecruitmentCommentForm";
import RecruitmentCommentList from "components/recruitment/RecruitmentCommentList";
import { RECRUITMENT_ACTIVITY_LABEL } from "constants/recruitmentActivityType";
import { RECRUITMENT_ROLE_LABEL } from "constants/recruitmentRole";
import { useAuthValue } from "hooks/useAuth";
import {
  createRecruitmentComment,
  deleteRecruitmentComment,
  deleteRecruitmentPost,
  fetchRecruitmentComments,
  fetchRecruitmentPost,
  updateRecruitmentComment,
} from "services/recruitmentService";
import { formatDate } from "utils/format";
import "styles/RecruitmentPage.css";

function RecruitmentPostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthValue();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postData, commentData] = await Promise.all([
        fetchRecruitmentPost(postId),
        fetchRecruitmentComments(postId),
      ]);
      setPost(postData);
      setComments(commentData);
    } catch (err) {
      setError(err.message || "모집글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwner = post && user && post.author?.id === user.id;
  const myApplication = comments.find(
    (c) => c.application && c.author?.id === user?.id
  );
  const canApply =
    isAuthenticated &&
    post?.status === "OPEN" &&
    !isOwner &&
    !myApplication &&
    post.currentCount < post.participantLimit;

  const handleCreateComment = async (content, application) => {
    await createRecruitmentComment(postId, content, application);
    setShowCommentForm(false);
    setShowApplyForm(false);
    await load();
  };

  const handleUpdateComment = async (commentId, content) => {
    await updateRecruitmentComment(commentId, content);
    await load();
  };

  const handleDeleteComment = async (commentId) => {
    await deleteRecruitmentComment(commentId);
    await load();
  };

  const handleDeletePost = async () => {
    if (!window.confirm("모집글과 모든 댓글을 삭제할까요?")) return;
    await deleteRecruitmentPost(postId);
    navigate("/recruitment", { replace: true });
  };

  if (loading) {
    return (
      <div className="recruitment-page">
        <p className="recruitment-muted">불러오는 중...</p>
      </div>
    );
  }

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

  const progress = Math.min(
    100,
    Math.round((post.currentCount / post.participantLimit) * 100)
  );

  return (
    <div className="recruitment-page">
      <Link to="/recruitment" className="recruitment-back-link">
        ← 팀 모집 목록
      </Link>

      <article className="recruitment-detail">
        <header className="recruitment-detail__header">
          <div className="recruitment-detail__badges">
            <span className="recruitment-detail__activity">
              {RECRUITMENT_ACTIVITY_LABEL[post.activityType] || post.activityType}
            </span>
            <span className="recruitment-detail__role">
              {RECRUITMENT_ROLE_LABEL[post.recruitmentRole] || post.recruitmentRole}
            </span>
          </div>
          <h1>{post.title}</h1>
          <p className="recruitment-detail__meta">
            {post.author?.name} · {formatDate(post.createdAt)}
            {post.deadline && <> · 마감 {formatDate(post.deadline)}</>}
          </p>
          <p className="recruitment-detail__status">
            {post.status === "OPEN" ? "모집중" : "마감"} · {post.currentCount} /{" "}
            {post.participantLimit}명
          </p>
          <div className="recruitment-detail__progress">
            <div className="recruitment-detail__progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </header>

        {post.images?.length > 0 && (
          <div className="recruitment-detail__carousel">
            <ImageCarousel images={post.images} altPrefix={post.title} />
          </div>
        )}

        {post.techStacks?.length > 0 && (
          <ul className="recruitment-detail__stacks">
            {post.techStacks.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}

        <div className="recruitment-detail__content">{post.description}</div>

        {post.contactMethod && (
          <p className="recruitment-detail__contact">
            <strong>연락:</strong> {post.contactMethod}
          </p>
        )}

        {isOwner && (
          <div className="recruitment-detail__owner-actions">
            <Link
              to={`/recruitment/${postId}/edit`}
              className="recruitment-btn recruitment-btn--secondary"
            >
              수정
            </Link>
            <button
              type="button"
              className="recruitment-btn recruitment-btn--danger"
              onClick={handleDeletePost}
            >
              삭제
            </button>
          </div>
        )}

        {canApply && !showApplyForm && (
          <button
            type="button"
            className="recruitment-btn recruitment-btn--primary recruitment-detail__apply-btn"
            onClick={() => setShowApplyForm(true)}
          >
            지원하기
          </button>
        )}

        {showApplyForm && (
          <RecruitmentCommentForm
            submitLabel="지원 제출"
            application
            onSubmit={(content) => handleCreateComment(content, true)}
            onCancel={() => setShowApplyForm(false)}
          />
        )}

        <section className="recruitment-detail__comments">
          <div className="recruitment-detail__comments-head">
            <h2>댓글·지원 ({comments.length})</h2>
            {isAuthenticated && !showCommentForm && (
              <button
                type="button"
                className="recruitment-btn recruitment-btn--secondary"
                onClick={() => setShowCommentForm(true)}
              >
                댓글 작성
              </button>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="recruitment-btn recruitment-btn--secondary">
                로그인 후 작성
              </Link>
            )}
          </div>

          {showCommentForm && (
            <RecruitmentCommentForm
              onSubmit={(content) => handleCreateComment(content, false)}
              onCancel={() => setShowCommentForm(false)}
            />
          )}

          <RecruitmentCommentList
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

export default RecruitmentPostDetailPage;
