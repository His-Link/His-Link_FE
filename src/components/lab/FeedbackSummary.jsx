import { formatScore } from "utils/format";

function countByScore(feedbacks, getter) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedbacks.forEach((item) => {
    const score = getter(item);
    if (score >= 1 && score <= 5) {
      counts[score] += 1;
    }
  });
  return counts;
}

function FeedbackSummary({ project, feedbacks }) {
  if (!feedbacks?.length) {
    return (
      <div className="lab-feedback-summary lab-feedback-summary--empty">
        <p>아직 피드백이 없습니다. Lab 목록이나 커뮤니티에 공유해 테스터를 모집해 보세요.</p>
      </div>
    );
  }

  const bugCount = feedbacks.filter((f) => f.bugReport?.trim()).length;
  const satisfactionCounts = countByScore(feedbacks, (f) => f.overallSatisfaction);

  return (
    <div className="lab-feedback-summary">
      <h3 className="lab-feedback-summary__title">피드백 요약</h3>
      <dl className="lab-feedback-summary__stats">
        <div>
          <dt>총 피드백</dt>
          <dd>{feedbacks.length}</dd>
        </div>
        <div>
          <dt>버그 리포트</dt>
          <dd>{bugCount}건</dd>
        </div>
        <div>
          <dt>평균 만족도</dt>
          <dd>{formatScore(project.avgOverallScore)}</dd>
        </div>
        <div>
          <dt>평균 UI/UX</dt>
          <dd>{formatScore(project.avgUiUxScore)}</dd>
        </div>
        <div>
          <dt>평균 기능</dt>
          <dd>{formatScore(project.avgFunctionalityScore)}</dd>
        </div>
      </dl>
      <div className="lab-feedback-summary__distribution">
        <p className="lab-feedback-summary__dist-label">만족도 분포</p>
        <ul>
          {[5, 4, 3, 2, 1].map((score) => (
            <li key={score}>
              <span>{score}점</span>
              <span className="lab-feedback-summary__bar-wrap">
                <span
                  className="lab-feedback-summary__bar"
                  style={{
                    width: `${(satisfactionCounts[score] / feedbacks.length) * 100}%`
                  }}
                />
              </span>
              <span>{satisfactionCounts[score]}명</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FeedbackSummary;
