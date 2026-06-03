import { Link } from "react-router-dom";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

function LabPreviewList({ projects, showFeedback = false }) {
  if (!projects?.length) {
    return <p className="dashboard-empty">표시할 프로젝트가 없습니다.</p>;
  }

  return (
    <ul className="preview-list preview-list--compact">
      {projects.map((project) => (
        <li key={project.id} className="preview-list__item">
          <Link to={`/lab/${project.id}`} className="preview-list__link">
            <span className="preview-list__title">{project.title}</span>
            <span className="preview-list__preview">{project.summary}</span>
            <span className="preview-list__meta">
              {project.author?.name}
              {showFeedback ? (
                <> · 피드백 {project.feedbackCount} · ★ {project.avgOverallScore}</>
              ) : (
                <> · ♥ {project.likeCount} · 조회 {project.viewCount}</>
              )}
              {" · "}
              {formatDate(project.createdAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default LabPreviewList;
