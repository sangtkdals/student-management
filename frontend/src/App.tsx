import React, { useState, useCallback, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import type { User, UserRole } from "./types";

// Components
import Auth from "./components/Auth";
import LandingPage from "./components/LandingPage";
import { UserProfile, NoticeBoard, AcademicCalendar } from "./components/CommonViews";
import { ICONS, MOCK_COURSES, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from "./constants";

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
  StudentTimetable,
} from "./components/StudentViews";

// Professor Views
import {
  ProfessorHome,
  ProfessorLectureTimetable,
  ProfessorSyllabus,
  ProfessorCourseMaterials,
  ProfessorAssignments,
  ProfessorStudentManagement,
  ProfessorMyLectures,
} from "./components/ProfessorViews";

// Admin Views
import { AdminDashboard, AdminUserManagement, AdminSystemManagement, AdminScheduleManagement, AdminLeaveManagement, AdminNoticeManagement, AdminTuitionManagement } from "./components/AdminViews";

// --- Navigation Structures ---

interface MenuNode {
    label: string;
    path: string;
    children?: MenuNode[];
}

const STUDENT_MENU: MenuNode[] = [
  {
    label: "수강",
    path: "",
    children: [
        { label: "수강신청", path: "/student/course-registration" },
        { label: "시간표 조회", path: "/student/timetable" },
    ],
  },
  {
    label: "성적",
    path: "",
    children: [
        { label: "금학기 성적", path: "/student/current-grades" },
        { label: "전체 성적", path: "/student/all-grades" },
    ],
  },
  { 
      label: "등록/장학", 
      path: "", 
      children: [
          { label: "등록금 납부", path: "/student/tuition-payment" },
          { label: "등록금 내역", path: "/student/tuition-history" },
      ] 
  },
  {
    label: "학적/졸업",
    path: "",
    children: [
      { label: "휴학 신청", path: "/student/leave-application" },
      { label: "휴학 내역", path: "/student/leave-history" },
      { label: "복학 신청", path: "/student/return-application" },
      { label: "복학 내역", path: "/student/return-history" },
      { label: "졸업 요건", path: "/student/graduation-check" },
      { label: "증명서 발급", path: "/student/certificate-issuance" },
    ],
  },
];

const PROFESSOR_MENU: MenuNode[] = [
  {
    label: "강의 관리",
    path: "",
    children: [
        { label: "강의 등록", path: "/professor/my-lectures" },
        { label: "강의계획서", path: "/professor/syllabus" },
        { label: "강의 자료", path: "/professor/course-materials" },
        { label: "과제 관리", path: "/professor/assignments" },
    ],
  },
  {
    label: "학생 관리",
    path: "",
    children: [
        { label: "수강생 출결", path: "/professor/student-attendance" },
        { label: "성적 관리", path: "/professor/grade-management" },
    ],
  },
  {
      label: "행정/연구",
      path: "/professor/research",
  }
];

const ADMIN_MENU: MenuNode[] = [
  { label: "사용자 관리", path: "/admin/user-management" },
  { label: "강의 관리", path: "/admin/system-management" },
  { label: "등록금 관리", path: "/admin/tuition-management" },
  { label: "휴학/복학 관리", path: "/admin/leave-management" },
  { label: "학사일정 관리", path: "/admin/schedule-management" },
  { label: "공지사항 관리", path: "/admin/notice-management" },
];

// --- Components ---

const TopNavigation: React.FC<{
  user: User;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menus = user.role === "student" ? STUDENT_MENU : user.role === "professor" ? PROFESSOR_MENU : ADMIN_MENU;
  const homePath = user.role === "professor" ? "/professor" : user.role === "student" ? "/student" : "/admin/dashboard";

  const isActiveMenu = useCallback(
    (menu: MenuNode) => {
      if (menu.path && location.pathname === menu.path) return true;
      if (menu.children && menu.children.some((child) => location.pathname.startsWith(child.path))) return true;
      return false;
    },
    [location.pathname]
  );

  return (
    <header className="bg-white border-b border-brand-gray sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate(homePath)}>
            <span className="text-brand-blue mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-brand-blue tracking-tight">학사 관리 시스템</h1>
          </div>

          {/* Main Nav Links */}
          <nav className="hidden md:flex space-x-6 h-full items-center">
            <button
              onClick={() => navigate("/announcements")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/announcements" ? "text-brand-blue font-bold" : "text-slate-600 hover:text-brand-blue"
              }`}
            >
              공지사항
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/calendar" ? "text-brand-blue font-bold" : "text-slate-600 hover:text-brand-blue"
              }`}
            >
              학사일정
            </button>
            <div className="h-4 w-px bg-slate-300 my-auto"></div>
            
            {menus.map((menu) => (
              <div 
                key={menu.label} 
                className="relative h-full flex items-center"
                onMouseEnter={() => setHoveredMenu(menu.label)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  onClick={() => {
                      if (!menu.children && menu.path) navigate(menu.path);
                  }}
                  className={`text-sm font-medium transition-colors px-2 py-1 rounded-md flex items-center ${
                    isActiveMenu(menu) ? "text-brand-blue font-bold bg-blue-50" : "text-slate-600 hover:text-brand-blue hover:bg-slate-50"
                  } ${!menu.children ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {menu.label}
                  {menu.children && (
                      <svg className={`ml-1 h-3 w-3 transition-transform ${hoveredMenu === menu.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                  )}
                </button>

                {/* Dropdown */}
                {menu.children && hoveredMenu === menu.label && (
                    <div className="absolute top-full left-0 w-48 bg-white rounded-b-md shadow-lg py-2 border border-slate-100 animate-fade-in-down z-50">
                        {menu.children.map((child) => (
                            <button
                                key={child.path}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(child.path);
                                    setHoveredMenu(null);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                                    location.pathname === child.path ? "text-brand-blue font-bold bg-blue-50" : "text-slate-600"
                                }`}
                            >
                                {child.label}
                            </button>
                        ))}
                    </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none py-1 px-2 rounded-full hover:bg-slate-50"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="text-right hidden sm:block mr-1">
                <div className="text-sm font-bold text-slate-800 leading-tight">{user.name}</div>
                <div className="text-xs text-slate-500 capitalize leading-tight">{user.role}</div>
              </div>
              <img className="h-9 w-9 rounded-full border border-slate-200 object-cover" src={user.avatarUrl} alt={user.name} />
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
                  내 정보 관리
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
                  <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-2 border-white/50 object-cover" />
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
                    <span className="font-medium text-sm">{user.role === "student" ? "4.0 / 4.5" : user.officeRoom || "미배정"}</span>
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
                  onClick={() => navigate("/professor/student-attendance")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.users}</div>
                  <span className="text-xs font-bold">출결 관리</span>
                </button>
                <button
                  onClick={() => navigate("/professor/grade-management")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
                  <span className="text-xs font-bold">성적 관리</span>
                </button>
                <button
                  onClick={() => navigate("/professor/syllabus")}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
                >
                  <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
                  <span className="text-xs font-bold">강의계획서</span>
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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authRole, setAuthRole] = useState<UserRole>("student");
  const navigate = useNavigate();

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
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

  // Authenticated Application Wrapper
  const AuthenticatedApp = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 학생(/student)과 교수(/professor) 경로에서도 파란색 배너(DashboardHero)가 나오도록 설정
    const isDashboard = ["/", "/student", "/professor", "/admin/dashboard"].includes(location.pathname);

    return (
      <div className="min-h-screen bg-brand-gray-light flex flex-col font-sans">
        <TopNavigation user={user} onLogout={onLogout} />

        {/* 파란색 배너 (프로필 + 오늘의 시간표) */}
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
                      <StudentGradeCenter />
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
                      <StudentTuitionPayment setActiveView={() => { }} />
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
                      <StudentGradeCenter />
                    </div>
                  }
                />
              </>
            )}

            {/* Professor Specific Routes */}
            {user.role === "professor" && (
              <>
                {/* Reusing the component with different viewType props as per feature/professor logic */}
                
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
                  path="/admin/notice-management" 
                  element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <AdminNoticeManagement />
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
                   path="/admin/schedule-management" 
                   element={<AdminScheduleManagement />} />
                <Route path="/admin/leave-management" element={<AdminLeaveManagement />} 
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
