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

function FeedbackForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormState(initial));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.uiUxScore || !form.functionalityScore || !form.overallSatisfaction) {
      setError("UI/UX, 기능성, 전반 만족도 점수를 모두 선택해 주세요.");
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

  return (
    <form className="lab-feedback-form" onSubmit={handleSubmit}>
      <h3 className="lab-feedback-form__title">
        {initial ? "피드백 수정" : "테스트 피드백 작성"}
      </h3>
      <p className="lab-feedback-form__hint">
        UI/UX·기능·만족도를 1~5점으로 평가하고, 버그·의견·개선안을 남겨 주세요.
      </p>

      <ScoreField
        label="UI/UX"
        name="uiUxScore"
        value={form.uiUxScore}
        onChange={(v) => setForm((prev) => ({ ...prev, uiUxScore: v }))}
      />
      <ScoreField
        label="기능성"
        name="functionalityScore"
        value={form.functionalityScore}
        onChange={(v) => setForm((prev) => ({ ...prev, functionalityScore: v }))}
      />
      <ScoreField
        label="전반적 만족도"
        name="overallSatisfaction"
        value={form.overallSatisfaction}
        onChange={(v) => setForm((prev) => ({ ...prev, overallSatisfaction: v }))}
      />

      <label className="lab-field">
        <span>버그 리포트</span>
        <textarea
          rows={3}
          value={form.bugReport}
          onChange={(e) => setForm((prev) => ({ ...prev, bugReport: e.target.value }))}
          placeholder="재현 방법, 기기/브라우저 등"
        />
      </label>

      <label className="lab-field">
        <span>전반 의견</span>
        <textarea
          rows={3}
          value={form.opinion}
          onChange={(e) => setForm((prev) => ({ ...prev, opinion: e.target.value }))}
          placeholder="사용해 본 소감"
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
          placeholder="개선하면 좋을 점"
        />
      </label>

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
