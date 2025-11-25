
import React, { useState, useEffect } from 'react';
import type { User, UserRole, Course } from './types';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import { ICONS, MOCK_COURSES, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from './constants';
import {
    StudentGraduationCheck,
    StudentCertificateIssuance, StudentTimetable
} from './components/StudentViews';
import {
    ProfessorMyLectures, ProfessorSyllabus, ProfessorCourseMaterials,
    ProfessorAssignments, ProfessorTimetable, ProfessorCourseEvaluation, ProfessorStudentManagement
} from './components/ProfessorViews';
import {
    AdminUserManagementConnected,
    AdminTuitionManagementConnected,
    AdminCourseManagementConnected
} from './components/AdminViewsConnected';
import { AdminLeaveManagementEnhanced } from './components/AdminLeaveManagementEnhanced';
import { AdminDashboardConnected } from './components/AdminDashboardConnected';
import {
    UserProfile
} from './components/CommonViews';
import { NoticeBoardConnected } from './components/NoticeBoardConnected';
import { AcademicCalendarConnected } from './components/AcademicCalendarConnected';
import { StudentLeaveManagementConnected } from './components/StudentLeaveManagementConnected';
import { StudentCourseRegistrationConnected } from './components/StudentCourseRegistrationConnected';
import { StudentAllGradesConnected, StudentCurrentGradesConnected } from './components/StudentGradesConnected';
import { StudentTuitionHistoryConnected, StudentTuitionPaymentConnected } from './components/StudentTuitionConnected';
import { AdminAnnouncementManagementConnected } from './components/AdminAnnouncementManagementConnected';
import { Card, Button } from './components/ui';

type ViewType = string;

interface NavItem {
    key: ViewType;
    label: string;
    icon: React.ReactElement;
    roles: UserRole[];
    component: React.ComponentType<any>;
}

const ALL_VIEWS: NavItem[] = [
    // Common
    { key: 'dashboard', label: '홈', icon: ICONS.dashboard, roles: ['student', 'professor', 'admin'], component: () => <></> },
    { key: 'profile', label: '내 정보', icon: ICONS.profile, roles: ['student', 'professor', 'admin'], component: UserProfile },
    { key: 'announcements', label: '공지사항', icon: ICONS.announcement, roles: ['student', 'professor', 'admin'], component: NoticeBoardConnected },
    { key: 'calendar', label: '학사일정', icon: ICONS.calendar, roles: ['student', 'professor', 'admin'], component: AcademicCalendarConnected },

    // Student Views
    { key: 'course_registration', label: '수강신청', icon: ICONS.courses, roles: ['student'], component: StudentCourseRegistrationConnected },
    { key: 'all_grades', label: '전체 성적 조회', icon: ICONS.grades, roles: ['student'], component: StudentAllGradesConnected },
    { key: 'tuition_history', label: '등록금 내역', icon: ICONS.tuition, roles: ['student'], component: StudentTuitionHistoryConnected },
    { key: 'leave_application', label: '휴학 신청', icon: ICONS.leave, roles: ['student'], component: StudentLeaveManagementConnected },
    { key: 'graduation_check', label: '졸업 요건', icon: ICONS.graduation, roles: ['student'], component: StudentGraduationCheck },
    { key: 'tuition_payment', label: '등록금 납부', icon: ICONS.tuition, roles: ['student'], component: StudentTuitionPaymentConnected },
    { key: 'leave_history', label: '휴학 내역', icon: ICONS.leave, roles: ['student'], component: StudentLeaveManagementConnected },
    { key: 'return_application', label: '복학 신청', icon: ICONS.leave, roles: ['student'], component: StudentLeaveManagementConnected },
    { key: 'return_history', label: '복학 내역', icon: ICONS.leave, roles: ['student'], component: StudentLeaveManagementConnected },
    { key: 'certificate_issuance', label: '증명서 발급', icon: ICONS.profile, roles: ['student'], component: StudentCertificateIssuance },
    { key: 'timetable', label: '시간표 조회', icon: ICONS.calendar, roles: ['student'], component: StudentTimetable },
    { key: 'current_grades', label: '금학기 성적', icon: ICONS.grades, roles: ['student'], component: StudentCurrentGradesConnected },

    // Professor Views
    { key: 'my_lectures', label: '강의 목록', icon: ICONS.courses, roles: ['professor'], component: ProfessorMyLectures },
    { key: 'student_management', label: '학생 관리', icon: ICONS.users, roles: ['professor'], component: ProfessorStudentManagement },
    { key: 'syllabus', label: '강의계획서', icon: ICONS.courses, roles: ['professor'], component: ProfessorSyllabus },
    { key: 'course_materials', label: '강의 자료', icon: ICONS.courses, roles: ['professor'], component: ProfessorCourseMaterials },
    { key: 'assignments', label: '과제 관리', icon: ICONS.courses, roles: ['professor'], component: ProfessorAssignments },
    { key: 'prof_timetable', label: '주간 시간표', icon: ICONS.calendar, roles: ['professor'], component: ProfessorTimetable },
    { key: 'course_evaluation', label: '강의평가', icon: ICONS.grades, roles: ['professor'], component: ProfessorCourseEvaluation },

    // Admin Views
    { key: 'manage_users', label: '사용자 관리', icon: ICONS.users, roles: ['admin'], component: AdminUserManagementConnected },
    { key: 'admin_tuition_management', label: '등록금 관리', icon: ICONS.tuition, roles: ['admin'], component: AdminTuitionManagementConnected },
    { key: 'admin_announcement_management', label: '공지사항 관리', icon: ICONS.announcement, roles: ['admin'], component: AdminAnnouncementManagementConnected },
    { key: 'admin_leave_management', label: '휴학/복학 관리', icon: ICONS.leave, roles: ['admin'], component: AdminLeaveManagementEnhanced },
    { key: 'system', label: '시스템 관리', icon: ICONS.system, roles: ['admin'], component: AdminCourseManagementConnected },
];

// Top Navigation Menu Structure
const STUDENT_MENU = [
    { label: '수강/성적', key: 'course_registration', sub: ['course_registration', 'timetable', 'all_grades'] },
    { label: '등록/장학', key: 'tuition_history', sub: ['tuition_payment', 'tuition_history'] },
    { label: '학적/졸업', key: 'leave_application', sub: ['leave_application', 'graduation_check', 'certificate_issuance'] },
];

const PROFESSOR_MENU = [
    { label: '강의 관리', key: 'my_lectures', sub: ['my_lectures', 'prof_timetable', 'syllabus'] },
    { label: '학생 관리', key: 'student_management', sub: ['student_management'] },
    { label: '연구/행정', key: 'course_evaluation', sub: ['course_evaluation', 'assignments'] },
];

const ADMIN_MENU = [
    { label: '사용자 관리', key: 'manage_users' },
    { label: '등록금 관리', key: 'admin_tuition_management' },
    { label: '공지사항 관리', key: 'admin_announcement_management' },
    { label: '휴학/복학 관리', key: 'admin_leave_management' },
    { label: '시스템 관리', key: 'system' },
];

const TopNavigation: React.FC<{ 
    user: User; 
    activeView: ViewType; 
    setActiveView: (view: ViewType) => void;
    onLogout: () => void;
}> = ({ user, activeView, setActiveView, onLogout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const menus = user.role === 'student' ? STUDENT_MENU : user.role === 'professor' ? PROFESSOR_MENU : ADMIN_MENU;

    return (
        <header className="bg-white border-b border-brand-gray sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => setActiveView('dashboard')}>
                        <svg className="w-8 h-8 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        <h1 className="ml-2 text-xl font-bold text-brand-blue">학사 관리 시스템</h1>
                    </div>

                    {/* Main Nav Links */}
                    <nav className="hidden md:flex space-x-8">
                        <button onClick={() => setActiveView('announcements')} className={`text-sm font-medium transition-colors ${activeView === 'announcements' ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}>공지사항</button>
                        <button onClick={() => setActiveView('calendar')} className={`text-sm font-medium transition-colors ${activeView === 'calendar' ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}>학사일정</button>
                        <div className="h-4 w-px bg-slate-300 my-auto"></div>
                        {menus.map((menu: any) => (
                            <button 
                                key={menu.key} 
                                onClick={() => setActiveView(menu.key)} 
                                className={`text-sm font-medium transition-colors ${activeView === menu.key || (menu.sub && menu.sub.includes(activeView)) ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}
                            >
                                {menu.label}
                            </button>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="relative">
                        <button 
                            className="flex items-center space-x-2 focus:outline-none"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-slate-700">{user.name}</div>
                                <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                            </div>
                            <img className="h-9 w-9 rounded-full border border-slate-200" src={user.avatarUrl} alt={user.name} />
                        </button>
                        
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                <button onClick={() => { setActiveView('profile'); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">내 정보</button>
                                <div className="border-t border-slate-100 my-1"></div>
                                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100">로그아웃</button>
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
                    <div key={course.id} className="flex items-start border-l-2 border-brand-blue pl-3 py-1">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{course.name}</p>
                            <p className="text-xs text-slate-500">{course.room} | {course.time.split(',')[0]}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${idx === 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                            {idx === 0 ? '수업중' : '예정'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm mb-2">할 일 (To-Do)</h4>
                <ul className="space-y-2">
                    <li className="flex items-center text-sm text-slate-600">
                        <input type="checkbox" className="mr-2 rounded text-brand-blue" />
                        <span>자료구조 과제 제출 (오늘 마감)</span>
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                        <input type="checkbox" className="mr-2 rounded text-brand-blue" />
                        <span>도서 반납하기</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const DashboardHero: React.FC<{ user: User, setActiveView: (view: ViewType) => void }> = ({ user, setActiveView }) => {
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
                                        <p className="text-blue-100 text-sm">{user.department}</p>
                                        <p className="text-blue-200 text-xs mt-1">
                                            {user.role === 'student' ? '학부생' : user.role === 'professor' ? '교수' : '관리자'} | {user.id}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                                        <span className="text-blue-100 text-sm">이메일</span>
                                        <span className="font-medium text-sm truncate max-w-[150px]">{user.email}</span>
                                    </div>
                                    <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                                        <span className="text-blue-100 text-sm">
                                            {user.role === 'student' ? '이번 학기 평점' : user.role === 'professor' ? '연구실' : '권한'}
                                        </span>
                                        <span className="font-medium text-sm">
                                            {user.role === 'student' ? '4.0 / 4.5' : user.role === 'professor' ? '공학관 401호' : '최고 관리자'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={() => setActiveView('profile')}
                                    className="w-full py-2 bg-white text-brand-blue font-bold rounded hover:bg-blue-50 transition-colors text-sm"
                                >
                                    내 정보 관리
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Schedule or Admin Info */}
                    <div className="lg:col-span-2">
                        {user.role === 'admin' ? (
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg h-full border border-white/20">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    시스템 현황
                                </h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-600 mb-1">서버 상태</p>
                                        <p className="text-lg font-bold text-green-600">정상 운영</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-600 mb-1">대기중 처리</p>
                                        <p className="text-lg font-bold text-yellow-600">확인 필요</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded-r">
                                        <p className="text-sm font-bold text-slate-800">시스템 공지</p>
                                        <p className="text-xs text-slate-600">정기 점검: 매주 일요일 02:00-04:00</p>
                                    </div>
                                    <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50 rounded-r">
                                        <p className="text-sm font-bold text-slate-800">백업 상태</p>
                                        <p className="text-xs text-slate-600">마지막 백업: {new Date().toLocaleDateString('ko-KR')}</p>
                                    </div>
                                    <div className="border-l-4 border-purple-500 pl-3 py-2 bg-purple-50 rounded-r">
                                        <p className="text-sm font-bold text-slate-800">접속 통계</p>
                                        <p className="text-xs text-slate-600">오늘 접속자: 실시간 통계 확인 가능</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm mb-3">빠른 작업</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setActiveView('admin_announcement_management')}
                                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200"
                                        >
                                            📢 공지 작성
                                        </button>
                                        <button
                                            onClick={() => setActiveView('admin_leave_management')}
                                            className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold hover:bg-yellow-200"
                                        >
                                            📝 휴학 승인
                                        </button>
                                        <button
                                            onClick={() => setActiveView('manage_users')}
                                            className="px-3 py-2 bg-green-100 text-green-700 rounded text-xs font-semibold hover:bg-green-200"
                                        >
                                            👥 사용자 관리
                                        </button>
                                        <button
                                            onClick={() => setActiveView('system')}
                                            className="px-3 py-2 bg-purple-100 text-purple-700 rounded text-xs font-semibold hover:bg-purple-200"
                                        >
                                            ⚙️ 시스템 설정
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <TodaySchedule />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardContent: React.FC<{ setActiveView: (view: ViewType) => void, user: User }> = ({ setActiveView, user }) => {
    // Admin인 경우 AdminDashboardConnected 사용
    if (user.role === 'admin') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6">
                <AdminDashboardConnected />
            </div>
        );
    }

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
                        <button onClick={() => setActiveView('announcements')} className="text-xs text-slate-500 hover:text-brand-blue">더보기 +</button>
                    </div>
                    <ul className="space-y-3">
                        {MOCK_ANNOUNCEMENTS.slice(0, 3).map(ann => (
                            <li key={ann.id} onClick={() => setActiveView('announcements')} className="cursor-pointer group">
                                <p className="text-sm text-slate-700 group-hover:text-brand-blue font-medium truncate">{ann.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{ann.date}</p>
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
                        <button onClick={() => setActiveView('calendar')} className="text-xs text-slate-500 hover:text-brand-blue">전체보기 +</button>
                    </div>
                    <ul className="space-y-3">
                         {MOCK_CALENDAR_EVENTS.slice(0, 3).map(evt => (
                            <li key={evt.id} className="flex items-start">
                                <div className="flex-shrink-0 w-12 text-center bg-slate-100 rounded p-1 mr-3">
                                    <p className="text-xs text-slate-500">{evt.startDate.split('-')[1]}월</p>
                                    <p className="text-sm font-bold text-slate-800">{evt.startDate.split('-')[2]}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{evt.title}</p>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${evt.category === 'academic' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                        {evt.category === 'academic' ? '학사' : '휴일'}
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
                        {user.role === 'student' ? (
                            <>
                                <button onClick={() => setActiveView('course_registration')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.courses}</div>
                                    <span className="text-xs font-bold">수강신청</span>
                                </button>
                                <button onClick={() => setActiveView('all_grades')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
                                    <span className="text-xs font-bold">성적조회</span>
                                </button>
                                <button onClick={() => setActiveView('tuition_history')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.tuition}</div>
                                    <span className="text-xs font-bold">등록금</span>
                                </button>
                                <button onClick={() => setActiveView('certificate_issuance')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.profile}</div>
                                    <span className="text-xs font-bold">증명서</span>
                                </button>
                            </>
                        ) : user.role === 'professor' ? (
                             <>
                                <button onClick={() => setActiveView('my_lectures')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.courses}</div>
                                    <span className="text-xs font-bold">내 강의</span>
                                </button>
                                <button onClick={() => setActiveView('student_management')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.users}</div>
                                    <span className="text-xs font-bold">학생 관리</span>
                                </button>
                                <button onClick={() => setActiveView('prof_timetable')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.calendar}</div>
                                    <span className="text-xs font-bold">시간표</span>
                                </button>
                                <button onClick={() => setActiveView('course_evaluation')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
                                    <span className="text-xs font-bold">강의평가</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setActiveView('manage_users')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.users}</div>
                                    <span className="text-xs font-bold">사용자 관리</span>
                                </button>
                                <button onClick={() => setActiveView('admin_tuition_management')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.tuition}</div>
                                    <span className="text-xs font-bold">등록금 관리</span>
                                </button>
                                <button onClick={() => setActiveView('admin_announcement_management')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.announcement}</div>
                                    <span className="text-xs font-bold">공지사항</span>
                                </button>
                                <button onClick={() => setActiveView('admin_leave_management')} className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center">
                                    <div className="mx-auto mb-1 w-6 h-6">{ICONS.leave}</div>
                                    <span className="text-xs font-bold">휴/복학</span>
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
    const [appState, setAppState] = useState<'landing' | 'auth' | 'main'>('landing');
    const [authRole, setAuthRole] = useState<UserRole>('student');
    const [activeView, setActiveView] = useState<ViewType>('dashboard');

    const navigateToAuth = (role: UserRole) => {
        setAuthRole(role);
        setAppState('auth');
    };

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setActiveView('dashboard');
        setAppState('main');
    };
    
    const handleLogout = () => {
        setUser(null);
        setAuthRole('student');
        setAppState('auth');
    };

    const renderView = () => {
        if (!user) return null;

        if (activeView === 'dashboard') {
            return <DashboardContent setActiveView={setActiveView} user={user} />;
        }

        const navItem = ALL_VIEWS.find(item => item.key === activeView);
        if (navItem) {
            const Component = navItem.component;
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button for sub-pages */}
                    <div className="mb-6">
                         <button onClick={() => setActiveView('dashboard')} className="flex items-center text-slate-600 hover:text-brand-blue transition-colors group">
                            <div className="p-1 rounded-full group-hover:bg-brand-blue-light transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="ml-2 font-medium text-sm">메인으로 돌아가기</span>
                        </button>
                    </div>
                    <Component user={user} setActiveView={setActiveView} />
                </div>
            );
        }
        return <div>페이지를 찾을 수 없습니다</div>;
    };

    if (appState === 'landing') {
        return <LandingPage onNavigateToAuth={navigateToAuth} />;
    }

    if (appState === 'auth') {
        return <Auth onLogin={handleLogin} onBack={() => setAppState('landing')} initialRole={authRole} />;
    }

    if (appState === 'main' && user) {
        return (
            <div className="min-h-screen bg-brand-gray-light flex flex-col">
                <TopNavigation 
                    user={user} 
                    activeView={activeView} 
                    setActiveView={setActiveView} 
                    onLogout={handleLogout} 
                />
                
                {/* Hero Section - Only visible on Dashboard */}
                {activeView === 'dashboard' && (
                    <DashboardHero user={user} setActiveView={setActiveView} />
                )}

                <main className="flex-1">
                    {renderView()}
                </main>

                 <footer className="bg-white border-t border-brand-gray mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="md:flex md:justify-between md:items-center">
                            <div className="text-sm text-slate-500">
                                &copy; {new Date().getFullYear()} University Academic System. All rights reserved.
                            </div>
                            <div className="mt-4 md:mt-0 flex space-x-6">
                                <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">개인정보처리방침</a>
                                <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">이용약관</a>
                                <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">연락처</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
    
    return <LandingPage onNavigateToAuth={navigateToAuth} />;
};

export default App;
