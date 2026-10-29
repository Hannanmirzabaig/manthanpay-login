import "./StatCard.css";
function StatCard({ title, value, change, icon, index = 0 }) {
  const cardTypes = ["blue", "violet", "green", "orange"];

  const cardColor = cardTypes[index % cardTypes.length];

  return (
    <article className={`stat-card stat-card-${cardColor}`}>
      <div className="stat-card-top">
        <span className="stat-title">{title}</span>

        <span className={`stat-icon ${cardColor}`} aria-hidden="true">
          {icon}
        </span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-footer">
        <span className="stat-change">
          {change || "—"}
        </span>

        <span className="stat-period">vs. last month</span>
      </div>
    </article>
  );
}

export default StatCard;
