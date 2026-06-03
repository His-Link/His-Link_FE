import { useCallback, useEffect, useState } from "react";
import CommunityBanner from "components/community/CommunityBanner";
import CommunitySidebar from "components/community/CommunitySidebar";
import PostFilters from "components/community/PostFilters";
import PostTable from "components/community/PostTable";
import { useAuthValue } from "hooks/useAuth";
import { fetchPosts } from "services/communityService";
import "styles/CommunityPage.css";

function CommunityPage() {
  const { isAuthenticated } = useAuthValue();
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPosts({
        category: category || undefined,
        page,
        size: 20,
        sort: "createdAt,desc",
      });
      setData(result);
    } catch (err) {
      setError(err.message || "게시글 목록을 불러오지 못했습니다.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setPage(0);
  };

  return (
    <div className="community-page-container">
      <CommunityBanner />
      <div className="community-content-layout">
        <main className="community-main">
          <PostFilters
            category={category}
            onCategoryChange={handleCategoryChange}
            isAuthenticated={isAuthenticated}
          />
          <PostTable
            posts={data?.content}
            loading={loading}
            error={error}
            page={page}
            totalPages={data?.totalPages || 0}
            onPageChange={setPage}
          />
        </main>
        <aside>
          <CommunitySidebar />
        </aside>
      </div>
    </div>
  );
}

export default CommunityPage;
