
import { useState } from "react";
import "../ForgotPassword.css";

const API_BASE_URL = "http://localhost:8080/api/auth";

const apiRequest = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      `Request failed (${response.status})`
    );
  }

  return data;
};

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSendTemporaryPassword = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/forgot-password", {
        email: email.trim(),
      });

      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      {/* BACKGROUND ANIMATIONS */}
      <div className="forgot-bg-decoration">
        <div className="forgot-circle circle-one"></div>
        <div className="forgot-circle circle-two"></div>
        <div className="forgot-circle circle-three"></div>

        <div className="forgot-finance-visuals">

          <div className="forgot-finance-chip chip-one">
            <span className="forgot-visual-icon">₹</span>
            <div>
              <strong>Digital Payments</strong>
              <small>Fast & Secure</small>
            </div>
          </div>

          <div className="forgot-finance-chip chip-two">
            <span className="forgot-visual-icon">✓</span>
            <div>
              <strong>Secure Banking</strong>
              <small>Protected Transactions</small>
            </div>
          </div>

          <div className="forgot-finance-chip chip-three">
            <span className="forgot-visual-icon">↗</span>
            <div>
              <strong>Smart Business</strong>
              <small>Growth Made Simple</small>
            </div>
          </div>

          <div className="forgot-orbit orbit-one"></div>
          <div className="forgot-orbit orbit-two"></div>

          <div className="forgot-floating-text text-one">
            INSTANT PAYMENTS
          </div>

          <div className="forgot-floating-text text-two">
            BANKING MADE SIMPLE
          </div>

          <div className="forgot-floating-text text-three">
            POWERING DIGITAL INDIA
          </div>

        </div>
      </div>

      {/* LOGO */}
     <header className="login-header">
  <img
    src="/manthanpay-logo.png"
    alt="ManthanPay"
    className="login-logo"
  />
</header>

      {/* MAIN CONTAINER */}
      <div className="forgot-card">

        <div className="forgot-heading">
          <div className="forgot-icon">🔐</div>

          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address.
            We will send you a password to your email.
          </p>
        </div>

        <form onSubmit={handleSendTemporaryPassword}>

          <div className="forgot-field">

            <label>Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your registered email"
              autoComplete="email"
              required
            />

            {/* SIMPLE ERROR TEXT */}
            {error && (
              <p className="forgot-error-line" role="alert">
                {error}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="forgot-submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Password"}
          </button>

        </form>

        {/* BACK TO LOGIN */}
        <div className="forgot-footer">
          <button
            type="button"
            onClick={onBackToLogin}
          >
            ← Back to Login
          </button>
        </div>

        {/* COPYRIGHT */}
        <div className="forgot-bottom">
          © {new Date().getFullYear()} ManthanPay. All rights reserved.
        </div>

      </div>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="forgot-popup-overlay">

          <div
            className="forgot-success-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-success-title"
          >

            <div className="forgot-popup-success-icon">
              ✓
            </div>

            <h2 id="password-success-title">
              Password Sent Successfully!
            </h2>

            <p>
              Your password has been sent to your registered
              email address. Please check your inbox.
            </p>

            <button
              type="button"
              className="forgot-submit"
              onClick={onBackToLogin}
            >
              Go to Login
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ForgotPassword;
