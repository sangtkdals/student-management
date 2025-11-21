import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { User, UserRole } from './types';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import { ICONS } from './constants';
import { 
    StudentHome, StudentAllGrades, StudentCourseRegistration, StudentTuitionHistory, StudentLeaveApplication, StudentGraduationCheck,
    StudentTuitionPayment, StudentLeaveHistory, StudentReturnApplication, StudentReturnHistory, StudentCertificateIssuance, StudentTimetable, StudentCurrentGrades
} from './components/StudentViews';
import {
    ProfessorHome, ProfessorLectureTimetable, ProfessorSyllabus, ProfessorCourseMaterials,
    ProfessorAssignments, ProfessorCourseEvaluation, ProfessorStudentManagement
} from './components/ProfessorViews';
import {
    AdminDashboard, AdminUserManagement, AdminSystemManagement
} from './components/AdminViews';
import {
    UserProfile, NoticeBoard, AcademicCalendar
} from './components/CommonViews';

type ViewType = string;

interface NavItem {
    key: ViewType;
    label: string;
    icon: React.ReactElement<{ className?: string }>;
    roles: UserRole[];
    component: React.ComponentType<any>;
}

interface MenuItem {
    key?: string;
    label: string;
    icon: React.ReactElement<{ className?: string }>;
    children?: { key: string; label: string }[];
}

const ALL_VIEWS: NavItem[] = [
    // Common
    { key: 'dashboard', label: '홈', icon: ICONS.dashboard, roles: ['student', 'professor', 'admin'], component: () => <></> }, // Special case
    { key: 'profile', label: '내 정보', icon: ICONS.profile, roles: ['student', 'professor', 'admin'], component: UserProfile },
    { key: 'announcements', label: '공지사항', icon: ICONS.announcement, roles: ['student', 'professor', 'admin'], component: NoticeBoard },
    { key: 'calendar', label: '학사일정', icon: ICONS.calendar, roles: ['student', 'professor', 'admin'], component: AcademicCalendar },
    
    // Student Views
    { key: 'student_home', label: '학생 홈', icon: ICONS.dashboard, roles: ['student'], component: StudentHome },
    { key: 'course_registration', label: '수강신청', icon: ICONS.courses, roles: ['student'], component: StudentCourseRegistration },
    { key: 'all_grades', label: '전체 성적 조회', icon: ICONS.grades, roles: ['student'], component: StudentAllGrades },
    { key: 'tuition_history', label: '등록금 내역', icon: ICONS.tuition, roles: ['student'], component: StudentTuitionHistory },
    { key: 'leave_application', label: '휴학 신청', icon: ICONS.leave, roles: ['student'], component: StudentLeaveApplication },
    { key: 'graduation_check', label: '졸업 요건', icon: ICONS.graduation, roles: ['student'], component: StudentGraduationCheck },
    { key: 'tuition_payment', label: '등록금 납부', icon: ICONS.tuition, roles: ['student'], component: StudentTuitionPayment },
    { key: 'leave_history', label: '휴학 내역', icon: ICONS.leave, roles: ['student'], component: StudentLeaveHistory },
    { key: 'return_application', label: '복학 신청', icon: ICONS.leave, roles: ['student'], component: StudentReturnApplication },
    { key: 'return_history', label: '복학 내역', icon: ICONS.leave, roles: ['student'], component: StudentReturnHistory },
    { key: 'certificate_issuance', label: '증명서 발급', icon: ICONS.profile, roles: ['student'], component: StudentCertificateIssuance },
    { key: 'timetable', label: '시간표 조회', icon: ICONS.calendar, roles: ['student'], component: StudentTimetable },
    { key: 'current_grades', label: '금학기 성적', icon: ICONS.grades, roles: ['student'], component: StudentCurrentGrades },

    // Professor Views
    { key: 'professor_home', label: '교수 홈', icon: ICONS.dashboard, roles: ['professor'], component: ProfessorHome },
    { key: 'lecture_timetable', label: '강의 시간표', icon: ICONS.calendar, roles: ['professor'], component: ProfessorLectureTimetable },
    
    // Updated Student Management Keys
    { key: 'student_attendance', label: '수강생 출결', icon: ICONS.users, roles: ['professor'], component: (props: any) => <ProfessorStudentManagement {...props} viewType="attendance" /> },
    { key: 'grade_management', label: '성적 관리', icon: ICONS.grades, roles: ['professor'], component: (props: any) => <ProfessorStudentManagement {...props} viewType="grades" /> },
    
    { key: 'syllabus', label: '강의계획서', icon: ICONS.courses, roles: ['professor'], component: ProfessorSyllabus },
    { key: 'course_materials', label: '강의 자료', icon: ICONS.courses, roles: ['professor'], component: ProfessorCourseMaterials },
    { key: 'assignments', label: '과제 관리', icon: ICONS.courses, roles: ['professor'], component: ProfessorAssignments },
    { key: 'course_evaluation', label: '강의평가', icon: ICONS.grades, roles: ['professor'], component: ProfessorCourseEvaluation },
    
    // Admin Views
    { key: 'manage_users', label: '사용자 관리', icon: ICONS.users, roles: ['admin'], component: AdminUserManagement },
    { key: 'manage_system', label: '시스템 관리', icon: ICONS.system, roles: ['admin'], component: AdminSystemManagement }
];

