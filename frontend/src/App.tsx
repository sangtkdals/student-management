import React, { useState, useEffect, useCallback } from "react";
import type { User, UserRole, Course } from "./types";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Auth from "./components/Auth";
import LandingPage from "./components/LandingPage";
import { ICONS, MOCK_COURSES, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS, MOCK_USERS } from "./constants";
// import {
//   StudentAllGrades,
//   StudentCourseRegistration,
//   StudentTuitionHistory,
//   StudentLeaveApplication,
//   StudentGraduationCheck,
//   StudentTuitionPayment,
//   StudentLeaveHistory,
//   StudentReturnApplication,
//   StudentReturnHistory,
//   StudentCertificateIssuance,
//   StudentTimetable,
//   StudentCurrentGrades,
//   StudentHome,
// } from "./components/StudentViews";

// --- StudentViews Placeholder ---
const StudentViewsPlaceholder: React.FC<{ user?: User }> = ({ user }) => (
  <Card title="준비중인 페이지">
    <p>현재 페이지는 개발 중입니다. 빠른 시일 내에 찾아뵙겠습니다.</p>
    {user && (
      <div className="mt-4 p-4 bg-slate-50 rounded">
        <p className="text-sm text-slate-600">
          <strong>사용자:</strong> {user.name} ({user.role})
        </p>
      </div>
    )}
  </Card>
);
const StudentAllGrades = StudentViewsPlaceholder;
const StudentCourseRegistration = StudentViewsPlaceholder;
const StudentTuitionHistory = StudentViewsPlaceholder;
const StudentLeaveApplication = StudentViewsPlaceholder;
const StudentGraduationCheck = StudentViewsPlaceholder;
const StudentTuitionPayment = StudentViewsPlaceholder;
const StudentLeaveHistory = StudentViewsPlaceholder;
const StudentReturnApplication = StudentViewsPlaceholder;
const StudentReturnHistory = StudentViewsPlaceholder;
const StudentCertificateIssuance = StudentViewsPlaceholder;
const StudentTimetable = StudentViewsPlaceholder;
const StudentCurrentGrades = StudentViewsPlaceholder;
const StudentHome = StudentViewsPlaceholder;
// --- End StudentViews Placeholder ---

import {
  ProfessorMyLectures,
  ProfessorSyllabus,
  ProfessorCourseMaterials,
  ProfessorAssignments,
  ProfessorTimetable,
  ProfessorCourseEvaluation,
  ProfessorStudentManagement,
  ProfessorHome,
} from "./components/ProfessorViews";
import { AdminDashboard, AdminUserManagement, AdminSystemManagement } from "./components/AdminViews";
import { UserProfile, NoticeBoard, AcademicCalendar } from "./components/CommonViews";
import { Card, Button } from "./components/ui";

interface NavItem {
  key: string; // key is now part of the path
  path: string;
  label: string;
  icon: React.ReactElement;
  roles: UserRole[];
  component: React.ComponentType<any>;
}

