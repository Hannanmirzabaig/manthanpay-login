import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import TermsAndConditions from "./pages/TermsAndConditions";

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("manthanpayAuthToken")
  );

  const navigate = useNavigate();

  function handleLogin() {
    setIsLoggedIn(true);
    navigate("/dashboard", { replace: true });
  }

  function handleLogout() {
    // Remove authentication token
    localStorage.removeItem("manthanpayAuthToken");

    // Remove logged-in user details
    localStorage.removeItem("manthanpayLoggedInUser");
    localStorage.removeItem("manthanpayLoggedInEmail");
    localStorage.removeItem("manthanpayLoggedInRole");
    localStorage.removeItem("manthanpayUserId");

    // Update login state
    setIsLoggedIn(false);

    // Redirect to login page
    navigate("/login", { replace: true });
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              onLogin={handleLogin}
              onForgotPassword={() => navigate("/forgot-password")}
            />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPassword
              onBackToLogin={() => navigate("/login")}
            />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/terms-and-conditions"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <TermsAndConditions />
          )
        }
      />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
