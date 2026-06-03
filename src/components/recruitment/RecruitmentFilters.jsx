import { Link } from "react-router-dom";
import { RECRUITMENT_ACTIVITY_TYPES } from "constants/recruitmentActivityType";
import { RECRUITMENT_ROLES, RECRUITMENT_STATUS_OPTIONS } from "constants/recruitmentRole";
import "styles/RecruitmentPage.css";

function RecruitmentFilters({
  activityType,
  role,
  status,
  techStack,
  techStacks,
  onActivityTypeChange,
  onRoleChange,
  onStatusChange,
  onTechStackChange,
  isAuthenticated,
}) {
  return (
    <div className="recruitment-toolbar">
      <div className="recruitment-toolbar__filters">
        <select
          className="recruitment-select"
          value={activityType}
          onChange={(e) => onActivityTypeChange(e.target.value)}
          aria-label="활동 유형 필터"
        >
          {RECRUITMENT_ACTIVITY_TYPES.map((item) => (
            <option key={item.value || "all-activity"} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          className="recruitment-select"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          aria-label="역할 필터"
        >
          {RECRUITMENT_ROLES.map((item) => (
            <option key={item.value || "all"} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          className="recruitment-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="상태 필터"
        >
          {RECRUITMENT_STATUS_OPTIONS.map((item) => (
            <option key={item.value || "all"} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          className="recruitment-select"
          value={techStack}
          onChange={(e) => onTechStackChange(e.target.value)}
          aria-label="기술 스택 필터"
        >
          <option value="">전체 기술 스택</option>
          {techStacks.map((stack) => (
            <option key={stack.id} value={stack.name}>
              {stack.name}
            </option>
          ))}
        </select>
      </div>

      <div className="recruitment-toolbar__actions">
        {isAuthenticated ? (
          <Link to="/recruitment/new" className="recruitment-btn recruitment-btn--primary">
            모집글 작성
          </Link>
        ) : (
          <Link to="/login" className="recruitment-btn recruitment-btn--primary">
            로그인 후 작성
          </Link>
        )}
      </div>
    </div>
  );
}

export default RecruitmentFilters;