// Menu structures for specific roles to support dropdowns
const PROFESSOR_MENU_STRUCTURE: MenuItem[] = [
    // Home handled separately in Logo
    { 
        label: '강의 관리', 
        icon: ICONS.courses, 
        children: [
            { key: 'lecture_timetable', label: '강의 시간표' },
            { key: 'syllabus', label: '강의계획서' },
            { key: 'course_materials', label: '강의 자료' },
            { key: 'assignments', label: '과제 관리' },
            { key: 'course_evaluation', label: '강의평가' }
        ]
    },
    { 
        label: '학생 관리', 
        icon: ICONS.users, 
        children: [
            { key: 'student_attendance', label: '수강생 출결' },
            { key: 'grade_management', label: '성적 관리' }
        ]
    }
];

const STUDENT_MENU_STRUCTURE: MenuItem[] = [
    // Home handled separately
    {
        label: '수강/성적',
        icon: ICONS.courses,
        children: [
            { key: 'course_registration', label: '수강 신청' },
            { key: 'timetable', label: '시간표 조회' },
            { key: 'current_grades', label: '금학기 성적' },
            { key: 'all_grades', label: '전체 성적' }
        ]
    },
    {
        label: '등록금',
        icon: ICONS.tuition,
        children: [
            { key: 'tuition_payment', label: '납부' },
            { key: 'tuition_history', label: '내역 조회' }
        ]
    },
    {
        label: '학적 변동',
        icon: ICONS.leave,
        children: [
            { key: 'leave_application', label: '휴학 신청' },
            { key: 'leave_history', label: '휴학 내역' },
            { key: 'return_application', label: '복학 신청' },
            { key: 'return_history', label: '복학 내역' }
        ]
    },
    { key: 'graduation_check', label: '졸업 요건', icon: ICONS.graduation },
    { key: 'certificate_issuance', label: '증명서', icon: ICONS.profile }
];

const ADMIN_MENU_STRUCTURE: MenuItem[] = [
    { key: 'manage_users', label: '사용자 관리', icon: ICONS.users },
    { key: 'manage_system', label: '시스템 관리', icon: ICONS.system }
];

interface HeaderProps {
    user: User;
    activeView: string;
    setActiveView: (view: string) => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, activeView, setActiveView, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    
    const navRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const menuStructure = user.role === 'professor' ? PROFESSOR_MENU_STRUCTURE 
                        : user.role === 'student' ? STUDENT_MENU_STRUCTURE 
                        : ADMIN_MENU_STRUCTURE;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavClick = (key: string) => {
        setActiveView(key);
        setMobileMenuOpen(false);
        setOpenDropdown(null);
    };

