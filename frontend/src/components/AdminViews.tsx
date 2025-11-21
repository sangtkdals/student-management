
import React, { useState } from 'react';
import { Card, Table, Button } from './ui';
import { MOCK_USERS, MOCK_COURSES } from '../constants';

export const AdminDashboard: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <h3 className="text-lg font-semibold text-slate-500">총 학생 수</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">1,234</p>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold text-slate-500">총 교수 수</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">156</p>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold text-slate-500">개설 강의 수</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">289</p>
        </Card>
    </div>
);

export const AdminUserManagement: React.FC = () => {
    const roleMap: { [key: string]: string } = {
        'student': '학생',
        'professor': '교수',
        'admin': '관리자',
    };
    return (
        <Card title="사용자 관리">
            <Table headers={['사용자 ID', '이름', '역할', '소속', '이메일']}>
                {Object.values(MOCK_USERS).map(user => (
                    <tr key={user.id}>
                        <td className="px-6 py-4 text-sm">{user.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-sm capitalize">{roleMap[user.role] || user.role}</td>
                        <td className="px-6 py-4 text-sm">{user.department}</td>
                        <td className="px-6 py-4 text-sm">{user.email}</td>
                    </tr>
                ))}
            </Table>
        </Card>
    );
};

// Global state for demo persistence
let GLOBAL_ADMIN_LEAVE_APPLICATIONS = [
    { id: 1, studentId: '20210001', name: '김민준', department: '컴퓨터공학과', type: '휴학', category: '일반휴학', date: '2024-05-20', status: '대기중' },
    { id: 2, studentId: '20210002', name: '이하은', department: '전자공학과', type: '복학', category: '일반복학', date: '2024-05-21', status: '대기중' },
    { id: 3, studentId: '20210003', name: '박서준', department: '기계공학과', type: '휴학', category: '군입대휴학', date: '2024-05-15', status: '승인' },
    { id: 4, studentId: '20210004', name: '최지우', department: '경영학과', type: '복학', category: '제대복학', date: '2024-05-10', status: '반려' },
    { id: 5, studentId: '20210005', name: '정수민', department: '건축학과', type: '휴학', category: '질병휴학', date: '2024-05-22', status: '대기중' },
];

export const AdminLeaveManagement: React.FC = () => {
    const [applications, setApplications] = useState(GLOBAL_ADMIN_LEAVE_APPLICATIONS);

    const handleApprove = (id: number) => {
        if (window.confirm('해당 신청을 승인하시겠습니까?')) {
             const newApps = applications.map(app => app.id === id ? { ...app, status: '승인' } : app);
             setApplications(newApps);
             GLOBAL_ADMIN_LEAVE_APPLICATIONS = newApps;
        }
    };

    const handleReject = (id: number) => {
         if (window.confirm('해당 신청을 반려하시겠습니까?')) {
             const newApps = applications.map(app => app.id === id ? { ...app, status: '반려' } : app);
             setApplications(newApps);
             GLOBAL_ADMIN_LEAVE_APPLICATIONS = newApps;
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case '승인': return 'bg-green-100 text-green-800';
            case '반려': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <Card title="휴학/복학 신청 관리">
            <div className="mb-4 flex justify-end">
                <div className="text-sm text-slate-500">
                    총 신청: <span className="font-bold text-slate-700">{applications.length}</span>건 | 
                    대기: <span className="font-bold text-orange-600">{applications.filter(a => a.status === '대기중').length}</span>건
                </div>
            </div>
            <Table headers={['신청일자', '학번', '이름', '소속', '구분', '세부구분', '상태', '관리']}>
                {applications.map(app => (
                    <tr key={app.id}>
                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{app.studentId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{app.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.department}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 whitespace-nowrap">{app.type}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{app.category}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                {app.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                            {app.status === '대기중' ? (
                                <div className="flex space-x-2">
                                    <Button size="sm" onClick={() => handleApprove(app.id)}>승인</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleReject(app.id)}>반려</Button>
                                </div>
                            ) : (
                                <span className="text-slate-400 text-xs">처리완료</span>
                            )}
                        </td>
                    </tr>
                ))}
            </Table>
        </Card>
    );
};

export const AdminSystemManagement: React.FC = () => (
    <Card title="강의 관리">
        <div className="mb-4 flex justify-end">
            <Button>새 강의 개설</Button>
        </div>
        <Table headers={['과목코드', '과목명', '담당교수', '학점', '개설학과']}>
            {MOCK_COURSES.map(course => (
                 <tr key={course.id}>
                    <td className="px-6 py-4 text-sm">{course.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{course.name}</td>
                    <td className="px-6 py-4 text-sm">{course.professor}</td>
                    <td className="px-6 py-4 text-sm">{course.credits}</td>
                    <td className="px-6 py-4 text-sm">{course.department}</td>
                </tr>
            ))}
        </Table>
    </Card>
);
