import React, { useState, useEffect } from 'react';
import { Card } from './ui';
import { getAllUsers, getAllCourses, getAllEnrollments, getAllLeaveApplications, getAllTuition, getAllAnnouncements } from '../api/services';

interface DashboardStats {
    totalStudents: number;
    totalProfessors: number;
    totalCourses: number;
    totalEnrollments: number;
    pendingLeaveApplications: number;
    totalAnnouncements: number;
    unpaidTuition: number;
    recentActivity: ActivityItem[];
}

interface ActivityItem {
    id: string;
    type: string;
    description: string;
    time: string;
}

export const AdminDashboardConnected: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalProfessors: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        pendingLeaveApplications: 0,
        totalAnnouncements: 0,
        unpaidTuition: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // 모든 데이터를 병렬로 로드
            const [users, courses, enrollments, leaveApps, tuitionRecords, announcements] = await Promise.all([
                getAllUsers(),
                getAllCourses(),
                getAllEnrollments(),
                getAllLeaveApplications(),
                getAllTuition(),
                getAllAnnouncements()
            ]);

            // 사용자 통계
            const students = users.filter((u: any) => (u.mType || u.mtype) === 'STUDENT');
            const professors = users.filter((u: any) => (u.mType || u.mtype) === 'PROFESSOR');

            // 대기중인 휴학 신청
            const pendingLeave = leaveApps.filter((app: any) =>
                (app.approvalStatus || app.approvalstatus) === 'PENDING'
            );

            // 미납 등록금
            const unpaid = tuitionRecords.filter((t: any) =>
                (t.paymentStatus || t.paymentstatus) === 'UNPAID' ||
                (t.paymentStatus || t.paymentstatus) === 'OVERDUE'
            );

            // 최근 활동 (공지사항 + 휴학신청)
            const recentActivity: ActivityItem[] = [];

            // 최근 공지사항 3개
            announcements.slice(0, 3).forEach((ann: any) => {
                recentActivity.push({
                    id: `ann-${ann.postId || ann.postid}`,
                    type: '공지사항',
                    description: ann.title || '',
                    time: ann.postDate || ann.postdate || ''
                });
            });

            // 최근 휴학신청 3개
            leaveApps.slice(0, 3).forEach((app: any) => {
                const status = app.approvalStatus || app.approvalstatus;
                const statusText = status === 'PENDING' ? '대기중' : status === 'APPROVED' ? '승인됨' : '반려됨';
                recentActivity.push({
                    id: `leave-${app.applicationId || app.applicationid}`,
                    type: '휴학신청',
                    description: `${app.stuNo || app.stuno} - ${statusText}`,
                    time: app.applicationDate || app.applicationdate || ''
                });
            });

            // 시간순 정렬
            recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

            setStats({
                totalStudents: students.length,
                totalProfessors: professors.length,
                totalCourses: courses.length,
                totalEnrollments: enrollments.length,
                pendingLeaveApplications: pendingLeave.length,
                totalAnnouncements: announcements.length,
                unpaidTuition: unpaid.length,
                recentActivity: recentActivity.slice(0, 6)
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-slate-600">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">관리자 대시보드</h1>

            {/* 주요 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">전체 학생</p>
                            <p className="text-3xl font-bold text-brand-blue">{stats.totalStudents}</p>
                        </div>
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">전체 교수</p>
                            <p className="text-3xl font-bold text-green-600">{stats.totalProfessors}</p>
                        </div>
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">개설 과목</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.totalCourses}</p>
                        </div>
                        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">총 수강신청</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.totalEnrollments}</p>
                        </div>
                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                </Card>
            </div>

            {/* 알림 및 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="대기중인 휴학신청">
                    <div className="text-center py-4">
                        <p className="text-5xl font-bold text-yellow-600">{stats.pendingLeaveApplications}</p>
                        <p className="text-sm text-slate-600 mt-2">건의 신청이 처리 대기중입니다</p>
                    </div>
                </Card>

                <Card title="미납 등록금">
                    <div className="text-center py-4">
                        <p className="text-5xl font-bold text-red-600">{stats.unpaidTuition}</p>
                        <p className="text-sm text-slate-600 mt-2">건의 미납 내역이 있습니다</p>
                    </div>
                </Card>

                <Card title="전체 공지사항">
                    <div className="text-center py-4">
                        <p className="text-5xl font-bold text-blue-600">{stats.totalAnnouncements}</p>
                        <p className="text-sm text-slate-600 mt-2">개의 공지사항이 등록되었습니다</p>
                    </div>
                </Card>
            </div>

            {/* 최근 활동 */}
            <Card title="최근 활동">
                {stats.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                        {stats.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        activity.type === '공지사항' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {activity.type}
                                    </span>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(activity.time).toLocaleDateString('ko-KR')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        최근 활동이 없습니다.
                    </div>
                )}
            </Card>

            {/* 빠른 작업 */}
            <Card title="빠른 작업">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-brand-blue transition-colors">
                        <svg className="w-8 h-8 mx-auto mb-2 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <p className="text-sm font-medium">사용자 추가</p>
                    </button>
                    <button className="p-4 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors">
                        <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-sm font-medium">과목 개설</p>
                    </button>
                    <button className="p-4 border border-slate-200 rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-colors">
                        <svg className="w-8 h-8 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        <p className="text-sm font-medium">공지 작성</p>
                    </button>
                    <button className="p-4 border border-slate-200 rounded-lg hover:bg-orange-50 hover:border-orange-500 transition-colors">
                        <svg className="w-8 h-8 mx-auto mb-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-sm font-medium">통계 보기</p>
                    </button>
                </div>
            </Card>
        </div>
    );
};
