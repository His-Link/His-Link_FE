import { Link } from "react-router-dom";
import { POST_CATEGORIES } from "constants/postCategory";
import "styles/CommunityPage.css";

function PostFilters({ category, onCategoryChange, isAuthenticated }) {
  return (
    <div className="post-filters-container">
      <div className="post-filters__categories" role="tablist" aria-label="카테고리">
        {POST_CATEGORIES.map((item) => (
          <button
            key={item.value || "all"}
            type="button"
            role="tab"
            aria-selected={category === item.value}
            className={`category-btn${category === item.value ? " active" : ""}`}
            onClick={() => onCategoryChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="post-filters__actions">
        {isAuthenticated ? (
          <Link to="/community/new" className="write-btn">
            <span className="write-icon" aria-hidden="true">
              ✎
            </span>{" "}
            글쓰기
          </Link>
        ) : (
          <Link to="/login" className="write-btn">
            <span className="write-icon" aria-hidden="true">
              ✎
            </span>{" "}
            로그인 후 작성
          </Link>
        )}
      </div>
    </div>
  );
}

export default PostFilters;
