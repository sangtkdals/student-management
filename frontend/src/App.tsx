import { useState } from "react";
import LandingPage from "./components/LandingPage";
import LeaveApplication from "./components/LeaveReturnPage";
import type { UserRole } from "./types";

function App() {
  const [currentView, setCurrentView] = useState<"landing" | "leave">("landing");
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleNavigateToAuth = (role: UserRole) => {
    setUserRole(role);
    // 로그인 후 휴학/복학 페이지로 이동
    setCurrentView("leave");
  };

  // 휴학/복학 페이지 표시
  if (currentView === "leave") {
    return <LeaveReturnPage />;
  }

  // 랜딩 페이지 표시
  return <LandingPage onNavigateToAuth={handleNavigateToAuth} />;
}

export default App;