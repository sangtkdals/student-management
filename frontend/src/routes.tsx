import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import type { User, Course } from "./types";
import DEUCourseRegistrationApp from "./DEUCourseRegistrationApp";

// Components
import TopNavigation from "./components/TopNavigation";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import AnnouncementDetail from "./components/AnnouncementDetail";

// Common Views
import { UserProfile } from "./components/common/UserProfile";
import { NoticeBoard } from "./components/common/NoticeBoard";
import { AcademicCalendar } from "./components/common/AcademicCalendar";

// Student Views
import { StudentHome } from "./components/student/StudentHome";
import { StudentCourseRegistration } from "./components/student/StudentCourseRegistration";
import { StudentGradeCenter } from "./components/student/StudentGradeCenter";
import { StudentMyTimetable } from "./components/student/StudentMyTimetable";
import { StudentTuitionHistory, StudentTuitionPayment } from "./components/student/StudentTuitionViews";
import {
  StudentLeaveApplication,
  StudentLeaveHistory,
  StudentReturnApplication,
  StudentReturnHistory,
} from "./components/student/StudentAcademicStatusViews";
import { StudentGraduationCheck, StudentCertificateIssuance } from "./components/student/StudentMiscViews";
import { StudentAttendance } from "./components/student/StudentAttendance";

// Professor Views
import { ProfessorHome } from "./components/professor/ProfessorHome";
import { ProfessorMyLectures } from "./components/professor/ProfessorMyLectures";
import { ProfessorStudentManagement } from "./components/professor/ProfessorStudentManagement";
import { ProfessorSyllabus } from "./components/professor/ProfessorSyllabus";
import { ProfessorCourseMaterials, ProfessorAssignments } from "./components/professor/ProfessorMiscViews";

// Admin Views
import {
  AdminDashboard,
  AdminUserManagement,
  AdminSystemManagement,
  AdminLeaveManagement,
  AdminNoticeManagement,
  AdminScheduleManagement,
  AdminTuitionManagement,
} from "./components/admin";

// Loading Bar Component
const LoadingBar = () => (
  <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-brand-blue/20 overflow-hidden">
    <div className="h-full bg-brand-blue animate-progress-bar"></div>
  </div>
);

// Authenticated Application Wrapper
const AppRoutes = ({ user, onLogout, enrolledCourses }: { user: User; onLogout: () => void; enrolledCourses: Course[] }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-brand-gray-light flex flex-col font-sans">
      {isLoading && <LoadingBar />}
      <TopNavigation user={user} onLogout={onLogout} />

      <main className="flex-1">
        <Routes>
          {/* Main Role Dashboards */}
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/student" element={<Dashboard user={user} />} />
          <Route path="/professor" element={<Dashboard user={user} />} />

          {/* Common Routes */}
          <Route
            path="/profile"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <UserProfile user={user} />
              </div>
            }
          />
          <Route
            path="/announcements"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NoticeBoard />
              </div>
            }
          />
          <Route
            path="/announcements/:id"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnnouncementDetail setIsLoading={setIsLoading} />
              </div>
            }
          />
          <Route
            path="/calendar"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AcademicCalendar />
              </div>
            }
          />

          {/* Student Specific Routes */}
          {user.role === "student" && (
            <>
              <Route
                path="/student/course-registration"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <DEUCourseRegistrationApp user={user} initialEnrolledCourses={enrolledCourses as any[]} />
                  </div>
                }
              />
              <Route
                path="/student/all-grades"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentGradeCenter user={user} />
                  </div>
                }
              />
              <Route
                path="/student/tuition-history"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentTuitionHistory />
                  </div>
                }
              />
              <Route
                path="/student/leave-application"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentLeaveApplication />
                  </div>
                }
              />
              <Route
                path="/student/graduation-check"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentGraduationCheck />
                  </div>
                }
              />
              <Route
                path="/student/tuition-payment"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentTuitionPayment setActiveView={() => {}} />
                  </div>
                }
              />
              <Route
                path="/student/leave-history"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentLeaveHistory />
                  </div>
                }
              />
              <Route
                path="/student/return-application"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentReturnApplication />
                  </div>
                }
              />
              <Route
                path="/student/return-history"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentReturnHistory />
                  </div>
                }
              />
              <Route
                path="/student/certificate-issuance"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentCertificateIssuance />
                  </div>
                }
              />

              {/* [수정] Navigation.ts의 경로(/student/Mytimetable)와 일치시킴 */}
              <Route
                path="/student/Mytimetable"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentMyTimetable user={user} />
                  </div>
                }
              />

              <Route
                path="/student/current-grades"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentGradeCenter user={user} />
                  </div>
                }
              />
              <Route
                path="/student/attendance"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <StudentAttendance user={user} />
                  </div>
                }
              />
            </>
          )}

          {/* Professor Specific Routes */}
          {user.role === "professor" && (
            <>
              <Route
                path="/professor/student-attendance"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProfessorStudentManagement user={user} viewType="attendance" />
                  </div>
                }
              />
              <Route
                path="/professor/grade-management"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProfessorStudentManagement user={user} viewType="grades" />
                  </div>
                }
              />

              <Route
                path="/professor/my-lectures"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProfessorMyLectures user={user} />
                  </div>
                }
              />
              <Route
                path="/professor/syllabus"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProfessorSyllabus user={user} />
                  </div>
                }
              />
              <Route
                path="/professor/course-materials"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProfessorCourseMaterials user={user} />
                  </div>
                }
              />
              <Route
                path="/professor/assignments"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProfessorAssignments />
                  </div>
                }
              />
              <Route
                path="/professor/research"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12 text-slate-500">준비 중인 기능입니다.</div>
                  </div>
                }
              />
            </>
          )}

          {/* Admin Specific Routes */}
          {user.role === "admin" && (
            <>
              <Route path="/admin/dashboard" element={<Dashboard user={user} />} />
              <Route
                path="/admin/user-management"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminUserManagement />
                  </div>
                }
              />
              <Route
                path="/admin/system-management"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminSystemManagement />
                  </div>
                }
              />
              <Route
                path="/admin/leave-management"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminLeaveManagement />
                  </div>
                }
              />
              <Route
                path="/admin/notice-management"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminNoticeManagement />
                  </div>
                }
              />
              <Route
                path="/admin/schedule-management"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminScheduleManagement />
                  </div>
                }
              />
              <Route
                path="/admin/tuition-management"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminTuitionManagement />
                  </div>
                }
              />
            </>
          )}

          <Route path="*" element={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">페이지를 찾을 수 없습니다</div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default AppRoutes;
