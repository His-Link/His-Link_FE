import { Link } from "react-router-dom";
import { POST_CATEGORY_LABEL } from "constants/postCategory";
import { formatDate, initials } from "utils/format";
import "styles/CommunityPage.css";

function PostTable({ posts, loading, error, page, totalPages, onPageChange }) {
  if (loading) {
    return (
      <div className="post-table-container">
        <p className="community-muted">불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-table-container">
        <p className="community-form-error" role="alert">
          {error}
        </p>
      </div>
    );
  }

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
          {posts?.length ? (
            posts.map((post) => (
              <tr key={post.id}>
                <td className="col-id">{post.id}</td>
                <td className="col-category">
                  {POST_CATEGORY_LABEL[post.category] || post.category}
                </td>
                <td className="col-title">
                  <Link to={`/community/${post.id}`} className="post-table__title-link">
                    {post.title}
                    {post.commentCount > 0 && (
                      <span className="post-table__comment-count"> ({post.commentCount})</span>
                    )}
                  </Link>
                </td>
                <td className="col-author">
                  <div className="author-info">
                    <span className="avatar-placeholder" aria-hidden="true">
                      {initials(post.author?.name)}
                    </span>
                    {post.author?.name}
                  </div>
                </td>
                <td className="col-date">{formatDate(post.createdAt)}</td>
                <td className="col-views">{post.viewCount}</td>
                <td className="col-likes">{post.likeCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="post-table__empty">
                등록된 게시글이 없습니다. 첫 글을 작성해 보세요.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="페이지">
          <button
            type="button"
            className="page-nav"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
          >
            이전
          </button>
          <span className="page-info">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="page-nav"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            다음
          </button>
        </nav>
      )}
    </div>
  );
}

export default PostTable;
