import { useEffect, useMemo, useState } from "react";
import { fetchTechStacks } from "services/techStackService";

const MAX_IMAGES = 10;

function isValidHttpUrl(value) {
  if (!value?.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateProjectForm(form) {
  const fieldErrors = {};
  const title = form.title.trim();
  const summary = form.summary.trim();

  if (!title) {
    fieldErrors.title = "제목을 입력해 주세요.";
  } else if (title.length > 200) {
    fieldErrors.title = "제목은 200자 이하여야 합니다.";
  }

  if (!summary) {
    fieldErrors.summary = "한 줄 소개를 입력해 주세요.";
  } else if (summary.length > 500) {
    fieldErrors.summary = "한 줄 소개는 500자 이하여야 합니다.";
  }

  if (form.serviceUrl.trim() && !isValidHttpUrl(form.serviceUrl)) {
    fieldErrors.serviceUrl = "http:// 또는 https:// 로 시작하는 URL을 입력해 주세요.";
  }

  if (form.githubUrl.trim() && !isValidHttpUrl(form.githubUrl)) {
    fieldErrors.githubUrl = "http:// 또는 https:// 로 시작하는 URL을 입력해 주세요.";
  }

  return fieldErrors;
}

function LabProjectForm({
  submitLabel,
  initialProject = null,
  onSubmit,
  onCancel
}) {
  const [techStacks, setTechStacks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    serviceUrl: "",
    githubUrl: "",
    testRequest: ""
  });
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTechStacks()
      .then(setTechStacks)
      .catch(() => setTechStacks([]));
  }, []);

  useEffect(() => {
    if (!initialProject) return;
    setForm({
      title: initialProject.title || "",
      summary: initialProject.summary || "",
      serviceUrl: initialProject.serviceUrl || "",
      githubUrl: initialProject.githubUrl || "",
      testRequest: initialProject.testRequest || ""
    });
    setExistingImages(initialProject.images || []);
    setDeleteImageIds([]);
    setNewFiles([]);
  }, [initialProject]);

  useEffect(() => {
    if (!initialProject?.techStacks?.length || !techStacks.length) return;
    const stackIds = initialProject.techStacks
      .map((name) => techStacks.find((stack) => stack.name === name)?.id)
      .filter(Boolean);
    setSelectedIds(stackIds);
  }, [initialProject, techStacks]);

  const newPreviews = useMemo(
    () =>
      newFiles.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        name: file.name
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
      setError(`이미지는 프로젝트당 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.`);
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

    const errors = validateProjectForm(form);
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
          summary: form.summary.trim(),
          serviceUrl: form.serviceUrl.trim(),
          githubUrl: form.githubUrl.trim(),
          testRequest: form.testRequest.trim()
        },
        techStackIds: selectedIds,
        deleteImageIds,
        newFiles
      });
    } catch (err) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="lab-project-form" onSubmit={handleSubmit} noValidate>
      <section className="lab-form-section" aria-labelledby="lab-project-basic">
        <h3 id="lab-project-basic" className="lab-form-section__title">
          기본 정보
        </h3>

        <label className={`lab-field${fieldErrors.title ? " lab-field--error" : ""}`}>
          <span>
            제목 <span className="lab-score-field__req">*</span>
          </span>
          <input
            type="text"
            value={form.title}
            onChange={handleChange("title")}
            maxLength={200}
            aria-invalid={Boolean(fieldErrors.title)}
          />
          {fieldErrors.title && <p className="lab-field-error">{fieldErrors.title}</p>}
        </label>

        <label className={`lab-field${fieldErrors.summary ? " lab-field--error" : ""}`}>
          <span>
            한 줄 소개 <span className="lab-score-field__req">*</span>
          </span>
          <textarea
            rows={2}
            value={form.summary}
            onChange={handleChange("summary")}
            maxLength={500}
            aria-invalid={Boolean(fieldErrors.summary)}
          />
          {fieldErrors.summary && <p className="lab-field-error">{fieldErrors.summary}</p>}
        </label>
      </section>

      <section className="lab-form-section" aria-labelledby="lab-project-links">
        <h3 id="lab-project-links" className="lab-form-section__title">
          링크
        </h3>
        <p className="lab-form-section__hint">
          배포 URL을 넣으면 테스터가 상세에서 바로 서비스를 열 수 있습니다.
        </p>

        <label className={`lab-field${fieldErrors.serviceUrl ? " lab-field--error" : ""}`}>
          <span>배포 URL</span>
          <input
            type="url"
            value={form.serviceUrl}
            onChange={handleChange("serviceUrl")}
            placeholder="https://example.com"
            aria-invalid={Boolean(fieldErrors.serviceUrl)}
          />
          {fieldErrors.serviceUrl && (
            <p className="lab-field-error">{fieldErrors.serviceUrl}</p>
          )}
        </label>

        <label className={`lab-field${fieldErrors.githubUrl ? " lab-field--error" : ""}`}>
          <span>GitHub URL</span>
          <input
            type="url"
            value={form.githubUrl}
            onChange={handleChange("githubUrl")}
            placeholder="https://github.com/..."
            aria-invalid={Boolean(fieldErrors.githubUrl)}
          />
          {fieldErrors.githubUrl && <p className="lab-field-error">{fieldErrors.githubUrl}</p>}
        </label>
      </section>

      <section className="lab-form-section lab-form-section--highlight" aria-labelledby="lab-project-test">
        <h3 id="lab-project-test" className="lab-form-section__title">
          테스트 요청 사항
        </h3>
        <p className="lab-form-section__hint">
          테스터가 확인할 시나리오·화면·주의사항을 적어 주세요. (검색에도 포함됩니다)
        </p>
        <label className="lab-field">
          <span className="lab-visually-hidden">테스트 요청 사항</span>
          <textarea
            rows={5}
            value={form.testRequest}
            onChange={handleChange("testRequest")}
            placeholder="예) 회원가입 → 로그인 → 메인 대시보드까지 진행해 주세요. 모바일 Safari에서도 확인 부탁드립니다."
          />
        </label>
      </section>

      <section className="lab-form-section" aria-labelledby="lab-project-images">
        <h3 id="lab-project-images" className="lab-form-section__title">
          스크린샷
        </h3>
      <div className="lab-field">
        <span>프로젝트 이미지 (최대 {MAX_IMAGES}장)</span>
        <p className="lab-image-hint">JPEG, PNG, WEBP, GIF · 파일당 5MB 이하</p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileChange}
          disabled={remainingSlots <= 0}
          className="lab-image-input"
        />
        {remainingSlots <= 0 && (
          <p className="lab-muted">더 이상 이미지를 추가할 수 없습니다.</p>
        )}
      </div>

      {existingImages.length > 0 && (
        <div className="lab-image-preview-grid">
          {existingImages.map((image) => {
            const marked = deleteImageIds.includes(image.id);
            return (
              <div
                key={image.id}
                className={`lab-image-preview${marked ? " lab-image-preview--removed" : ""}`}
              >
                <img src={image.url} alt="" />
                <button
                  type="button"
                  className="lab-image-preview__remove"
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
        <div className="lab-image-preview-grid">
          {newPreviews.map((preview, fileIndex) => (
            <div key={preview.key} className="lab-image-preview lab-image-preview--new">
              <img src={preview.url} alt={preview.name} />
              <button
                type="button"
                className="lab-image-preview__remove"
                onClick={() => removeNewFile(fileIndex)}
              >
                제거
              </button>
            </div>
          ))}
        </div>
      )}

      </section>

      {techStacks.length > 0 && (
        <section className="lab-form-section" aria-labelledby="lab-project-stacks">
          <h3 id="lab-project-stacks" className="lab-form-section__title">
            기술 스택
          </h3>
        <fieldset className="lab-fieldset">
          <legend className="lab-visually-hidden">기술 스택</legend>
          <div className="lab-chip-group">
            {techStacks.map((stack) => (
              <label key={stack.id} className="lab-chip">
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
        </section>
      )}

      {error && (
        <p className="lab-form-error" role="alert">
          {error}
        </p>
      )}

      <div className="lab-form-actions">
        {onCancel && (
          <button type="button" className="lab-btn lab-btn--ghost" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="lab-btn lab-btn--primary" disabled={submitting}>
          {submitting ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default LabProjectForm;