    // Helper to render menu items (desktop)
    const renderDesktopMenu = () => {
        return menuStructure.map((item, index) => {
            // Skip "Student Home" or "Professor Home" keys if they exist in structure, as they are handled by logo
            if (item.key === 'student_home' || item.key === 'professor_home') return null;

            if (item.children) {
                const isActive = item.children.some(child => child.key === activeView);
                const isOpen = openDropdown === item.label;
                
                return (
                    <div key={index} className="relative">
                        <button 
                            onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors whitespace-nowrap ${isActive ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                        >
                            {item.label}
                            <svg className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {isOpen && (
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down z-50">
                                {item.children.map(child => (
                                    <button
                                        key={child.key}
                                        onClick={() => handleNavClick(child.key)}
                                        className={`block w-full text-left px-4 py-2 text-sm whitespace-nowrap ${activeView === child.key ? 'bg-blue-50 text-brand-blue font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
            
            return (
                <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key!)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeView === item.key ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                >
                    {item.label}
                </button>
            );
        });
    };

    return (
        <header className="bg-white border-b border-brand-gray shadow-sm sticky top-0 z-50 h-16 flex-shrink-0 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
                
                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between items-center h-full relative">
                    
                    {/* Left Section: Logo & Back Button */}
                    <div className="flex items-center">
                        <div 
                            className="flex items-center cursor-pointer" 
                            onClick={() => handleNavClick(user.role === 'professor' ? 'professor_home' : 'student_home')}
                        >
                             <span className="text-brand-blue mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                </svg>
                            </span>
                            <span className="font-bold text-brand-blue text-xl tracking-tight whitespace-nowrap">학사 관리 시스템</span>
                        </div>
                        
                    </div>

                    {/* Center Section: Navigation */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-20" ref={navRef}>
                        {/* Common Links */}
                        <button 
                            onClick={() => handleNavClick('announcements')}
                            className={`text-sm font-medium transition-colors whitespace-nowrap ${activeView === 'announcements' ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                        >
                            공지사항
                        </button>
                        <button 
                            onClick={() => handleNavClick('calendar')}
                            className={`text-sm font-medium transition-colors whitespace-nowrap ${activeView === 'calendar' ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                        >
                            학사일정
                        </button>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-300 mx-1"></div>

                        {/* Dynamic Menu Items (Management) */}
                        {renderDesktopMenu()}

                        {/* Placeholder for "Research/Admin" for professors */}
                        {user.role === 'professor' && (
                             <button 
                                onClick={() => handleNavClick('dashboard')} // Placeholder
                                className="text-sm font-medium text-slate-600 hover:text-brand-blue whitespace-nowrap"
                            >
                                연구/행정
                            </button>
                        )}
                    </div>

                    {/* Right Section: Profile */}
                     <div className="flex items-center relative z-20" ref={profileRef}>
                         <div 
                            className="flex items-center cursor-pointer py-1.5 px-2 rounded-full hover:bg-slate-50 transition-colors"
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        >
                             <div className="text-right mr-3">
                                <p className="text-sm font-bold text-slate-800 leading-tight whitespace-nowrap">{user.name}</p>
                                <p className="text-xs text-slate-500 capitalize leading-tight whitespace-nowrap">{user.role}</p>
                            </div>
                             <img 
                                className="h-9 w-9 rounded-full border border-slate-200 object-cover" 
                                src={user.avatarUrl} 
                                alt={user.name} 
                            />
                            <svg className="ml-2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <button onClick={() => {handleNavClick('profile'); setProfileDropdownOpen(false);}} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                                    내 정보 관리
                                </button>
                                <button onClick={() => {onLogout(); setProfileDropdownOpen(false);}} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 whitespace-nowrap">
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                </div>


                {/* Mobile Layout */}
                <div className="md:hidden flex justify-between items-center h-full">
                     <div className="flex items-center" onClick={() => handleNavClick(user.role === 'professor' ? 'professor_home' : 'student_home')}>
                        <span className="text-brand-blue mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            </svg>
                        </span>
                        <span className="font-bold text-brand-blue text-lg">학사 관리</span>
                    </div>
                    
                    <div className="flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-brand-blue hover:bg-slate-100"
                        >
                             <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Drawer) */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-200 absolute w-full z-50 shadow-xl">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center">
                        <img src={user.avatarUrl} className="h-8 w-8 rounded-full mr-3" alt="" />
                        <div>
                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <button onClick={() => handleNavClick('announcements')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">공지사항</button>
                         <button onClick={() => handleNavClick('calendar')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">학사일정</button>
                         
                        {menuStructure.map((item, index) => (
                            <div key={index}>
                                {item.children ? (
                                    <div className="space-y-1">
                                        <div className="px-3 py-2 text-base font-bold text-brand-blue flex items-center bg-blue-50 rounded-md">
                                            {item.label}
                                        </div>
                                        <div className="pl-6 space-y-1">
                                            {item.children.map(child => (
                                                <button
                                                    key={child.key}
                                                    onClick={() => handleNavClick(child.key)}
                                                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === child.key ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                                                >
                                                    {child.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        key={item.key}
                                        onClick={() => handleNavClick(item.key!)}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        {item.label}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 pb-4 border-t border-slate-200">
                         <button
                            onClick={onLogout}
                            className="flex w-full items-center px-5 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeViewKey, setActiveViewKey] = useState<string>('dashboard');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveViewKey(loggedInUser.role === 'professor' ? 'professor_home' : (loggedInUser.role === 'student' ? 'student_home' : 'dashboard'));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveViewKey('dashboard');
  };

  // Determine the view to render
  let activeViewItem = ALL_VIEWS.find(v => v.key === activeViewKey);
  
  // Fallback if view not found or role mismatch (simple protection)
  if (!activeViewItem || (user && !activeViewItem.roles.includes(user.role))) {
      if (user?.role === 'student') activeViewItem = ALL_VIEWS.find(v => v.key === 'student_home');
      else if (user?.role === 'professor') activeViewItem = ALL_VIEWS.find(v => v.key === 'professor_home');
      else activeViewItem = ALL_VIEWS.find(v => v.key === 'dashboard');
  }

  const ActiveComponent = activeViewItem?.component || (() => <div>View Not Found</div>);
  
  const isRootView = ['student_home', 'professor_home', 'dashboard'].includes(activeViewKey);
  const isFullWidthView = activeViewKey === 'professor_home' || activeViewKey === 'student_home';

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-brand-gray-light font-sans text-slate-800 overflow-hidden">
      <Header 
        user={user} 
        activeView={activeViewKey} 
        setActiveView={setActiveViewKey} 
        onLogout={handleLogout}
      />
      
      {/* Conditional Rendering for Layout: Full Width for ProfessorHome/StudentHome vs Centered Box for others */}
      {/* Changed overflow-hidden to overflow-y-auto to allow scrolling on small screens where content exceeds height */}
      <main className={`flex-1 relative ${isFullWidthView ? 'bg-white overflow-x-hidden overflow-y-auto' : 'bg-brand-gray-light p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto'}`}>
           <div className={isFullWidthView ? 'w-full h-full' : 'max-w-7xl mx-auto pb-10'}>
                <ActiveComponent user={user} setActiveView={setActiveViewKey} />
           </div>
      </main>
    </div>
  );
};

export default App;
