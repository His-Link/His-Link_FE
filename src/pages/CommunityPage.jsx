import React from "react";
import CommunityBanner from "components/community/CommunityBanner";
import PostFilters from "components/community/PostFilters";
import PostTable from "components/community/PostTable";
import CommunitySidebar from "components/community/CommunitySidebar";
import "styles/CommunityPage.css";

function CommunityPage() {
  return (
    <div className="community-page-container">
      <CommunityBanner />
      <div className="community-content-layout">
        <main className="community-main">
          <PostFilters />
          <PostTable />
        </main>
        <aside>
          <CommunitySidebar />
        </aside>
      </div>
    </div>
  );
}

export default CommunityPage;
