import React, { useState, useMemo } from 'react';
import { Card, Table, Button } from './ui';
import { MOCK_COURSES, MOCK_ANNOUNCEMENTS } from '../constants';
import type { Announcement } from '../types';

// ===== 관리자 대시보드 =====
export const AdminDashboard: React.FC = () => {
    const stats = {
        totalStudents: 1234,
        totalProfessors: 156,
        totalCourses: 289,
        pendingApplications: 12,
        unpaidTuition: 45,
        activeNotices: 8
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-500">총 학생 수</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalStudents.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-500">총 교수 수</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalProfessors}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-500">개설 강의 수</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalCourses}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-2">대기중인 휴학/복학 신청</h3>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingApplications}건</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-2">등록금 미납 학생</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.unpaidTuition}명</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-2">활성 공지사항</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.activeNotices}개</p>
                </Card>
            </div>
        </div>
    );
};

// ===== 학생/교수 명단 조회 =====
export const AdminUserManagement: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'professor'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock 데이터 확장
    const allUsers = useMemo(() => {
        const mockStudents = [
            { id: '20210001', name: '김민준', role: 'student' as const, email: 'minjun.kim@univ.ac.kr', department: '컴퓨터공학과', avatarUrl: 'https://picsum.photos/seed/s1/100' },
            { id: '20210002', name: '이하은', role: 'student' as const, email: 'haeun.lee@univ.ac.kr', department: '전자공학과', avatarUrl: 'https://picsum.photos/seed/s2/100' },
            { id: '20210003', name: '박서준', role: 'student' as const, email: 'seojun.park@univ.ac.kr', department: '기계공학과', avatarUrl: 'https://picsum.photos/seed/s3/100' },
            { id: '20210004', name: '최지우', role: 'student' as const, email: 'jiwoo.choi@univ.ac.kr', department: '경영학과', avatarUrl: 'https://picsum.photos/seed/s4/100' },
            { id: '20210005', name: '정수민', role: 'student' as const, email: 'sumin.jung@univ.ac.kr', department: '건축학과', avatarUrl: 'https://picsum.photos/seed/s5/100' },
            { id: '20210006', name: '강예린', role: 'student' as const, email: 'yerin.kang@univ.ac.kr', department: '화학공학과', avatarUrl: 'https://picsum.photos/seed/s6/100' },
            { id: '20210007', name: '윤도현', role: 'student' as const, email: 'dohyun.yoon@univ.ac.kr', department: '수학과', avatarUrl: 'https://picsum.photos/seed/s7/100' },
            { id: '20210008', name: '임서연', role: 'student' as const, email: 'seoyeon.lim@univ.ac.kr', department: '물리학과', avatarUrl: 'https://picsum.photos/seed/s8/100' },
        ];

        const mockProfessors = [
            { id: 'P001', name: '이서연', role: 'professor' as const, email: 's.lee@univ.ac.kr', department: '컴퓨터공학과', avatarUrl: 'https://picsum.photos/seed/p1/100' },
            { id: 'P002', name: '박지훈', role: 'professor' as const, email: 'jihun.park@univ.ac.kr', department: '컴퓨터공학과', avatarUrl: 'https://picsum.photos/seed/p2/100' },
            { id: 'P003', name: '최유진', role: 'professor' as const, email: 'yujin.choi@univ.ac.kr', department: '수학과', avatarUrl: 'https://picsum.photos/seed/p3/100' },
            { id: 'P004', name: '정하윤', role: 'professor' as const, email: 'hayoon.jung@univ.ac.kr', department: '물리학과', avatarUrl: 'https://picsum.photos/seed/p4/100' },
            { id: 'P005', name: '김태민', role: 'professor' as const, email: 'taemin.kim@univ.ac.kr', department: '전자공학과', avatarUrl: 'https://picsum.photos/seed/p5/100' },
        ];

        return [...mockStudents, ...mockProfessors];
    }, []);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            const matchesSearch = searchTerm === '' ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [allUsers, selectedRole, searchTerm]);

    const roleMap: { [key: string]: string } = {
        'student': '학생',
        'professor': '교수',
        'admin': '관리자',
    };

    return (
        <Card title="사용자 명단 조회">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedRole('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedRole === 'all'
                                ? 'bg-brand-blue text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setSelectedRole('student')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedRole === 'student'
                                ? 'bg-brand-blue text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        학생
                    </button>
                    <button
                        onClick={() => setSelectedRole('professor')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedRole === 'professor'
                                ? 'bg-brand-blue text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        교수
                    </button>
                </div>
                <div className="flex-1 md:max-w-xs">
                    <input
                        type="text"
                        placeholder="이름, ID, 학과 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            <div className="mb-4 text-sm text-slate-600">
                총 <span className="font-bold text-brand-blue">{filteredUsers.length}</span>명
            </div>

            <div className="overflow-x-auto">
                <Table headers={['사진', 'ID', '이름', '역할', '소속', '이메일', '관리']}>
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-slate-700">{user.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    user.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {roleMap[user.role]}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{user.department}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                            <td className="px-6 py-4 text-sm">
                                <button className="text-brand-blue hover:text-brand-blue-dark font-medium">
                                    상세보기
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
        </Card>
    );
};

// ===== 등록금 납부 현황 관리 =====
interface TuitionRecord {
    id: string;
    studentId: string;
    studentName: string;
    department: string;
    year: number;
    semester: number;
    amount: number;
    paidAmount: number;
    status: '완납' | '미납' | '부분납부';
    dueDate: string;
    paidDate?: string;
}

export const AdminTuitionManagement: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<'all' | '완납' | '미납' | '부분납부'>('all');

    const mockTuitionRecords: TuitionRecord[] = useMemo(() => [
        { id: 'T001', studentId: '20210001', studentName: '김민준', department: '컴퓨터공학과', year: 2024, semester: 1, amount: 4500000, paidAmount: 4500000, status: '완납', dueDate: '2024-03-15', paidDate: '2024-03-10' },
        { id: 'T002', studentId: '20210002', studentName: '이하은', department: '전자공학과', year: 2024, semester: 1, amount: 4500000, paidAmount: 0, status: '미납', dueDate: '2024-03-15' },
        { id: 'T003', studentId: '20210003', studentName: '박서준', department: '기계공학과', year: 2024, semester: 1, amount: 4500000, paidAmount: 4500000, status: '완납', dueDate: '2024-03-15', paidDate: '2024-03-12' },
        { id: 'T004', studentId: '20210004', studentName: '최지우', department: '경영학과', year: 2024, semester: 1, amount: 4500000, paidAmount: 2250000, status: '부분납부', dueDate: '2024-03-15', paidDate: '2024-03-14' },
        { id: 'T005', studentId: '20210005', studentName: '정수민', department: '건축학과', year: 2024, semester: 1, amount: 4500000, paidAmount: 0, status: '미납', dueDate: '2024-03-15' },
        { id: 'T006', studentId: '20210006', studentName: '강예린', department: '화학공학과', year: 2024, semester: 1, amount: 4500000, paidAmount: 4500000, status: '완납', dueDate: '2024-03-15', paidDate: '2024-03-08' },
    ], []);

    const filteredRecords = useMemo(() => {
        if (selectedStatus === 'all') return mockTuitionRecords;
        return mockTuitionRecords.filter(record => record.status === selectedStatus);
    }, [mockTuitionRecords, selectedStatus]);

    const stats = useMemo(() => {
        const total = mockTuitionRecords.length;
        const paid = mockTuitionRecords.filter(r => r.status === '완납').length;
        const unpaid = mockTuitionRecords.filter(r => r.status === '미납').length;
        const partial = mockTuitionRecords.filter(r => r.status === '부분납부').length;
        const totalAmount = mockTuitionRecords.reduce((sum, r) => sum + r.amount, 0);
        const paidAmount = mockTuitionRecords.reduce((sum, r) => sum + r.paidAmount, 0);

        return { total, paid, unpaid, partial, totalAmount, paidAmount };
    }, [mockTuitionRecords]);

    const getStatusColor = (status: string) => {
        switch(status) {
            case '완납': return 'bg-green-100 text-green-800';
            case '미납': return 'bg-red-100 text-red-800';
            case '부분납부': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">총 학생 수</h3>
                    <p className="text-2xl font-bold text-slate-800">{stats.total}명</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">완납</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.paid}명</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">미납</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.unpaid}명</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">부분납부</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.partial}명</p>
                </Card>
            </div>

            <Card title="등록금 납부 현황">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedStatus('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedStatus === 'all' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setSelectedStatus('완납')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedStatus === '완납' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            완납
                        </button>
                        <button
                            onClick={() => setSelectedStatus('미납')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedStatus === '미납' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            미납
                        </button>
                        <button
                            onClick={() => setSelectedStatus('부분납부')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedStatus === '부분납부' ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            부분납부
                        </button>
                    </div>
                    <Button>미납자 알림 발송</Button>
                </div>

                <div className="overflow-x-auto">
                    <Table headers={['학번', '이름', '학과', '학기', '등록금액', '납부금액', '납부율', '상태', '납부기한', '납부일']}>
                        {filteredRecords.map(record => {
                            const paymentRate = Math.round((record.paidAmount / record.amount) * 100);
                            return (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-700">{record.studentId}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.studentName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{record.department}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{record.year}-{record.semester}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">₩{record.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">₩{record.paidAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center">
                                            <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                                                <div
                                                    className={`h-2 rounded-full ${record.status === '완납' ? 'bg-green-500' : record.status === '미납' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${paymentRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium">{paymentRate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{record.dueDate}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{record.paidDate || '-'}</td>
                                </tr>
                            );
                        })}
                    </Table>
                </div>
            </Card>
        </div>
    );
};

// ===== 공지사항 전송/관리 =====
export const AdminAnnouncementManagement: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([...MOCK_ANNOUNCEMENTS]);
    const [isCreating, setIsCreating] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', author: '관리자' });

    const handleCreate = () => {
        if (!newAnnouncement.title || !newAnnouncement.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const announcement: Announcement = {
            id: `ANN${Date.now()}`,
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            author: newAnnouncement.author,
            date: new Date().toISOString().split('T')[0],
        };

        setAnnouncements([announcement, ...announcements]);
        setNewAnnouncement({ title: '', content: '', author: '관리자' });
        setIsCreating(false);
        alert('공지사항이 등록되었습니다.');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            setAnnouncements(announcements.filter(ann => ann.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <Card title="공지사항 관리">
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                        총 <span className="font-bold text-brand-blue">{announcements.length}</span>개의 공지사항
                    </p>
                    <Button onClick={() => setIsCreating(!isCreating)}>
                        {isCreating ? '취소' : '새 공지 작성'}
                    </Button>
                </div>

                {isCreating && (
                    <div className="mb-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">새 공지사항 작성</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                                <input
                                    type="text"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="공지사항 제목을 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">작성자</label>
                                <input
                                    type="text"
                                    value={newAnnouncement.author}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, author: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="작성자"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">내용</label>
                                <textarea
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="공지사항 내용을 입력하세요"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                                >
                                    취소
                                </button>
                                <Button onClick={handleCreate}>등록하기</Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {announcements.map(ann => (
                        <div key={ann.id} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{ann.title}</h3>
                                    <p className="text-sm text-slate-600 mb-2">{ann.content}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span>작성자: {ann.author}</span>
                                        <span>•</span>
                                        <span>{ann.date}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button className="px-3 py-1 text-sm text-brand-blue hover:bg-blue-50 rounded">
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ann.id)}
                                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

// ===== 휴학/복학 승인 관리 =====
interface LeaveApplication {
    id: number;
    studentId: string;
    name: string;
    department: string;
    type: '휴학' | '복학';
    category: string;
    year: number;
    semester: number;
    reason: string;
    date: string;
    status: '대기중' | '승인' | '반려';
}

let GLOBAL_ADMIN_LEAVE_APPLICATIONS: LeaveApplication[] = [
    { id: 1, studentId: '20210001', name: '김민준', department: '컴퓨터공학과', type: '휴학', category: '일반휴학', year: 2024, semester: 2, reason: '개인 사정', date: '2024-05-20', status: '대기중' },
    { id: 2, studentId: '20210002', name: '이하은', department: '전자공학과', type: '복학', category: '일반복학', year: 2024, semester: 2, reason: '휴학 기간 종료', date: '2024-05-21', status: '대기중' },
    { id: 3, studentId: '20210003', name: '박서준', department: '기계공학과', type: '휴학', category: '군입대휴학', year: 2024, semester: 2, reason: '군 입대', date: '2024-05-15', status: '승인' },
    { id: 4, studentId: '20210004', name: '최지우', department: '경영학과', type: '복학', category: '제대복학', year: 2024, semester: 1, reason: '군 제대', date: '2024-05-10', status: '반려' },
    { id: 5, studentId: '20210005', name: '정수민', department: '건축학과', type: '휴학', category: '질병휴학', year: 2024, semester: 2, reason: '건강상의 이유', date: '2024-05-22', status: '대기중' },
    { id: 6, studentId: '20210006', name: '강예린', department: '화학공학과', type: '휴학', category: '창업휴학', year: 2024, semester: 2, reason: '창업 준비', date: '2024-05-23', status: '대기중' },
];

export const AdminLeaveManagement: React.FC = () => {
    const [applications, setApplications] = useState<LeaveApplication[]>(GLOBAL_ADMIN_LEAVE_APPLICATIONS);
    const [selectedStatus, setSelectedStatus] = useState<'all' | '대기중' | '승인' | '반려'>('all');
    const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);

    const filteredApplications = useMemo(() => {
        if (selectedStatus === 'all') return applications;
        return applications.filter(app => app.status === selectedStatus);
    }, [applications, selectedStatus]);

    const stats = useMemo(() => {
        const total = applications.length;
        const pending = applications.filter(a => a.status === '대기중').length;
        const approved = applications.filter(a => a.status === '승인').length;
        const rejected = applications.filter(a => a.status === '반려').length;
        return { total, pending, approved, rejected };
    }, [applications]);

    const handleApprove = (id: number) => {
        if (window.confirm('해당 신청을 승인하시겠습니까?')) {
            const newApps = applications.map(app => app.id === id ? { ...app, status: '승인' as const } : app);
            setApplications(newApps);
            GLOBAL_ADMIN_LEAVE_APPLICATIONS = newApps;
            setSelectedApplication(null);
        }
    };

    const handleReject = (id: number) => {
        if (window.confirm('해당 신청을 반려하시겠습니까?')) {
            const newApps = applications.map(app => app.id === id ? { ...app, status: '반려' as const } : app);
            setApplications(newApps);
            GLOBAL_ADMIN_LEAVE_APPLICATIONS = newApps;
            setSelectedApplication(null);
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">총 신청</h3>
                    <p className="text-2xl font-bold text-slate-800">{stats.total}건</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">대기중</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}건</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">승인</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}건</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">반려</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}건</p>
                </Card>
            </div>

            <Card title="휴학/복학 신청 관리">
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedStatus === 'all' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setSelectedStatus('대기중')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedStatus === '대기중' ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        대기중
                    </button>
                    <button
                        onClick={() => setSelectedStatus('승인')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedStatus === '승인' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        승인
                    </button>
                    <button
                        onClick={() => setSelectedStatus('반려')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedStatus === '반려' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        반려
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <Table headers={['신청일자', '학번', '이름', '소속', '구분', '세부구분', '학기', '상태', '관리']}>
                        {filteredApplications.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.date}</td>
                                <td className="px-6 py-4 text-sm text-slate-700 font-mono">{app.studentId}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{app.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{app.department}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        app.type === '휴학' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {app.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{app.category}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{app.year}-{app.semester}</td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSelectedApplication(app)}
                                            className="text-brand-blue hover:text-brand-blue-dark font-medium"
                                        >
                                            상세
                                        </button>
                                        {app.status === '대기중' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(app.id)}
                                                    className="text-green-600 hover:text-green-700 font-medium"
                                                >
                                                    승인
                                                </button>
                                                <button
                                                    onClick={() => handleReject(app.id)}
                                                    className="text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    반려
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            </Card>

            {/* 상세 모달 */}
            {selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-800">신청 상세 정보</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">학번</label>
                                    <p className="text-slate-800 font-mono">{selectedApplication.studentId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">이름</label>
                                    <p className="text-slate-800">{selectedApplication.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">소속</label>
                                    <p className="text-slate-800">{selectedApplication.department}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">신청일자</label>
                                    <p className="text-slate-800">{selectedApplication.date}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">구분</label>
                                    <p className="text-slate-800">{selectedApplication.type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">세부구분</label>
                                    <p className="text-slate-800">{selectedApplication.category}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">신청학기</label>
                                    <p className="text-slate-800">{selectedApplication.year}년 {selectedApplication.semester}학기</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500">상태</label>
                                    <p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedApplication.status)}`}>
                                            {selectedApplication.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 block mb-1">신청 사유</label>
                                <p className="text-slate-800 bg-slate-50 p-4 rounded border border-slate-200">
                                    {selectedApplication.reason}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            {selectedApplication.status === '대기중' && (
                                <>
                                    <Button onClick={() => handleApprove(selectedApplication.id)}>승인</Button>
                                    <Button variant="danger" onClick={() => handleReject(selectedApplication.id)}>반려</Button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ===== 시스템 관리 (강의 관리) =====
export const AdminSystemManagement: React.FC = () => (
    <Card title="강의 관리">
        <div className="mb-4 flex justify-end">
            <Button>새 강의 개설</Button>
        </div>
        <Table headers={['과목코드', '과목명', '담당교수', '학점', '개설학과', '시간', '관리']}>
            {MOCK_COURSES.map(course => (
                <tr key={course.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-mono text-slate-700">{course.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{course.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.professor}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.credits}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.time}</td>
                    <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                            <button className="text-brand-blue hover:text-brand-blue-dark font-medium">수정</button>
                            <button className="text-red-600 hover:text-red-700 font-medium">삭제</button>
                        </div>
                    </td>
                </tr>
            ))}
        </Table>
    </Card>
);
