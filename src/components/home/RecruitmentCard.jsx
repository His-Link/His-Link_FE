import { Link } from "react-router-dom";
import { RECRUITMENT_ACTIVITY_LABEL } from "constants/recruitmentActivityType";
import { RECRUITMENT_ROLE_LABEL } from "constants/recruitmentRole";
import "styles/RecruitmentCard.css";

const ACCENTS = ["#5d87ff", "#48c6ef", "#6366f1", "#ec4899", "#14b8a6"];

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}

function daysUntilDeadline(iso) {
  if (!iso) return null;
  const end = new Date(iso);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "마감";
  if (diff === 0) return "오늘 마감";
  return `D-${diff}`;
}

function RecruitmentCard({ post, accentIndex = 0 }) {
  const accent = ACCENTS[accentIndex % ACCENTS.length];
  const limit = post.participantLimit || 1;
  const current = post.currentCount ?? 0;
  const progress = Math.min(100, Math.round((current / limit) * 100));
  const dday = daysUntilDeadline(post.deadline);
  const roleLabel = RECRUITMENT_ROLE_LABEL[post.recruitmentRole] || post.recruitmentRole;
  const activityLabel =
    RECRUITMENT_ACTIVITY_LABEL[post.activityType] || post.activityType;
  const thumb = post.thumbnailUrl;

  return (
    <article className="recruitment-card">
      <div className="recruitment-card__top">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="recruitment-card__thumb"
          />
        ) : (
          <span
            className="recruitment-card__icon"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
            aria-hidden="true"
          >
            {initials(post.author?.name)}
          </span>
        )}
        <span className="recruitment-card__dday">{dday}</span>
      </div>
      <Link to={`/recruitment/${post.id}`} className="recruitment-card__link">
        <div className="recruitment-card__badges">
          {activityLabel && (
            <span className="recruitment-card__activity">{activityLabel}</span>
          )}
          <span className="recruitment-card__role">{roleLabel}</span>
        </div>
        <h3 className="recruitment-card__title">{post.title}</h3>
        <p className="recruitment-card__desc">
          {post.description || post.descriptionPreview || "상세 내용을 확인해 보세요."}
        </p>
        <div className="recruitment-card__progress-block">
          <div className="recruitment-card__progress-label">
            <span>모집 진행률</span>
            <span>
              {current} / {limit}명
            </span>
          </div>
          <div className="recruitment-card__bar-track">
            <div
              className="recruitment-card__bar-fill"
              style={{ width: `${progress}%`, background: accent }}
            />
          </div>
        </div>
        <div className="recruitment-card__footer">
          <span className="recruitment-card__author" title={post.author?.name}>
            {post.author?.name}
          </span>
          {post.status === "OPEN" ? (
            <span className="recruitment-card__status">모집중</span>
          ) : (
            <span className="recruitment-card__status recruitment-card__status--closed">마감</span>
          )}
        </div>
      </Link>
    </article>
  );
}

export default RecruitmentCard;
