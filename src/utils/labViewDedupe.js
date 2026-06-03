import { shouldIncrementDetailView } from "utils/detailViewDedupe";

export function shouldIncrementLabView(projectId) {
  return shouldIncrementDetailView("lab", projectId);
}
