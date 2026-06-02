import { useEffect, useMemo, useState } from "react";
import { fetchTechStacks } from "services/techStackService";

const MAX_IMAGES = 10;

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
    <form className="lab-project-form" onSubmit={handleSubmit}>
      <label className="lab-field">
        <span>
          제목 <span className="lab-score-field__req">*</span>
        </span>
        <input
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          maxLength={200}
          required
        />
      </label>

      <label className="lab-field">
        <span>
          한 줄 소개 <span className="lab-score-field__req">*</span>
        </span>
        <textarea
          rows={2}
          value={form.summary}
          onChange={handleChange("summary")}
          maxLength={500}
          required
        />
      </label>

      <label className="lab-field">
        <span>배포 URL</span>
        <input type="url" value={form.serviceUrl} onChange={handleChange("serviceUrl")} />
      </label>

      <label className="lab-field">
        <span>GitHub URL</span>
        <input type="url" value={form.githubUrl} onChange={handleChange("githubUrl")} />
      </label>

      <label className="lab-field">
        <span>테스트 요청 사항</span>
        <textarea rows={4} value={form.testRequest} onChange={handleChange("testRequest")} />
      </label>

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

      {techStacks.length > 0 && (
        <fieldset className="lab-fieldset">
          <legend>기술 스택</legend>
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
