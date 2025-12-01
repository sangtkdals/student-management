import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import type { User } from "./types";

// Components
import TopNavigation from "./components/TopNavigation";
import Footer from "./components/Footer";
import { DashboardHero, DashboardContent } from "./components/Dashboard";
import { UserProfile, NoticeBoard, AcademicCalendar } from "./components/CommonViews";
import AnnouncementDetail from "./components/AnnouncementDetail";

// Student Views
import {
  StudentHome,
  StudentCourseRegistration,
  StudentGradeCenter,
  StudentTuitionHistory,
  StudentLeaveApplication,
  StudentGraduationCheck,
  StudentTuitionPayment,
  StudentLeaveHistory,
  StudentReturnApplication,
  StudentReturnHistory,
  StudentCertificateIssuance,
  StudentMyTimetable,
} from "./components/StudentViews";

// Professor Views
import {
  ProfessorHome,
  ProfessorStudentManagement,
  ProfessorMyLectures,
  ProfessorSyllabus,
  ProfessorCourseMaterials,
  ProfessorAssignments,
} from "./components/ProfessorViews";

// Admin Views
import { AdminDashboard, AdminUserManagement, AdminSystemManagement, AdminLeaveManagement, AdminNoticeManagement } from "./components/AdminViews";

// Loading Bar Component
const LoadingBar = () => (
  <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-brand-blue/20 overflow-hidden">
    <div className="h-full bg-brand-blue animate-progress-bar"></div>
  </div>
);

// Authenticated Application Wrapper
const AppRoutes = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const isDashboard = ["/", "/student", "/professor", "/admin/dashboard"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-brand-gray-light flex flex-col font-sans">
      {isLoading && <LoadingBar />}
      <TopNavigation user={user} onLogout={onLogout} />

      {isDashboard && <DashboardHero user={user} navigate={navigate} />}
      <main className="flex-1">
        <Routes>
          {/* Main Role Dashboards */}
          <Route
            path="/"
            element={
              user.role === "student" ? (
                <StudentHome user={user} />
              ) : user.role === "professor" ? (
                <ProfessorHome user={user} />
              ) : (
                <DashboardContent user={user} navigate={navigate} />
              )
            }
          />
          <Route path="/student" element={<StudentHome user={user} />} />
          <Route path="/professor" element={<ProfessorHome user={user} />} />

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
                    <StudentCourseRegistration />
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
                    <StudentMyTimetable />
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
              <Route
                path="/admin/dashboard"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminDashboard />
                  </div>
                }
              />
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
                path="/admin/AdminLeaveManagement"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminLeaveManagement />
                  </div>
                }
              />
              <Route
                path="/admin/AdminNoticeManagement"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminNoticeManagement />
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
