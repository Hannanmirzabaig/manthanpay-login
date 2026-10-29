
import { useState } from "react";
import "../SettingsPage.css";

const API_BASE_URL = "http://localhost:8080/api/auth";

// JWT Token
const getAuthToken = () => {
  return (
    localStorage.getItem("manthanpayAuthToken")
  );
};

// Safely read logged-in user
const getStoredUser = () => {
  const rawUser = localStorage.getItem("manthanpayLoggedInUser");

  if (!rawUser) return {};

  try {
    const parsedUser = JSON.parse(rawUser);

    if (parsedUser && typeof parsedUser === "object") {
      return parsedUser;
    }

    return { fullName: String(parsedUser) };
  } catch {
    return { fullName: rawUser };
  }
};

// Common API Request
const apiRequest = async (endpoint, body, authenticated = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Token only for authenticated APIs
  if (authenticated) {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Login session expired. Please login again.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || data.message || `Request failed (${response.status})`
    );
  }

  return data;
};

function SettingsPage({ onLogout }) {
  const storedUser = getStoredUser();

  const [activeSection, setActiveSection] = useState("profile");

  // Profile
  const [profile, setProfile] = useState({
    fullName: storedUser.fullName || storedUser.name || "",
    email: localStorage.getItem("manthanpayLoggedInEmail") || "",
    contact: localStorage.getItem("manthanpayLoggedInContact") || "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Security
  const [securityMode, setSecurityMode] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    promotionalEmails: false,
  });

  // Logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Accordion
  const toggleSection = (section) => {
    setActiveSection((previous) =>
      previous === section ? "" : section
    );
  };

  // Profile
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSave = (event) => {
    event.preventDefault();

    setProfileMessage(
      "Profile editing is currently local only. Backend profile API is not connected."
    );

    setIsEditingProfile(false);
  };

  // Security helpers
  const resetSecurityMessages = () => {
    setSecurityMessage("");
    setSecurityError("");
  };

  const openSecurityMode = (mode) => {
    setSecurityMode(mode);
    resetSecurityMessages();

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");

    if (mode === "forgot") {
      setResetEmail("");
    }
  };

  const validateNewPassword = () => {
    if (!newPassword || !confirmPassword) {
      setSecurityError("Please fill both password fields.");
      return false;
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      setSecurityError("Password must contain 8 to 72 characters.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError(
        "New password and confirm password do not match."
      );
      return false;
    }

    return true;
  };

  // 1. CHANGE PASSWORD
  // JWT REQUIRED
  const handleChangePassword = async (event) => {
    event.preventDefault();
    resetSecurityMessages();

    if (!currentPassword) {
      setSecurityError("Please enter your current password.");
      return;
    }

    if (!validateNewPassword()) {
      return;
    }

    try {
      setSecurityLoading(true);

      const response = await apiRequest(
            "/change-password",
  {
    currentPassword: currentPassword,
    newPassword: newPassword,
    newPasswordConfirm: confirmPassword
  },
  true // JWT TOKEN REQUIRED
      );

      setSecurityMessage(
        response.message || "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setSecurityError(error.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  // 2. FORGOT PASSWORD
  // JWT NOT REQUIRED
  const handleForgotPassword = async (event) => {
    event.preventDefault();
    resetSecurityMessages();

    if (!resetEmail.trim()) {
      setSecurityError("Please enter your registered email.");
      return;
    }

    try {
      setSecurityLoading(true);

      const response = await apiRequest(
        "/forgot-password",
        {
          email: resetEmail.trim(),
        },
        false // NO JWT TOKEN
      );

      setSecurityMessage(
        response.message || "Password reset OTP sent to your email."
      );
    } catch (error) {
      setSecurityError(error.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  // 3. RESET PASSWORD
  // JWT NOT REQUIRED
  const handleResetPassword = async (event) => {
    event.preventDefault();
    resetSecurityMessages();

    if (!resetEmail.trim()) {
      setSecurityError("Please enter your email.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setSecurityError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!validateNewPassword()) {
      return;
    }

    try {
      setSecurityLoading(true);

      const response = await apiRequest(
        "/reset-password",
        {
          email: resetEmail.trim(),
          otp,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        },
        false // NO JWT TOKEN
      );

      setSecurityMessage(
        response.message || "Password reset successfully."
      );

      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setSecurityMode("");
    } catch (error) {
      setSecurityError(error.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  // Notifications
  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setNotifications((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  // Logout
  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };

  const sections = [
    {
      id: "profile",
      icon: "👤",
      title: "Profile Settings",
      description: "Manage your personal account information",
    },
    {
      id: "security",
      icon: "🔒",
      title: "Security Settings",
      description: "Change password and manage account security",
    },
    {
      id: "notifications",
      icon: "🔔",
      title: "Notification Settings",
      description: "Manage your notification preferences",
    },
    {
      id: "preferences",
      icon: "⚙️",
      title: "Preferences",
      description: "Customize your dashboard experience",
    },
    {
      id: "business",
      icon: "🏢",
      title: "Business Information",
      description: "View business and support information",
    },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account settings and preferences.</p>
        </div>
      </div>

      {/* Settings Accordion */}
      {sections.map((section) => (
        <div className="settings-card" key={section.id}>
          <button
            type="button"
            className="settings-card-content"
            onClick={() => toggleSection(section.id)}
          >
            <span className="settings-card-icon">{section.icon}</span>

            <span>
              <strong>{section.title}</strong>
              <small>{section.description}</small>
            </span>

            <span className="settings-arrow">
              {activeSection === section.id ? "▲" : "▼"}
            </span>
          </button>

          {activeSection === section.id && (
            <div className="settings-panel">

              {/* PROFILE */}
              {section.id === "profile" && (
                <>
                  <div className="profile-header-row">
                    <div className="profile-avatar-large">
                      {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <h3>{profile.fullName || "User"}</h3>
                      <p className="profile-email">{profile.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSave}>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                        />
                      </div>

                      <div className="form-field">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                        />
                      </div>

                      <div className="form-field">
                        <label>Contact Number</label>
                        <input
                          type="text"
                          value={profile.contact}
                          disabled
                        />
                      </div>
                    </div>

                    {profileMessage && (
                      <p className="message success">{profileMessage}</p>
                    )}

                    <div className="form-actions">
                      {!isEditingProfile ? (
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            setProfileMessage("");
                            setIsEditingProfile(true);
                          }}
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <>
                          <button type="submit" className="btn-primary">
                            Save Changes
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              setIsEditingProfile(false);
                              setProfileMessage("");
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </>
              )}

              {/* SECURITY */}
              {section.id === "security" && (
                <div className="security-options">
                  {!securityMode && (
                    <>
                      <button
                        type="button"
                        className="security-option"
                        onClick={() => openSecurityMode("change")}
                      >
                        <div>
                          <strong>Change Password</strong>
                          <p>Update your current account password.</p>
                        </div>
                        <span>→</span>
                      </button>

                      <button
                        type="button"
                        className="security-option"
                        onClick={() => openSecurityMode("forgot")}
                      >
                        <div>
                          <strong>Forgot Password</strong>
                          <p>Reset your password using email OTP.</p>
                        </div>
                        <span>→</span>
                      </button>
                    </>
                  )}

                  {/* CHANGE PASSWORD FORM */}
                  {securityMode === "change" && (
                    <form
                      className="security-form"
                      onSubmit={handleChangePassword}
                    >
                      <h3>Change Password</h3>

                      <div className="form-field">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) =>
                            setCurrentPassword(e.target.value)
                          }
                          required
                          autoComplete="current-password"
                        />
                      </div>

                      <div className="form-field">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                          maxLength={72}
                          autoComplete="new-password"
                        />
                      </div>

                      <div className="form-field">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          required
                          autoComplete="new-password"
                        />
                      </div>

                      {securityError && (
                        <p className="message error">{securityError}</p>
                      )}

                      {securityMessage && (
                        <p className="message success">
                          {securityMessage}
                        </p>
                      )}

                      <div className="form-actions">
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={securityLoading}
                        >
                          {securityLoading
                            ? "Updating..."
                            : "Update Password"}
                        </button>

                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            setSecurityMode("");
                            resetSecurityMessages();
                          }}
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  )}

                  {/* FORGOT AND RESET PASSWORD FORM */}
                  {securityMode === "forgot" && (
                    <div className="security-form">
                      <h3>Forgot Password</h3>

                      <form onSubmit={handleForgotPassword}>
                        <div className="form-field">
                          <label>Registered Email</label>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-actions">
                          <button
                            type="submit"
                            className="btn-primary"
                            disabled={securityLoading}
                          >
                            {securityLoading ? "Sending..." : "Send OTP"}
                          </button>
                        </div>
                      </form>

                      <div className="divider"></div>

                      <form onSubmit={handleResetPassword}>
                        <div className="form-field">
                          <label>6-Digit OTP</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) =>
                              setOtp(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="Enter email OTP"
                            required
                          />
                        </div>

                        <div className="form-field">
                          <label>New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            maxLength={72}
                            autoComplete="new-password"
                          />
                        </div>

                        <div className="form-field">
                          <label>Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                              setConfirmPassword(e.target.value)
                            }
                            required
                            autoComplete="new-password"
                          />
                        </div>

                        {securityError && (
                          <p className="message error">{securityError}</p>
                        )}

                        {securityMessage && (
                          <p className="message success">
                            {securityMessage}
                          </p>
                        )}

                        <div className="form-actions">
                          <button
                            type="submit"
                            className="btn-primary"
                            disabled={securityLoading}
                          >
                            {securityLoading
                              ? "Resetting..."
                              : "Reset Password"}
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              setSecurityMode("");
                              resetSecurityMessages();
                            }}
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* NOTIFICATIONS */}
              {section.id === "notifications" && (
                <>
                  <div className="toggle-list">
                    <label className="toggle-item">
                      <span>
                        <strong>Email Notifications</strong>
                        <small>Receive account updates through email.</small>
                      </span>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notifications.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                    </label>

                    <label className="toggle-item">
                      <span>
                        <strong>Transaction Alerts</strong>
                        <small>Get notified about transaction activity.</small>
                      </span>
                      <input
                        type="checkbox"
                        name="transactionAlerts"
                        checked={notifications.transactionAlerts}
                        onChange={handleNotificationChange}
                      />
                    </label>

                    <label className="toggle-item">
                      <span>
                        <strong>Security Alerts</strong>
                        <small>Receive important security notifications.</small>
                      </span>
                      <input
                        type="checkbox"
                        name="securityAlerts"
                        checked={notifications.securityAlerts}
                        onChange={handleNotificationChange}
                      />
                    </label>

                    <label className="toggle-item">
                      <span>
                        <strong>Promotional Emails</strong>
                        <small>Receive product and promotional updates.</small>
                      </span>
                      <input
                        type="checkbox"
                        name="promotionalEmails"
                        checked={notifications.promotionalEmails}
                        onChange={handleNotificationChange}
                      />
                    </label>
                  </div>

                  <p className="hint">
                    Notification preferences are currently stored only in
                    this page's state. Backend persistence is not connected.
                  </p>
                </>
              )}

              {/* PREFERENCES */}
              {section.id === "preferences" && (
                <div className="form-grid">
                  <div className="form-field">
                    <label>Language</label>
                    <select defaultValue="English">
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Time Zone</label>
                    <select defaultValue="Asia/Kolkata">
                      <option value="Asia/Kolkata">
                        India Standard Time (IST)
                      </option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Date Format</label>
                    <select defaultValue="DD/MM/YYYY">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <p className="hint">
                    Preferences are currently UI-only and are not saved to
                    the backend.
                  </p>
                </div>
              )}

              {/* BUSINESS INFORMATION */}
              {section.id === "business" && (
                <div className="info-grid">
                  <div>
                    <span className="info-label">Business Name</span>
                    <strong>ManthanPay</strong>
                  </div>

                  <div>
                    <span className="info-label">Application</span>
                    <strong>ManthanPay Admin Panel</strong>
                  </div>

                  <div>
                    <span className="info-label">Support Email</span>
                    <strong>support@manthanpay.com</strong>
                  </div>

                  <p className="hint">
                    Verify support contact details with your business team
                    before using them in production.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* LOGOUT */}
      <div className="settings-logout-section">
        <div>
          <h3>Logout</h3>
          <p>Sign out from your ManthanPay admin account.</p>
        </div>

        <button
          type="button"
          className="btn-logout"
          onClick={() => setShowLogoutConfirm(true)}
        >
          Logout
        </button>
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
    </div>
  );
}

export default SettingsPage;
