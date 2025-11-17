import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import type { UserRole } from "./types";

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleNavigateToAuth = (role: UserRole) => {
    setUserRole(role);
    // In a real application, you would navigate to a login/signup page here.
    // For this mock, we'll just log the role.
    console.log(`Navigating to auth for role: ${role}`);
  };

  return (
    <div>
      {/* For now, we only show the landing page. 
          Later, we can add routing to show different pages based on auth state. */}
      <LandingPage onNavigateToAuth={handleNavigateToAuth} />
    </div>
  );
}

export default App;
