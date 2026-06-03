import { useState } from "react";
import { formatDate } from "utils/format";

function RecruitmentCommentList({ comments, currentUserId, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [busyId, setBusyId] = useState(null);

  if (!comments?.length) {
    return <p className="recruitment-muted">아직 댓글이 없습니다.</p>;
  }

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = async (commentId) => {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    setBusyId(commentId);
    try {
      await onUpdate(commentId, trimmed);
      cancelEdit();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("삭제할까요?")) return;
    setBusyId(commentId);
    try {
      await onDelete(commentId);
      if (editingId === commentId) cancelEdit();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ul className="recruitment-comment-list">
      {comments.map((comment) => {
        const isOwner = currentUserId && comment.author?.id === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <li
            key={comment.id}
            className={`recruitment-comment-item${
              comment.application ? " recruitment-comment-item--application" : ""
            }`}
          >
            <header className="recruitment-comment-item__head">
              <div>
                <strong>{comment.author?.name}</strong>
                {comment.application && (
                  <span className="recruitment-comment-item__badge">지원</span>
                )}
              </div>
              <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
            </header>

            {isEditing ? (
              <>
                <textarea
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="recruitment-comment-item__edit"
                />
                <div className="recruitment-form-actions">
                  <button
                    type="button"
                    className="recruitment-btn recruitment-btn--ghost"
                    onClick={cancelEdit}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="recruitment-btn recruitment-btn--primary"
                    onClick={() => saveEdit(comment.id)}
                    disabled={busyId === comment.id}
                  >
                    저장
                  </button>
                </div>
              </>
            ) : (
              <p className="recruitment-comment-item__body">{comment.content}</p>
            )}

            {isOwner && !isEditing && (
              <div className="recruitment-comment-item__actions">
                <button
                  type="button"
                  className="recruitment-btn recruitment-btn--ghost"
                  onClick={() => startEdit(comment)}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="recruitment-btn recruitment-btn--ghost"
                  onClick={() => handleDelete(comment.id)}
                >
                  삭제
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default RecruitmentCommentList;
