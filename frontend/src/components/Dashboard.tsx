import React from "react";
import type { User } from "../types";
import StudentDashboard from "./student/StudentDashboard";
import { ProfessorHome } from "./professor/ProfessorHome";
import { AdminDashboard } from "./admin";

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const role = user.role.toLowerCase();

  if (role === "student") {
    return <StudentDashboard user={user} />;
  }

  if (role === "professor") {
    return <ProfessorHome user={user} />;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  }

  // Fallback or handle unknown roles
  return <div>Unknown role. Please contact support.</div>;
};

export default Dashboard;
