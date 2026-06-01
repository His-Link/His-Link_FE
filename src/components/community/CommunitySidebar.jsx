import React from 'react';
import 'styles/CommunityPage.css';

function CommunitySidebar() {
  const popularPosts = [
    { rank: 1, title: '기숙사 생활 꿀팁 (5)', subtitle: 'HikariCP -liang 평협 (3)', author: '학생A', views: 230, likes: 420, likes2: 20 },
    { rank: 2, title: 'Spring Security Custom Filter 문제 (2)', subtitle: '', author: '개발자B', views: 150, likes: 190, likes2: 35 },
    { rank: 3, title: '최신 AI 개발 툴 소개 (1)', subtitle: '오류 해결 경험', author: '서버관리자D', views: 110, likes: 100, likes2: 15 },
  ];

  return (
    <div className="community-sidebar">
      <div className="sidebar-widget">
        <h3 className="widget-title">실시간 인기 글</h3>
        <div className="widget-table-header">
          <span className="w-rank">#</span>
          <span className="w-title">제목</span>
          <span className="w-views">조회</span>
          <span className="w-likes">추천</span>
        </div>
        <ul className="popular-posts-list">
          {popularPosts.map((post) => (
            <li key={post.rank} className="popular-post-item">
              <div className="w-rank">{post.rank}</div>
              <div className="w-content">
                <div className="w-post-title">{post.title}</div>
                {post.subtitle && <div className="w-post-subtitle">{post.subtitle}</div>}
                <div className="w-author">{post.author}</div>
              </div>
              <div className="w-stats">
                <div className="w-stat-row"><span>{post.views}</span> <span className="like-icon">👍</span></div>
                <div className="w-stat-row"><span>{post.likes}</span> <span>{post.likes2}</span></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-widget">
        <h3 className="widget-title">최신 댓글</h3>
        <div className="latest-comments-placeholder">
          {/* Placeholder for latest comments */}
        </div>
      </div>
    </div>
  );
}

export default CommunitySidebar;
