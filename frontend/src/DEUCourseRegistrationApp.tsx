// src/components/DEUCourseRegistrationApp.tsx
import React from "react";
import App from "./ai-course-registration/App";
import type { User, Course } from "./types";

interface DEUCourseRegistrationAppProps {
  user: User;
  initialEnrolledCourses: any[];
}

const DEUCourseRegistrationApp: React.FC<DEUCourseRegistrationAppProps> = ({ user, initialEnrolledCourses }) => {
  // 그냥 AI Studio App을 감싸서 student-management 안에서 쓰기만 함
  // App 컴포넌트가 props를 받도록 수정해야 함
  return <App user={user} initialEnrolledCourses={initialEnrolledCourses} />;
};

export default DEUCourseRegistrationApp;
