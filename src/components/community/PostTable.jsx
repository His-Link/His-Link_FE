import React from 'react';
import 'styles/CommunityPage.css';

function PostTable() {
  const posts = [
    { id: 105, category: '자유', title: '기숙사 생활 꿀팁 (5)', author: '학생A', date: '24.06.01', views: 230, likes: 42 },
    { id: 104, category: '질문', title: 'Spring Security Custom Filter 문제 (2)', author: '개발자B', date: '24.06.01', views: 150, likes: 20 },
    { id: 103, category: '정보 공유', title: '최신 AI 개발 툴 소개 (1)', author: '연구원C', date: '24.05.31', views: 190, likes: 35 },
    { id: 102, category: '오류 해결 경험', title: 'HikariCP connection timeout 해결법', author: '서버관리자D', date: '24.05.31', views: 110, likes: 15 },
  ];

  return (
    <div className="post-table-container">
      <table className="post-table">
        <thead>
          <tr>
            <th className="col-id">번호</th>
            <th className="col-category">분류</th>
            <th className="col-title">제목</th>
            <th className="col-author">글쓴이</th>
            <th className="col-date">날짜</th>
            <th className="col-views">조회</th>
            <th className="col-likes">추천</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="col-id">{post.id}</td>
              <td className="col-category">{post.category}</td>
              <td className="col-title">{post.title}</td>
              <td className="col-author">
                <div className="author-info">
                  <div className="avatar-placeholder"></div>
                  {post.author}
                </div>
              </td>
              <td className="col-date">{post.date}</td>
              <td className="col-views">{post.views}</td>
              <td className="col-likes">{post.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <span className="page-item active">[cite: 1]</span>
        <span className="page-item">[cite: 2]</span>
        <span className="page-item">[cite: 3]</span>
        <span className="page-ellipsis">...</span>
        <span className="page-next">[Next]</span>
      </div>
    </div>
  );
}

export default PostTable;
