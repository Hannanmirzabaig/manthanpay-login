
import "./DashboardCards.css";

const dashboardCards = [
  {
    title: "Overview",
    description: "Complete business performance at a glance.",
    icon: "📊",
    color: "blue",
    page: "Dashboard",
  },
  {
    title: "Agents",
    description: "View and manage all registered agents.",
    icon: "👥",
    color: "purple",
    page: "Agents",
  },
  {
    title: "Users",
    description: "View and manage registered customers.",
    icon: "👤",
    color: "green",
    page: "Users",
  },
  {
    title: "Transactions",
    description: "Monitor all payment transactions.",
    icon: "💳",
    color: "orange",
    page: "Transactions",
  },
  {
    title: "Reports",
    description: "View and manage business reports.",
    icon: "📄",
    color: "teal",
    page: "Reports",
  },
  {
    title: "Money Transfer",
    description: "Manage money transfer operations.",
    icon: "💸",
    color: "pink",
    page: "Money Transfer",
  },
  {
    title: "Refundable",
    description: "View and manage refund requests.",
    icon: "↩️",
    color: "red",
    page: "Refundable",
  },
];

function DashboardCards({ onNavigate }) {
  return (
    <section className="dashboard-cards-section">
      <div className="dashboard-cards-heading">
      </div>

      <div className="dashboard-cards-grid">
        {dashboardCards.map((card) => (
          <button
            type="button"
            className="dashboard-navigation-card"
            key={card.title}
            onClick={() => onNavigate(card.page)}
          >
            <div className="dashboard-navigation-card-top">
              <div className={`dashboard-navigation-icon ${card.color}`}>
                {card.icon}
              </div>

              <span className="dashboard-navigation-arrow">↗</span>
            </div>

            <div className="dashboard-navigation-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>

            <div className="dashboard-navigation-footer">
              <span>View Details</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default DashboardCards;
