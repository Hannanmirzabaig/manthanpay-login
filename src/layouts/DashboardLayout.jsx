
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

function DashboardLayout({
  children,
  activePage,
  onNavigate,
  onLogout,
}) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const userName =
    localStorage.getItem("manthanpayLoggedInUser") || "Admin User";

  const userId =
    localStorage.getItem("manthanpayUserId") || "—";

  const initials = userName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = currentDateTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="dashboard-layout">
      {/* TOP HEADER */}
      <header className="app-topbar">
        <div className="app-topbar-left">
          <img
            src="/manthanpay-logo.png"
            alt="ManthanPay"
            className="app-topbar-logo"
          />

          {/* LIVE DATE AND TIME */}
          <div className="app-topbar-datetime">
            <strong>{formattedTime}</strong>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="app-topbar-user">
          <div className="app-topbar-user-details">
            <strong>{userName}</strong>
            <span>ID: {userId}</span>
          </div>

          <div className="app-topbar-avatar">
            {initials || "A"}
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
