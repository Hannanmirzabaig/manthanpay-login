
import { useState } from "react";
import "../../Login.css";

function VerifyLoginOtp({
  email,
  onVerify,
  onBack,
  onResend,
  isLoading = false,
  error = "",
  message = "",
}) {
  const [otp, setOtp] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (otp.length !== 6 || isLoading) {
      return;
    }

    onVerify(otp.trim());
  }

  return (
    <div className="otp-verification-content">

      <h2>Verify Login OTP</h2>

      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="success-message">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          id="login-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(event) =>
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          className="login-button"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      {onResend && (
        <button
          type="button"
          className="otp-resend-button"
          onClick={onResend}
          disabled={isLoading}
        >
          Resend OTP
        </button>
      )}

      <button
        type="button"
        className="otp-back-button"
        onClick={onBack}
        disabled={isLoading}
      >
        Back to Login
      </button>

    </div>
  );
}

export default VerifyLoginOtp;
