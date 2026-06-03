import { useState } from "react";
import { POST_CATEGORIES } from "constants/postCategory";

function validateForm(form) {
  const fieldErrors = {};
  const title = form.title.trim();
  const content = form.content.trim();

  if (!form.category) {
    fieldErrors.category = "카테고리를 선택해 주세요.";
  }
  if (!title) {
    fieldErrors.title = "제목을 입력해 주세요.";
  } else if (title.length > 200) {
    fieldErrors.title = "제목은 200자 이하여야 합니다.";
  }
  if (!content) {
    fieldErrors.content = "본문을 입력해 주세요.";
  }
  return fieldErrors;
}

function CommunityPostForm({ submitLabel, initialPost = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    category: initialPost?.category || "FREE",
    title: initialPost?.title || "",
    content: initialPost?.content || "",
  }));
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("입력 내용을 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
      });
    } catch (err) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="community-form" onSubmit={handleSubmit} noValidate>
      <label className={`community-field${fieldErrors.category ? " community-field--error" : ""}`}>
        <span>
          카테고리 <span className="community-field__req">*</span>
        </span>
        <select value={form.category} onChange={handleChange("category")}>
          {POST_CATEGORIES.filter((item) => item.value).map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {fieldErrors.category && <p className="community-field-error">{fieldErrors.category}</p>}
      </label>

      <label className={`community-field${fieldErrors.title ? " community-field--error" : ""}`}>
        <span>
          제목 <span className="community-field__req">*</span>
        </span>
        <input
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          maxLength={200}
        />
        {fieldErrors.title && <p className="community-field-error">{fieldErrors.title}</p>}
      </label>

      <label className={`community-field${fieldErrors.content ? " community-field--error" : ""}`}>
        <span>
          본문 <span className="community-field__req">*</span>
        </span>
        <textarea rows={12} value={form.content} onChange={handleChange("content")} />
        {fieldErrors.content && <p className="community-field-error">{fieldErrors.content}</p>}
      </label>

      {error && (
        <p className="community-form-error" role="alert">
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
          {submitting ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default CommunityPostForm;
