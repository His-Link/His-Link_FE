import { useState } from "react";

function CommentForm({ submitLabel = "댓글 등록", onSubmit, onCancel }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const trimmed = content.trim();
    if (!trimmed) {
      setError("댓글 내용을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setContent("");
    } catch (err) {
      setError(err.message || "댓글 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="community-comment-form" onSubmit={handleSubmit} noValidate>
      <label className="community-field">
        <span className="community-visually-hidden">댓글</span>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력해 주세요."
        />
      </label>
      {error && (
        <p className="community-field-error" role="alert">
          {error}
        </p>
      )}
      <div className="community-form-actions">
        {onCancel && (
          <button type="button" className="community-btn community-btn--ghost" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="community-btn community-btn--primary" disabled={submitting}>
          {submitting ? "등록 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
