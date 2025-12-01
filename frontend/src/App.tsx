import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import type { User, UserRole } from "./types";

// Components
import Auth from "./components/Auth";
import LandingPage from "./components/LandingPage";
import AppRoutes from "./routes";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authRole, setAuthRole] = useState<UserRole>("student");
  const navigate = useNavigate();

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    if (loggedInUser.role === "student") {
      navigate("/student");
    } else if (loggedInUser.role === "professor") {
      navigate("/professor");
    } else if (loggedInUser.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthRole("student");
    navigate("/");
  };

  return (
    <>
      {user ? (
        <AppRoutes user={user} onLogout={handleLogout} />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onNavigateToAuth={(role) => {
                  setAuthRole(role);
                  navigate(`/auth/${role}`);
                }}
              />
            }
          />
          <Route path="/auth/:role" element={<Auth onLogin={handleLogin} onBack={() => navigate("/")} initialRole={authRole} />} />
          <Route
            path="*"
            element={
              <LandingPage
                onNavigateToAuth={(role) => {
                  setAuthRole(role);
                  navigate(`/auth/${role}`);
                }}
              />
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
