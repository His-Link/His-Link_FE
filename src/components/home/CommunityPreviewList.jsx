import { Link } from "react-router-dom";
import { POST_CATEGORY_LABEL } from "constants/postCategory";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

function CommunityPreviewList({ posts }) {
  if (!posts?.length) {
    return <p className="dashboard-empty">아직 게시글이 없습니다.</p>;
  }

  return (
    <ul className="preview-list">
      {posts.map((post) => (
        <li key={post.id} className="preview-list__item">
          <Link to={`/community/${post.id}`} className="preview-list__link">
            <span className="preview-list__badge">
              {POST_CATEGORY_LABEL[post.category] || post.category}
            </span>
            <span className="preview-list__title">{post.title}</span>
            <span className="preview-list__meta">
              {post.author?.name} · 조회 {post.viewCount} · ♥ {post.likeCount} ·{" "}
              {formatDate(post.createdAt)}
            </span>
            <span className="preview-list__preview">{post.contentPreview}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default CommunityPreviewList;
