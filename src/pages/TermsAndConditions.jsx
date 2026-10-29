
import "./TermsAndConditions.css";

export default function TermsAndConditions() {
  function handleBackToLogin() {
    window.location.href = "/login";
  }

  return (
    <div className="terms-page">

      <div className="terms-page-logo">
        <img  
         src="/manthanpay-logo.png"
         alt="ManthanPay Logo" />
      </div>

      {/* LOGIN PAGE BACKGROUND DECORATION */}
      <div className="terms-bg-decoration">
        <div className="terms-bg-circle terms-circle-one"></div>
        <div className="terms-bg-circle terms-circle-two"></div>
        <div className="terms-bg-circle terms-circle-three"></div>

        <div className="terms-finance-orbit terms-orbit-one"></div>
        <div className="terms-finance-orbit terms-orbit-two"></div>

        <div className="terms-floating-text terms-text-one">
          SECURE PAYMENTS
        </div>

        <div className="terms-floating-text terms-text-two">
          DIGITAL BANKING
        </div>

        <div className="terms-floating-text terms-text-three">
          SMART TRANSACTIONS
        </div>

        <div className="terms-watermark">
          MANTHANPAY
        </div>
      </div>

      <div className="terms-card">

        {/* HEADING */}
        <div className="terms-heading">
          {/* <div className="terms-icon">📄</div> */}

          <h1>Terms & Conditions</h1>

          <p>
            Please read the following terms carefully before
            accessing the ManthanPay Admin Panel.
          </p>
        </div>

        {/* TERMS CONTENT */}
        <div className="terms-content">

          <h3>1. Authorized Access</h3>
          <p>
            This admin panel is intended only for authorized
            ManthanPay administrators. Unauthorized access is prohibited.
          </p>

          <h3>2. Account Security</h3>
          <p>
            You are responsible for keeping your login credentials
            and OTP confidential. Never share your password or OTP.
          </p>

          <h3>3. Accurate Information</h3>
          <p>
            You must provide accurate information while accessing
            and using the admin panel.
          </p>

          <h3>4. Prohibited Activities</h3>
          <p>
            Unauthorized access, misuse of information, or suspicious
            activities are prohibited.
          </p>

          <h3>5. Privacy and Confidentiality</h3>
          <p>
            User and transaction information must be handled securely
            and confidentially.
          </p>

          <h3>6. Account Responsibility</h3>
          <p>
            Any activity performed through your authorized account
            is your responsibility.
          </p>

        </div>

        {/* BACK BUTTON */}
        <div className="terms-button-wrapper">
          <button
            type="button"
            className="terms-back-button"
            onClick={handleBackToLogin}
          >
            ← Back to Login
          </button>
        </div>

        {/* FOOTER */}
        <div className="terms-bottom">
          © ManthanPay. All rights reserved.
        </div>

      </div>
    </div>
  );
}
