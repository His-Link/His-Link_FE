function LabUtGuide({ project }) {
  const hasService = Boolean(project?.serviceUrl);

  return (
    <section className="lab-ut-guide" aria-label="사용자 테스트 안내">
      <h2 className="lab-ut-guide__title">테스터 가이드</h2>
      <ol className="lab-ut-guide__steps">
        <li>스크린샷을 확인하고 테스트 요청 사항을 읽습니다.</li>
        <li>
          {hasService
            ? "아래 「서비스 열기」로 실제 제품을 사용해 봅니다."
            : "제공된 링크(GitHub 등)를 참고해 프로젝트를 파악합니다."}
        </li>
        <li>UI/UX·기능·만족도를 평가하고 버그·의견을 남깁니다.</li>
        <li>피드백은 프로젝트당 1회만 등록할 수 있습니다.</li>
      </ol>
    </section>
  );
}

export default LabUtGuide;