const ALL_VIEWS: NavItem[] = [
  // Common
  { key: "dashboard", path: "/", label: "홈", icon: ICONS.dashboard, roles: ["student", "professor", "admin"], component: () => <></> },
  { key: "profile", path: "/profile", label: "내 정보", icon: ICONS.profile, roles: ["student", "professor", "admin"], component: UserProfile },
  {
    key: "announcements",
    path: "/announcements",
    label: "공지사항",
    icon: ICONS.announcement,
    roles: ["student", "professor", "admin"],
    component: NoticeBoard,
  },
  {
    key: "calendar",
    path: "/calendar",
    label: "학사일정",
    icon: ICONS.calendar,
    roles: ["student", "professor", "admin"],
    component: AcademicCalendar,
  },

  // Student Views
  {
    key: "course_registration",
    path: "/student/course-registration",
    label: "수강신청",
    icon: ICONS.courses,
    roles: ["student"],
    component: StudentCourseRegistration,
  },
  { key: "all_grades", path: "/student/all-grades", label: "전체 성적 조회", icon: ICONS.grades, roles: ["student"], component: StudentAllGrades },
  {
    key: "tuition_history",
    path: "/student/tuition-history",
    label: "등록금 내역",
    icon: ICONS.tuition,
    roles: ["student"],
    component: StudentTuitionHistory,
  },
  {
    key: "leave_application",
    path: "/student/leave-application",
    label: "휴학 신청",
    icon: ICONS.leave,
    roles: ["student"],
    component: StudentLeaveApplication,
  },
  {
    key: "graduation_check",
    path: "/student/graduation-check",
    label: "졸업 요건",
    icon: ICONS.graduation,
    roles: ["student"],
    component: StudentGraduationCheck,
  },
  {
    key: "tuition_payment",
    path: "/student/tuition-payment",
    label: "등록금 납부",
    icon: ICONS.tuition,
    roles: ["student"],
    component: StudentTuitionPayment,
  },
  { key: "leave_history", path: "/student/leave-history", label: "휴학 내역", icon: ICONS.leave, roles: ["student"], component: StudentLeaveHistory },
  {
    key: "return_application",
    path: "/student/return-application",
    label: "복학 신청",
    icon: ICONS.leave,
    roles: ["student"],
    component: StudentReturnApplication,
  },
  {
    key: "return_history",
    path: "/student/return-history",
    label: "복학 내역",
    icon: ICONS.leave,
    roles: ["student"],
    component: StudentReturnHistory,
  },
  {
    key: "certificate_issuance",
    path: "/student/certificate-issuance",
    label: "증명서 발급",
    icon: ICONS.profile,
    roles: ["student"],
    component: StudentCertificateIssuance,
  },
  { key: "timetable", path: "/student/timetable", label: "시간표 조회", icon: ICONS.calendar, roles: ["student"], component: StudentTimetable },
  {
    key: "current_grades",
    path: "/student/current-grades",
    label: "금학기 성적",
    icon: ICONS.grades,
    roles: ["student"],
    component: StudentCurrentGrades,
  },

  // Professor Views
  {
    key: "my_lectures",
    path: "/professor/my-lectures",
    label: "강의 목록",
    icon: ICONS.courses,
    roles: ["professor"],
    component: ProfessorMyLectures,
  },
  {
    key: "student_management",
    path: "/professor/student-management",
    label: "학생 관리",
    icon: ICONS.users,
    roles: ["professor"],
    component: ProfessorStudentManagement,
  },
  { key: "syllabus", path: "/professor/syllabus", label: "강의계획서", icon: ICONS.courses, roles: ["professor"], component: ProfessorSyllabus },
  {
    key: "course_materials",
    path: "/professor/course-materials",
    label: "강의 자료",
    icon: ICONS.courses,
    roles: ["professor"],
    component: ProfessorCourseMaterials,
  },
  {
    key: "assignments",
    path: "/professor/assignments",
    label: "과제 관리",
    icon: ICONS.courses,
    roles: ["professor"],
    component: ProfessorAssignments,
  },
  {
    key: "prof_timetable",
    path: "/professor/timetable",
    label: "주간 시간표",
    icon: ICONS.calendar,
    roles: ["professor"],
    component: ProfessorTimetable,
  },
  {
    key: "course_evaluation",
    path: "/professor/course-evaluation",
    label: "강의평가",
    icon: ICONS.grades,
    roles: ["professor"],
    component: ProfessorCourseEvaluation,
  },

  // Admin Views
  { key: "admin_dashboard", path: "/admin/dashboard", label: "관리자 대시보드", icon: ICONS.dashboard, roles: ["admin"], component: AdminDashboard },
  { key: "manage_users", path: "/admin/user-management", label: "사용자 관리", icon: ICONS.users, roles: ["admin"], component: AdminUserManagement },
  { key: "system", path: "/admin/system-management", label: "시스템 관리", icon: ICONS.system, roles: ["admin"], component: AdminSystemManagement },
];

// Top Navigation Menu Structure
const STUDENT_MENU = [
  {
    label: "수강/성적",
    path: "/student/course-registration",
    sub: ["/student/course-registration", "/student/timetable", "/student/all-grades", "/student/current-grades"],
  },
  { label: "등록/장학", path: "/student/tuition-history", sub: ["/student/tuition-payment", "/student/tuition-history"] },
  {
    label: "학적/졸업",
    path: "/student/leave-application",
    sub: [
      "/student/leave-application",
      "/student/graduation-check",
      "/student/certificate-issuance",
      "/student/leave-history",
      "/student/return-application",
      "/student/return-history",
    ],
  },
];

const PROFESSOR_MENU = [
  {
    label: "강의 관리",
    path: "/professor/my-lectures",
    sub: ["/professor/my-lectures", "/professor/timetable", "/professor/syllabus", "/professor/course-materials", "/professor/assignments"],
  },
  { label: "학생 관리", path: "/professor/student-management", sub: ["/professor/student-management"] },
  { label: "연구/행정", path: "/professor/course-evaluation", sub: ["/professor/course-evaluation"] },
];

const ADMIN_MENU = [
  { label: "사용자 관리", path: "/admin/user-management" },
  { label: "시스템 관리", path: "/admin/system-management" },
];

