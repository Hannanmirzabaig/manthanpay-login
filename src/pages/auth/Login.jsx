
import { useState } from "react";
import "../../Login.css";
import { apiRequest } from "../../services/api";
import VerifyLoginOtp from "./VerifyLoginOtp";

export default function Login({ onLogin, onForgotPassword }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("Admin");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: {
          identifier: username.trim(),
          password,
          role: loginRole === "Super Admin" ? "SUPER_ADMIN" : "ADMIN",
        },
      });

      setPendingEmail(username.trim());
      setMessage(response?.message || "OTP sent successfully.");
      setShowOtpVerification(true);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (otp) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await apiRequest("/api/auth/verify-login-otp", {
        method: "POST",
        body: {
          identifier: pendingEmail,
          otp,
        },
      });

      if (!response?.token) {
        throw new Error("Authentication token not received.");
      }

      localStorage.setItem("manthanpayAuthToken", response.token);
      localStorage.setItem("manthanpayLoggedInUser", response.fullName || "");
      localStorage.setItem(
        "manthanpayLoggedInEmail",
        response.email || pendingEmail
      );
      localStorage.setItem("manthanpayLoggedInRole", response.role || "");
      localStorage.setItem("manthanpayUserId", response.id || "");

      onLogin();
    } catch (err) {
      setError(err.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowOtpVerification(false);
    setError("");
    setMessage("");
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    onForgotPassword?.();
  };

  return (
    <main className="login-page">
      {/* Background */}
      <div className="login-bg-decoration">
        <div className="bg-circle bg-circle-one"></div>
        <div className="bg-circle bg-circle-two"></div>
        <div className="bg-circle bg-circle-three"></div>

        <div className="floating-text floating-text-one">SECURE PAYMENTS</div>
        <div className="floating-text floating-text-two">SMART BANKING</div>
        <div className="floating-text floating-text-three">INSTANT TRANSFERS</div>
        <div className="floating-text floating-text-four">DIGITAL FINANCE</div>
        <div className="floating-text floating-text-five">TRUSTED TRANSACTIONS</div>

        <div className="background-watermark">MANTHANPAY</div>

        {/* India Map - Right Side */}
        <div className="digital-india">
          <div className="india-map-wrap">
            <img
              src="/india-map.avif"
              alt="Map of India"
              className="india-map"
            />

            <div className="india-map-scan"></div>

            <div className="india-map-points">
              <span className="point point-one"></span>
              <span className="point point-two"></span>
              <span className="point point-three"></span>
              <span className="point point-four"></span>
              <span className="point point-five"></span>
              <span className="point point-six"></span>
            </div>
          </div>

          <div className="india-label">DIGITAL INDIA</div>
          <div className="india-sub-label">
            CONNECTING INDIA THROUGH DIGITAL PAYMENTS
          </div>
        </div>

        {/* Background Finance Visuals */}
        <div className="finance-visuals">
          <div className="finance-orbit orbit-one"></div>
          <div className="finance-orbit orbit-two"></div>
          <div className="network-lines"></div>

          <div className="extra-floating-text extra-text-one">
            INSTANT PAYMENTS
          </div>
          <div className="extra-floating-text extra-text-two">
            BANKING MADE SIMPLE
          </div>
          <div className="extra-floating-text extra-text-three">
            POWERING DIGITAL INDIA
          </div>
        </div>
      </div>

      {/* Logo */}
      <header className="login-header">
        <img
          src="/manthanpay-logo.png"
          alt="ManthanPay"
          className="login-logo"
        />
      </header>

      {/* Left Side Slogan */}
      <div className="login-background-content">
        <span>THE FUTURE OF DIGITAL PAYMENTS</span>

        <h1>
          Smarter Payments
          <br />
          <strong>Stronger Business</strong>
        </h1>

        <p>
          One powerful platform to manage your payments,
          transactions and business operations.
        </p>

        <div className="slogan-line"></div>
      </div>

      {/* Center Login Area */}
      <section className="login-center">
       

        {showOtpVerification ? (
          <div className="login-card otp-card">
            <VerifyLoginOtp
              email={pendingEmail}
              onVerify={handleVerifyLoginOtp}
              onBack={handleBackToLogin}
              isLoading={loading}
              error={error}
              message={message}
            />
          </div>
        ) : (
          <div className="login-card">
            <div className="login-heading">
              <h2>Sign In</h2>
              <p>Access your ManthanPay account</p>
            </div>

            {message && (
              <div className="login-message success-message">
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="loginRole">User type</label>
                <div className="input-wrapper">
                  <select
                    id="loginRole"
                    value={loginRole}
                    onChange={(event) => setLoginRole(event.target.value)}
                    required
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Email Address / Contact</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter email or contact"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Password</label>

                <div className="input-wrapper password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 5.2A11 11 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.3 3.1" />
                        <path d="M6.2 6.2C3.8 7.7 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.3 0 2.5-.3 3.6-.8" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="forgot-password-row">
                  {error && (
                    <p className="login-inline-error" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Please wait..." : "Sign In"}
                {!loading }
              </button>

              <div className="forgot-password-row">
                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot Password? <span>Click here</span> to Reset.
                </button>
              </div>
            </form>

            <div className="login-bottom">
              Secure access powered by ManthanPay
            </div>
          </div>
        )}
      </section>

      {/* Footer - Preserved */}
      <footer className="login-footer">
        <div className="footer-item">
          <span className="footer-icon">☎</span>
          <span>Call Us:</span>
          <a href="tel:+918920980000">+91 8920980000</a>
        </div>

        <span className="footer-divider"></span>

        <div className="footer-item">
          <span className="footer-icon">✉</span>
          <span>Write Us:</span>
          <a href="mailto:support@manthanpay.com">
            support@manthanpay.com
          </a>
        </div>

        <span className="footer-divider"></span>

        <div className="footer-item">
          © {new Date().getFullYear()} ManthanPay. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
