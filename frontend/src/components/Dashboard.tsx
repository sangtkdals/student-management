import React from "react";
import type { User } from "../types";
import StudentDashboard from "./student/StudentDashboard";
import { ProfessorHome } from "./professor/ProfessorHome";

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  if (user.role.toLowerCase() === "student") {
    return <StudentDashboard user={user} />;
  }

  if (user.role.toLowerCase() === "professor") {
    return <ProfessorHome user={user} />;
  }

  // 기본적으로 학생 대시보드를 보여주거나, 권한에 맞는 다른 페이지로 리디렉션 할 수 있습니다.
  // 여기서는 학생 대시보드를 기본값으로 설정합니다.
  return <StudentDashboard user={user} />;
};

export default Dashboard;
