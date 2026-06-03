import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { POST_CATEGORY_LABEL } from "constants/postCategory";
import { fetchLatestComments, fetchPopularPosts } from "services/communityService";
import { formatDate } from "utils/format";
import "styles/CommunityPage.css";

function CommunitySidebar() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [latestComments, setLatestComments] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    fetchPopularPosts(5)
      .then((data) => setPopularPosts(data.content || []))
      .catch(() => setPopularPosts([]))
      .finally(() => setLoadingPopular(false));
  }, []);

  useEffect(() => {
    fetchLatestComments(5)
      .then(setLatestComments)
      .catch(() => setLatestComments([]))
      .finally(() => setLoadingComments(false));
  }, []);

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
        {loadingPopular ? (
          <p className="community-muted">불러오는 중...</p>
        ) : popularPosts.length ? (
          <ul className="popular-posts-list">
            {popularPosts.map((post, index) => (
              <li key={post.id} className="popular-post-item">
                <div className="w-rank">{index + 1}</div>
                <div className="w-content">
                  <Link to={`/community/${post.id}`} className="w-post-title">
                    {post.title}
                  </Link>
                  <div className="w-author">
                    {POST_CATEGORY_LABEL[post.category] || post.category} · {post.author?.name}
                  </div>
                </div>
                <div className="w-stats">
                  <div className="w-stat-row">
                    <span>{post.viewCount}</span>
                  </div>
                  <div className="w-stat-row">
                    <span>{post.likeCount}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="community-muted">인기 글이 없습니다.</p>
        )}
      </div>

      <div className="sidebar-widget">
        <h3 className="widget-title">최신 댓글</h3>
        {loadingComments ? (
          <p className="community-muted">불러오는 중...</p>
        ) : latestComments.length ? (
          <ul className="latest-comments-list">
            {latestComments.map((comment) => (
              <li key={comment.id} className="latest-comment-item">
                <Link to={`/community/${comment.postId}`} className="latest-comment-item__post">
                  {comment.postTitle}
                </Link>
                <p className="latest-comment-item__content">{comment.contentPreview}</p>
                <p className="latest-comment-item__meta">
                  {comment.author?.name} · {formatDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="community-muted">최신 댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default CommunitySidebar;
