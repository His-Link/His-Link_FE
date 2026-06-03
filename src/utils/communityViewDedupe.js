import { shouldIncrementDetailView } from "utils/detailViewDedupe";

export function shouldIncrementCommunityView(postId) {
  return shouldIncrementDetailView("community", postId);
}
