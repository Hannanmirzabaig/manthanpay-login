import "./NavigationCard.css";

function NavigationCard({ title, description, icon, onClick }) {
  return (
    <button
      type="button"
      className="navigation-card"
      onClick={onClick}
    >
      <div className="navigation-card-top">
        <div className="navigation-card-icon">
          {icon}
        </div>

        <span className="navigation-card-arrow">↗</span>
      </div>

      <div className="navigation-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="navigation-card-footer">
        <span>View Details</span>
        <span>→</span>
      </div>
    </button>
  );
}

export default NavigationCard;