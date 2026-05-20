import { Link } from "react-router-dom";

function DashboardCard({ title, subtitle, actionLabel, actionTo, children, className = "" }) {
  return (
    <article className={`dashboard-card ${className}`.trim()}>
      <header className="dashboard-card__header">
        <div>
          <h3 className="dashboard-card__title">{title}</h3>
          {subtitle ? <p className="dashboard-card__subtitle">{subtitle}</p> : null}
        </div>
        {actionTo ? (
          <Link to={actionTo} className="dashboard-card__action">
            {actionLabel}
          </Link>
        ) : null}
      </header>
      <div className="dashboard-card__body">{children}</div>
    </article>
  );
}

export default DashboardCard;
