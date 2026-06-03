import { useState } from "react";
import { formatDate } from "utils/format";

function CommentList({ comments, currentUserId, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [busyId, setBusyId] = useState(null);

  if (!comments?.length) {
    return <p className="community-muted">아직 댓글이 없습니다. 첫 댓글을 남겨 보세요.</p>;
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
    if (!window.confirm("댓글을 삭제할까요?")) return;
    setBusyId(commentId);
    try {
      await onDelete(commentId);
      if (editingId === commentId) cancelEdit();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ul className="community-comment-list">
      {comments.map((comment) => {
        const isOwner = currentUserId && comment.author?.id === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <li key={comment.id} className="community-comment-item">
            <header className="community-comment-item__head">
              <strong>{comment.author?.name}</strong>
              <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
            </header>

            {isEditing ? (
              <>
                <textarea
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="community-comment-item__edit"
                />
                <div className="community-form-actions">
                  <button
                    type="button"
                    className="community-btn community-btn--ghost"
                    onClick={cancelEdit}
                    disabled={busyId === comment.id}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="community-btn community-btn--primary"
                    onClick={() => saveEdit(comment.id)}
                    disabled={busyId === comment.id}
                  >
                    저장
                  </button>
                </div>
              </>
            ) : (
              <p className="community-comment-item__body">{comment.content}</p>
            )}

            {isOwner && !isEditing && (
              <div className="community-comment-item__actions">
                <button
                  type="button"
                  className="community-btn community-btn--ghost"
                  onClick={() => startEdit(comment)}
                  disabled={busyId === comment.id}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="community-btn community-btn--ghost"
                  onClick={() => handleDelete(comment.id)}
                  disabled={busyId === comment.id}
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

export default CommentList;
