import { useState } from "react";
import ScoreField from "components/lab/ScoreField";

const EMPTY = {
  uiUxScore: 0,
  functionalityScore: 0,
  overallSatisfaction: 0,
  bugReport: "",
  opinion: "",
  improvementSuggestion: ""
};

function toFormState(feedback) {
  if (!feedback) return { ...EMPTY };
  return {
    uiUxScore: feedback.uiUxScore,
    functionalityScore: feedback.functionalityScore,
    overallSatisfaction: feedback.overallSatisfaction,
    bugReport: feedback.bugReport || "",
    opinion: feedback.opinion || "",
    improvementSuggestion: feedback.improvementSuggestion || ""
  };
}

function validateForm(form) {
  const fieldErrors = {};
  if (!form.uiUxScore) fieldErrors.uiUxScore = "UI/UX 점수를 선택해 주세요.";
  if (!form.functionalityScore) fieldErrors.functionalityScore = "기능성 점수를 선택해 주세요.";
  if (!form.overallSatisfaction) {
    fieldErrors.overallSatisfaction = "전반적 만족도를 선택해 주세요.";
  }
  return fieldErrors;
}

function FeedbackForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormState(initial));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("필수 항목을 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        uiUxScore: form.uiUxScore,
        functionalityScore: form.functionalityScore,
        overallSatisfaction: form.overallSatisfaction,
        bugReport: form.bugReport.trim() || null,
        opinion: form.opinion.trim() || null,
        improvementSuggestion: form.improvementSuggestion.trim() || null
      });
    } catch (err) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form className="lab-feedback-form" onSubmit={handleSubmit} noValidate>
      <h3 className="lab-feedback-form__title">
        {initial ? "피드백 수정" : "테스트 피드백 작성"}
      </h3>

      <section className="lab-form-section lab-form-section--scores" aria-labelledby="lab-scores-heading">
        <h4 id="lab-scores-heading" className="lab-form-section__title">
          정량 평가
        </h4>
        <p className="lab-form-section__hint">각 항목을 1~5점(별점)으로 평가해 주세요.</p>

        <ScoreField
          label="UI/UX"
          name="uiUxScore"
          value={form.uiUxScore}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, uiUxScore: v }));
            clearFieldError("uiUxScore");
          }}
          error={fieldErrors.uiUxScore}
        />
        <ScoreField
          label="기능성"
          name="functionalityScore"
          value={form.functionalityScore}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, functionalityScore: v }));
            clearFieldError("functionalityScore");
          }}
          error={fieldErrors.functionalityScore}
        />
        <ScoreField
          label="전반적 만족도"
          name="overallSatisfaction"
          value={form.overallSatisfaction}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, overallSatisfaction: v }));
            clearFieldError("overallSatisfaction");
          }}
          error={fieldErrors.overallSatisfaction}
        />
      </section>

      <section className="lab-form-section lab-form-section--text" aria-labelledby="lab-text-heading">
        <h4 id="lab-text-heading" className="lab-form-section__title">
          정성 피드백
        </h4>
        <p className="lab-form-section__hint">버그·의견·개선안은 선택 사항입니다.</p>

        <label className="lab-field">
          <span>버그 리포트</span>
          <textarea
            rows={3}
            value={form.bugReport}
            onChange={(e) => setForm((prev) => ({ ...prev, bugReport: e.target.value }))}
            placeholder="재현 단계 (1, 2, 3…), 기기·브라우저, 기대 결과 / 실제 결과"
          />
        </label>

        <label className="lab-field">
          <span>전반 의견</span>
          <textarea
            rows={3}
            value={form.opinion}
            onChange={(e) => setForm((prev) => ({ ...prev, opinion: e.target.value }))}
            placeholder="사용해 본 소감을 자유롭게 적어 주세요."
          />
        </label>

        <label className="lab-field">
          <span>개선 제안</span>
          <textarea
            rows={3}
            value={form.improvementSuggestion}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, improvementSuggestion: e.target.value }))
            }
            placeholder="개선하면 좋을 점을 구체적으로 적어 주세요."
          />
        </label>
      </section>

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

export default FeedbackForm;
