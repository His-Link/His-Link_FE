import React from 'react';
import 'styles/CommunityPage.css';

function CommunityBanner() {
  return (
    <div className="community-banner">
      <div className="community-banner__content">
        <span className="community-banner__subtitle">HANDONG GLOBAL UNIVERSITY</span>
        <h1 className="community-banner__title">HIS-Link</h1>
        <p className="community-banner__description">
          한동대 개발자를 위한 온라인 커뮤니티. 질문·정보·상담·팀 빌딩을 한곳에서.
        </p>
      </div>
    </div>
  );
}

export default CommunityBanner;
