import { formatDate } from "utils/format";

function FeedbackList({ feedbacks }) {
  if (!feedbacks?.length) {
    return <p className="lab-muted">아직 피드백이 없습니다. 첫 테스터가 되어 보세요.</p>;
  }

  return (
    <ul className="lab-feedback-list">
      {feedbacks.map((feedback) => {
        const hasBug = Boolean(feedback.bugReport?.trim());
        return (
          <li
            key={feedback.id}
            className={`lab-feedback-item${hasBug ? " lab-feedback-item--has-bug" : ""}`}
          >
            <header className="lab-feedback-item__head">
              <strong>{feedback.author?.name}</strong>
              <time dateTime={feedback.createdAt}>{formatDate(feedback.createdAt)}</time>
            </header>
            <div className="lab-feedback-item__scores">
              <span>UI/UX ★{feedback.uiUxScore}</span>
              <span>기능 ★{feedback.functionalityScore}</span>
              <span>만족 ★{feedback.overallSatisfaction}</span>
            </div>
            {hasBug && (
              <div className="lab-feedback-item__bug">
                <span className="lab-feedback-item__bug-badge">버그</span>
                <p>{feedback.bugReport}</p>
              </div>
            )}
            {feedback.opinion && (
              <p className="lab-feedback-item__block">
                <em>의견</em> {feedback.opinion}
              </p>
            )}
            {feedback.improvementSuggestion && (
              <p className="lab-feedback-item__block">
                <em>개선</em> {feedback.improvementSuggestion}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default FeedbackList;
