// src/components/DEUCourseRegistrationApp.tsx
import React from "react";
import App from "./ai-course-registration/App";

const DEUCourseRegistrationApp: React.FC = () => {
  // 그냥 AI Studio App을 감싸서 student-management 안에서 쓰기만 함
  return <App />;
};

export default DEUCourseRegistrationApp;
