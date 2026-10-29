
import { useState } from "react";
import "./Sidebar.css";

function Sidebar({ activePage = "Dashboard", onNavigate, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: "▦" },
    { label: "Transactions", icon: "⇄" },
    { label: "Users", icon: "♙" },
    { label: "Agents", icon: "♧" },
    { label: "Reports", icon: "▤" },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };

  return (
    <aside className="sidebar">
      {/* SIDEBAR MENU */}
      <nav className="sidebar-menu" aria-label="Sidebar navigation">
        {menuItems.map((item) => (
          <div className="menu-item" key={item.label}>
            <span className="menu-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="menu-label">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* SETTINGS + LOGOUT */}
      <div className="sidebar-bottom-actions">
        {/* SETTINGS */}
        <button
          type="button"
          className={`menu-item ${
            activePage === "Settings" ? "active" : ""
          }`}
          onClick={() => onNavigate?.("Settings")}
          aria-current={activePage === "Settings" ? "page" : undefined}
        >
          <span className="menu-icon" aria-hidden="true">⚙</span>
  <span className="menu-label">Settings</span>

          {activePage === "Settings" && (
            <span className="menu-active-indicator" />
          )}
        </button>

        {/* LOGOUT */}
        <div className="sidebar-logout-wrapper">
          <button
            type="button"
            className="sidebar-logout"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <span aria-hidden="true">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-icon">⚠️</div>

            <h2>Confirm Logout</h2>

            <p>
              Are you sure you want to logout from your ManthanPay account?
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-danger"
                onClick={handleLogoutConfirm}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
