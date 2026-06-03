import { useState } from "react";

function RecruitmentCommentForm({
  submitLabel = "등록",
  application = false,
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const trimmed = content.trim();
    if (!trimmed) {
      setError(application ? "지원 메시지를 입력해 주세요." : "댓글을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setContent("");
    } catch (err) {
      setError(err.message || "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="recruitment-comment-form" onSubmit={handleSubmit} noValidate>
      <label className="recruitment-field">
        <span>{application ? "지원 메시지" : "댓글"}</span>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            application
              ? "간단한 자기소개와 참여 가능 시간을 적어 주세요."
              : "질문이나 의견을 남겨 주세요."
          }
        />
      </label>
      {error && (
        <p className="recruitment-field-error" role="alert">
          {error}
        </p>
      )}
      <div className="recruitment-form-actions">
        {onCancel && (
          <button type="button" className="recruitment-btn recruitment-btn--ghost" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="recruitment-btn recruitment-btn--primary" disabled={submitting}>
          {submitting ? "등록 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RecruitmentCommentForm;
