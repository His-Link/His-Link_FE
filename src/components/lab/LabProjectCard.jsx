import { Link } from "react-router-dom";
import { formatDate, formatScore, initials } from "utils/format";
import "styles/LabProjectCard.css";

const ACCENTS = ["#5d87ff", "#48c6ef", "#6366f1", "#14b8a6", "#ec4899"];

function LabProjectCard({ project, accentIndex = 0, sortMode = "LATEST" }) {
  const accent = ACCENTS[accentIndex % ACCENTS.length];

  return (
    <article className="lab-card">
      <div className="lab-card__top">
        {(project.thumbnailUrl || project.images?.[0]?.url) ? (
          <img
            src={project.thumbnailUrl || project.images[0].url}
            alt=""
            className="lab-card__thumb"
          />
        ) : (
          <span
            className="lab-card__icon"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
            aria-hidden="true"
          >
            {initials(project.author?.name)}
          </span>
        )}
        <div className="lab-card__badges">
          {sortMode === "FEEDBACK" && (
            <span className="lab-card__badge">피드백 {project.feedbackCount}</span>
          )}
          {project.avgOverallScore != null && (
            <span className="lab-card__badge lab-card__badge--score">
              ★ {formatScore(project.avgOverallScore)}
            </span>
          )}
        </div>
      </div>
      <Link to={`/lab/${project.id}`} className="lab-card__link">
        <h3 className="lab-card__title">{project.title}</h3>
        <p className="lab-card__summary">{project.summary}</p>
        <div className="lab-card__meta">
          <span>{project.author?.name}</span>
          <span aria-hidden="true">·</span>
          <span>조회 {project.viewCount}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </Link>
    </article>
  );
}

export default LabProjectCard;
