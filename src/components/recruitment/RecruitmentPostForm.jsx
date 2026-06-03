import { useEffect, useMemo, useState } from "react";
import { RECRUITMENT_ACTIVITY_FORM_OPTIONS } from "constants/recruitmentActivityType";
import { RECRUITMENT_ROLES, RECRUITMENT_STATUS_OPTIONS } from "constants/recruitmentRole";
import { fetchTechStacks } from "services/techStackService";

const MAX_IMAGES = 10;

function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function validateForm(form) {
  const fieldErrors = {};
  if (!form.title.trim()) fieldErrors.title = "제목을 입력해 주세요.";
  if (!form.description.trim()) fieldErrors.description = "상세 설명을 입력해 주세요.";
  if (!form.activityType) fieldErrors.activityType = "활동 유형을 선택해 주세요.";
  if (!form.recruitmentRole) fieldErrors.recruitmentRole = "모집 역할을 선택해 주세요.";
  const limit = Number(form.participantLimit);
  if (!limit || limit < 1) fieldErrors.participantLimit = "모집 인원은 1명 이상이어야 합니다.";
  return fieldErrors;
}

function RecruitmentPostForm({ submitLabel, initialPost = null, onSubmit, onCancel }) {
  const [techStacks, setTechStacks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    activityType: "PROJECT",
    recruitmentRole: "FRONTEND",
    status: "OPEN",
    participantLimit: 3,
    deadline: "",
    contactMethod: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTechStacks().then(setTechStacks).catch(() => setTechStacks([]));
  }, []);

  useEffect(() => {
    if (!initialPost) return;
    setForm({
      title: initialPost.title || "",
      description: initialPost.description || "",
      activityType: initialPost.activityType || "PROJECT",
      recruitmentRole: initialPost.recruitmentRole || "FRONTEND",
      status: initialPost.status || "OPEN",
      participantLimit: initialPost.participantLimit || 1,
      deadline: toDatetimeLocalValue(initialPost.deadline),
      contactMethod: initialPost.contactMethod || "",
    });
    setExistingImages(initialPost.images || []);
    setDeleteImageIds([]);
    setNewFiles([]);
  }, [initialPost]);

  useEffect(() => {
    if (!initialPost?.techStacks?.length || !techStacks.length) return;
    const ids = initialPost.techStacks
      .map((name) => techStacks.find((s) => s.name === name)?.id)
      .filter(Boolean);
    setSelectedIds(ids);
  }, [initialPost, techStacks]);

  const newPreviews = useMemo(
    () =>
      newFiles.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    [newFiles]
  );

  useEffect(
    () => () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [newPreviews]
  );

  const remainingSlots =
    MAX_IMAGES - (existingImages.length - deleteImageIds.length) - newFiles.length;

  const toggleStack = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

  const handleFileChange = (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (!picked.length) return;

    const allowed = picked.slice(0, Math.max(0, remainingSlots));
    if (allowed.length < picked.length) {
      setError(`이미지는 모집글당 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.`);
    } else {
      setError(null);
    }
    if (allowed.length) {
      setNewFiles((prev) => [...prev, ...allowed]);
    }
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExisting = (imageId) => {
    setDeleteImageIds((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    );
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
        fields: {
          title: form.title.trim(),
          description: form.description.trim(),
          activityType: form.activityType,
          recruitmentRole: form.recruitmentRole,
          status: form.status,
          participantLimit: Number(form.participantLimit),
          deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
          contactMethod: form.contactMethod.trim() || null,
        },
        techStackIds: selectedIds,
        deleteImageIds,
        newFiles,
      });
    } catch (err) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = RECRUITMENT_ROLES.filter((r) => r.value);
  const statusOptions = RECRUITMENT_STATUS_OPTIONS.filter((s) => s.value);

  return (
    <form className="recruitment-form" onSubmit={handleSubmit} noValidate>
      <label className={`recruitment-field${fieldErrors.title ? " recruitment-field--error" : ""}`}>
        <span>
          제목 <span className="recruitment-field__req">*</span>
        </span>
        <input type="text" value={form.title} onChange={handleChange("title")} maxLength={200} />
        {fieldErrors.title && <p className="recruitment-field-error">{fieldErrors.title}</p>}
      </label>

      <label
        className={`recruitment-field${fieldErrors.activityType ? " recruitment-field--error" : ""}`}
      >
        <span>
          활동 유형 <span className="recruitment-field__req">*</span>
        </span>
        <select value={form.activityType} onChange={handleChange("activityType")}>
          {RECRUITMENT_ACTIVITY_FORM_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {fieldErrors.activityType && (
          <p className="recruitment-field-error">{fieldErrors.activityType}</p>
        )}
      </label>

      <label
        className={`recruitment-field${fieldErrors.recruitmentRole ? " recruitment-field--error" : ""}`}
      >
        <span>
          모집 역할 <span className="recruitment-field__req">*</span>
        </span>
        <select value={form.recruitmentRole} onChange={handleChange("recruitmentRole")}>
          {roleOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="recruitment-field">
        <span>모집 상태</span>
        <select value={form.status} onChange={handleChange("status")}>
          {statusOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label
        className={`recruitment-field${fieldErrors.participantLimit ? " recruitment-field--error" : ""}`}
      >
        <span>
          모집 인원 <span className="recruitment-field__req">*</span>
        </span>
        <input
          type="number"
          min={1}
          value={form.participantLimit}
          onChange={handleChange("participantLimit")}
        />
        {fieldErrors.participantLimit && (
          <p className="recruitment-field-error">{fieldErrors.participantLimit}</p>
        )}
      </label>

      <label className="recruitment-field">
        <span>마감일</span>
        <input type="datetime-local" value={form.deadline} onChange={handleChange("deadline")} />
      </label>

      <label className="recruitment-field">
        <span>연락 방법</span>
        <input
          type="text"
          value={form.contactMethod}
          onChange={handleChange("contactMethod")}
          placeholder="이메일, 오픈채팅, GitHub 등"
        />
      </label>

      <label
        className={`recruitment-field${fieldErrors.description ? " recruitment-field--error" : ""}`}
      >
        <span>
          상세 설명 <span className="recruitment-field__req">*</span>
        </span>
        <textarea rows={8} value={form.description} onChange={handleChange("description")} />
        {fieldErrors.description && (
          <p className="recruitment-field-error">{fieldErrors.description}</p>
        )}
      </label>

      <fieldset className="recruitment-fieldset">
        <legend>이미지 (최대 {MAX_IMAGES}장)</legend>
        <p className="recruitment-image-hint">JPEG, PNG, WEBP, GIF · 파일당 5MB 이하</p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileChange}
          disabled={remainingSlots <= 0}
          className="recruitment-image-input"
        />
        {remainingSlots <= 0 && (
          <p className="recruitment-muted">더 이상 이미지를 추가할 수 없습니다.</p>
        )}

        {existingImages.length > 0 && (
          <div className="recruitment-image-preview-grid">
            {existingImages.map((image) => {
              const marked = deleteImageIds.includes(image.id);
              return (
                <div
                  key={image.id}
                  className={`recruitment-image-preview${marked ? " recruitment-image-preview--removed" : ""}`}
                >
                  <img src={image.url} alt="" />
                  <button
                    type="button"
                    className="recruitment-image-preview__remove"
                    onClick={() => toggleDeleteExisting(image.id)}
                  >
                    {marked ? "복원" : "삭제"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {newPreviews.length > 0 && (
          <div className="recruitment-image-preview-grid">
            {newPreviews.map((preview, fileIndex) => (
              <div key={preview.key} className="recruitment-image-preview recruitment-image-preview--new">
                <img src={preview.url} alt={preview.name} />
                <button
                  type="button"
                  className="recruitment-image-preview__remove"
                  onClick={() => removeNewFile(fileIndex)}
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {techStacks.length > 0 && (
        <fieldset className="recruitment-fieldset">
          <legend>희망 기술 스택</legend>
          <div className="recruitment-chip-group">
            {techStacks.map((stack) => (
              <label key={stack.id} className="recruitment-chip">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(stack.id)}
                  onChange={() => toggleStack(stack.id)}
                />
                <span>{stack.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {error && (
        <p className="recruitment-form-error" role="alert">
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
          {submitting ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RecruitmentPostForm;
