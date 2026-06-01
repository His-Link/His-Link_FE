import React from 'react';
import 'styles/CommunityPage.css';

function PostFilters() {
  return (
    <div className="post-filters-container">
      <div className="post-filters__categories">
        <button className="category-btn active">자유</button>
        <button className="category-btn">질문</button>
        <button className="category-btn">정보 공유</button>
        <button className="category-btn">트러블슈팅</button>
      </div>
      <div className="post-filters__actions">
        <div className="search-bar">
          <input type="text" placeholder="검색" />
        </div>
        <button className="write-btn">
          <span className="write-icon">✎</span> 글쓰기
        </button>
      </div>
    </div>
  );
}

export default PostFilters;