const TopNavigation: React.FC<{
  user: User;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져오기 위해 useLocation 훅 사용

  const menus = user.role === "student" ? STUDENT_MENU : user.role === "professor" ? PROFESSOR_MENU : ADMIN_MENU;

  // 현재 활성화된 메뉴를 확인하는 함수 (서브 경로 포함)
  const isActiveMenu = useCallback(
    (menuPath: string, subPaths?: string[]) => {
      if (location.pathname === menuPath) return true;
      if (subPaths && subPaths.some((subPath) => location.pathname.startsWith(subPath))) return true;
      return false;
    },
    [location.pathname]
  );

  return (
    <header className="bg-white border-b border-brand-gray sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <svg
              className="w-8 h-8 text-brand-blue"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-brand-blue">학사 관리 시스템</h1>
          </div>

          {/* Main Nav Links */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate("/announcements")}
              className={`text-sm font-medium transition-colors ${
                isActiveMenu("/announcements") ? "text-brand-blue" : "text-slate-600 hover:text-brand-blue"
              }`}
            >
              공지사항
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className={`text-sm font-medium transition-colors ${
                isActiveMenu("/calendar") ? "text-brand-blue" : "text-slate-600 hover:text-brand-blue"
              }`}
            >
              학사일정
            </button>
            <div className="h-4 w-px bg-slate-300 my-auto"></div>
            {menus.map((menu: any) => (
              <button
                key={menu.label}
                onClick={() => navigate(menu.path)}
                className={`text-sm font-medium transition-colors ${
                  isActiveMenu(menu.path, menu.sub) ? "text-brand-blue" : "text-slate-600 hover:text-brand-blue"
                }`}
              >
                {menu.label}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-700">{user.name}</div>
                <div className="text-xs text-slate-500 capitalize">{user.role}</div>
              </div>
              <img className="h-9 w-9 rounded-full border border-slate-200" src={user.avatarUrl} alt={user.name} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  내 정보
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100">
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
    </header>
  );
};

const TodaySchedule: React.FC = () => {
  // Simplified mock for "Today"
  const todayCourses = MOCK_COURSES.slice(0, 3);
  const todos = [
    { id: 1, text: "자료구조 과제 제출 (오늘 마감)" },
    { id: 2, text: "도서 반납하기" },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg h-full border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          오늘의 시간표
        </h3>
        <span className="text-xs text-slate-500">2024.05.22 (수)</span>
      </div>
      <div className="space-y-3">
        {todayCourses.map((course, idx) => (
          <div key={idx} className="flex items-start border-l-2 border-brand-blue pl-3 py-1">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">{course.subjectName}</p>
              <p className="text-xs text-slate-500">
                {course.classroom} | {(course.courseTime ?? "").split(",")[0]}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${idx === 0 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"}`}>
              {idx === 0 ? "수업중" : "예정"}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="font-bold text-slate-800 text-sm mb-2">할 일 (To-Do)</h4>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center text-sm text-slate-600">
              <input type="checkbox" className="mr-2 rounded text-brand-blue" />
              <span>{todo.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DashboardHero: React.FC<{ user: User; navigate: ReturnType<typeof useNavigate> }> = ({ user, navigate }) => {
  return (
    <div className="bg-brand-blue w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-2 border-white/50" />
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-blue-100 text-sm">{user.departmentName ?? ""}</p>
                    <p className="text-blue-200 text-xs mt-1">
                      {user.role === "student" ? "학부생" : "교수"} | {user.id}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                    <span className="text-blue-100 text-sm">이메일</span>
                    <span className="font-medium text-sm truncate max-w-[150px]">{user.email}</span>
                  </div>
                  <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                    <span className="text-blue-100 text-sm">{user.role === "student" ? "이번 학기 평점" : "연구실"}</span>
                    <span className="font-medium text-sm">{user.role === "student" ? "4.0 / 4.5" : "공학관 401호"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full py-2 bg-white text-brand-blue font-bold rounded hover:bg-blue-50 transition-colors text-sm"
                >
                  내 정보 관리
                </button>
              </div>
            </div>
          </div>

          {/* Right: Timetable & Tasks */}
          <div className="lg:col-span-2">
            <TodaySchedule />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardContent: React.FC<{ navigate: ReturnType<typeof useNavigate>; user: User }> = ({ navigate, user }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notices */}
        <div className="bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-brand-blue">
              {ICONS.announcement}
              <h3 className="ml-2 text-lg font-bold text-slate-800">공지사항</h3>
            </div>
            <button onClick={() => navigate("/announcements")} className="text-xs text-slate-500 hover:text-brand-blue">
              더보기 +
            </button>
          </div>
          <ul className="space-y-3">
            {MOCK_ANNOUNCEMENTS.slice(0, 3).map((ann) => (
              <li key={ann.postId} onClick={() => navigate("/announcements")} className="cursor-pointer group">
                <p className="text-sm text-slate-700 group-hover:text-brand-blue font-medium truncate">{ann.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{ann.createdAt.slice(0, 10)}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-brand-blue">
              {ICONS.calendar}
              <h3 className="ml-2 text-lg font-bold text-slate-800">주요 학사일정</h3>
            </div>
            <button onClick={() => navigate("/calendar")} className="text-xs text-slate-500 hover:text-brand-blue">
              전체보기 +
            </button>
          </div>
          <ul className="space-y-3">
            {MOCK_CALENDAR_EVENTS.slice(0, 3).map((evt) => (
              <li key={evt.scheduleId} className="flex items-start">
                <div className="flex-shrink-0 w-12 text-center bg-slate-100 rounded p-1 mr-3">
                  <p className="text-xs text-slate-500">{evt.startDate.split("-")[1]}월</p>
                  <p className="text-sm font-bold text-slate-800">{evt.startDate.split("-")[2]}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{evt.title}</p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      evt.category === "academic" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {evt.category === "academic" ? "학사" : "휴일"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4 text-brand-blue">
            {ICONS.system}
            <h3 className="ml-2 text-lg font-bold text-slate-800">바로가기</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {user.role === "student" ? (
              <>
                <button
                  onClick={() => navigate("/student/course-registration")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.courses}</div>
                  <span className="text-xs font-bold">수강신청</span>
                </button>
                <button
                  onClick={() => navigate("/student/all-grades")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
                  <span className="text-xs font-bold">성적조회</span>
                </button>
                <button
                  onClick={() => navigate("/student/tuition-history")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.tuition}</div>
                  <span className="text-xs font-bold">등록금</span>
                </button>
                <button
                  onClick={() => navigate("/student/certificate-issuance")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.profile}</div>
                  <span className="text-xs font-bold">증명서</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/professor/my-lectures")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.courses}</div>
                  <span className="text-xs font-bold">내 강의</span>
                </button>
                <button
                  onClick={() => navigate("/professor/student-management")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.users}</div>
                  <span className="text-xs font-bold">학생 관리</span>
                </button>
                <button
                  onClick={() => navigate("/professor/timetable")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.calendar}</div>
                  <span className="text-xs font-bold">시간표</span>
                </button>
                <button
                  onClick={() => navigate("/professor/course-evaluation")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
                  <span className="text-xs font-bold">강의평가</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authRole, setAuthRole] = useState<UserRole>("student");
  const navigate = useNavigate();

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // 로그인 성공 후 대시보드로 이동
    if (loggedInUser.role === "student") {
      navigate("/student");
    } else if (loggedInUser.role === "professor") {
      navigate("/professor");
    } else if (loggedInUser.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthRole("student");
    // 로그아웃 후 랜딩 페이지로 이동
    navigate("/");
  };

  // Authenticated part of the app is extracted into its own component
  // to ensure hooks are not called conditionally.
  const AuthenticatedApp = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = ["/", "/student", "/professor", "/admin/dashboard"].includes(location.pathname);

    return (
      <div className="min-h-screen bg-brand-gray-light flex flex-col">
        <TopNavigation user={user} onLogout={onLogout} />

        {/* Hero Section - Only visible on Dashboard */}
        {isDashboard && <DashboardHero user={user} navigate={navigate} />}

        <main className="flex-1">
          <Routes>
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
              path="/calendar"
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AcademicCalendar />
                </div>
              }
            />

            {user.role === "student" && (
              <>
                <Route path="/student" element={<StudentHome user={user} />} />
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
                      <StudentAllGrades />
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
                      <StudentTuitionPayment />
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
                <Route
                  path="/student/timetable"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <StudentTimetable />
                    </div>
                  }
                />
                <Route
                  path="/student/current-grades"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <StudentCurrentGrades />
                    </div>
                  }
                />
              </>
            )}

            {user.role === "professor" && (
              <>
                <Route path="/professor" element={<ProfessorHome user={user} />} />
                <Route
                  path="/professor/my-lectures"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfessorMyLectures user={user} />
                    </div>
                  }
                />
                <Route
                  path="/professor/student-management"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfessorStudentManagement user={user} />
                    </div>
                  }
                />
                <Route
                  path="/professor/syllabus"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfessorSyllabus />
                    </div>
                  }
                />
                <Route
                  path="/professor/course-materials"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfessorCourseMaterials />
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
                  path="/professor/timetable"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfessorTimetable user={user} />
                    </div>
                  }
                />
                <Route
                  path="/professor/course-evaluation"
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfessorCourseEvaluation />
                    </div>
                  }
                />
              </>
            )}

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
              </>
            )}

            <Route path="*" element={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">페이지를 찾을 수 없습니다</div>} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-brand-gray mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:justify-between md:items-center">
              <div className="text-sm text-slate-500">&copy; {new Date().getFullYear()} University Academic System. All rights reserved.</div>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">
                  개인정보처리방침
                </a>
                <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">
                  이용약관
                </a>
                <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">
                  연락처
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <>
      {user ? (
        <AuthenticatedApp user={user} onLogout={handleLogout} />
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
