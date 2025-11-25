import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Button } from './ui';
import { getAllLeaveApplications, updateLeaveApplicationStatus, getAllUsers } from '../api/services';

interface LeaveApplication {
    id: number;
    studentId: string;
    studentName: string;
    department: string;
    type: string;
    year: number;
    semester: number;
    endYear: number;
    endSemester: number;
    reason: string;
    date: string;
    status: '대기중' | '승인' | '반려';
    approverId?: string;
    approvalDate?: string;
    rejectReason?: string;
}

export const AdminLeaveManagementEnhanced: React.FC = () => {
    const [applications, setApplications] = useState<LeaveApplication[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<'all' | '대기중' | '승인' | '반려'>('all');
    const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [userMap, setUserMap] = useState<Map<string, any>>(new Map());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);

            // 사용자 정보 로드
            const users = await getAllUsers();
            const map = new Map();
            users.forEach((user: any) => {
                const id = user.mId || user.mid || user.mNo || user.mno;
                map.set(id, user);
            });
            setUserMap(map);

            await loadApplications();
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadApplications = async () => {
        try {
            const data = await getAllLeaveApplications();

            const statusMap: { [key: string]: '대기중' | '승인' | '반려' } = {
                'PENDING': '대기중',
                'APPROVED': '승인',
                'REJECTED': '반려'
            };

            const typeMap: { [key: string]: string } = {
                'GENERAL': '일반휴학',
                'MILITARY': '군입대휴학',
                'ILLNESS': '질병휴학',
                'PREGNANCY': '육아휴학'
            };

            const mappedApplications: LeaveApplication[] = data.map((app: any) => {
                const stuNo = app.stuNo || app.stuno || '';
                const user = userMap.get(stuNo);

                return {
                    id: app.applicationId || app.applicationid,
                    studentId: stuNo,
                    studentName: user ? (user.mName || user.mname || '알 수 없음') : '로딩중...',
                    department: user ? (user.deptCode || user.deptcode || '') : '',
                    type: typeMap[app.leaveType || app.leavetype] || (app.leaveType || app.leavetype),
                    year: app.startYear || app.startyear,
                    semester: app.startSemester || app.startsemester,
                    endYear: app.endYear || app.endyear,
                    endSemester: app.endSemester || app.endsemester,
                    reason: app.applicationReason || app.applicationreason || '',
                    date: new Date(app.applicationDate || app.applicationdate).toISOString().split('T')[0],
                    status: statusMap[app.approvalStatus || app.approvalstatus] || '대기중',
                    approverId: app.approverId || app.approverid,
                    approvalDate: app.approvalDate || app.approvaldate ? new Date(app.approvalDate || app.approvaldate).toISOString().split('T')[0] : undefined,
                    rejectReason: app.rejectReason || app.rejectreason
                };
            });

            setApplications(mappedApplications);
        } catch (error) {
            console.error('Failed to load applications:', error);
            alert('휴학/복학 신청 내역을 불러오는데 실패했습니다.');
        }
    };

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

    const handleApprove = async (id: number) => {
        if (window.confirm('해당 신청을 승인하시겠습니까?')) {
            try {
                await updateLeaveApplicationStatus(id, {
                    approvalStatus: 'APPROVED',
                    approverId: 'admin'
                });
                alert('승인되었습니다.');
                await loadApplications();
                setSelectedApplication(null);
            } catch (error) {
                console.error('Approval failed:', error);
                alert('승인 처리 중 오류가 발생했습니다.');
            }
        }
    };

    const openRejectModal = (id: number) => {
        setRejectingId(id);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectingId) return;

        if (!rejectReason.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }

        try {
            await updateLeaveApplicationStatus(rejectingId, {
                approvalStatus: 'REJECTED',
                approverId: 'admin',
                rejectReason: rejectReason
            });
            alert('반려되었습니다.');
            await loadApplications();
            setSelectedApplication(null);
            setShowRejectModal(false);
            setRejectingId(null);
            setRejectReason('');
        } catch (error) {
            console.error('Rejection failed:', error);
            alert('반려 처리 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <Card title="휴학/복학 관리">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-slate-600">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* 통계 대시보드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-slate-600 mb-2">전체 신청</p>
                        <p className="text-3xl font-bold text-brand-blue">{stats.total}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-slate-600 mb-2">대기중</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-slate-600 mb-2">승인</p>
                        <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-slate-600 mb-2">반려</p>
                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                </Card>
            </div>

            {/* 신청 목록 */}
            <Card title="휴학/복학 신청 관리">
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`px-4 py-2 rounded-md ${selectedStatus === 'all' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        전체 ({applications.length})
                    </button>
                    <button
                        onClick={() => setSelectedStatus('대기중')}
                        className={`px-4 py-2 rounded-md ${selectedStatus === '대기중' ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        대기중 ({stats.pending})
                    </button>
                    <button
                        onClick={() => setSelectedStatus('승인')}
                        className={`px-4 py-2 rounded-md ${selectedStatus === '승인' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        승인 ({stats.approved})
                    </button>
                    <button
                        onClick={() => setSelectedStatus('반려')}
                        className={`px-4 py-2 rounded-md ${selectedStatus === '반려' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        반려 ({stats.rejected})
                    </button>
                </div>

                {filteredApplications.length > 0 ? (
                    <Table headers={['학번', '이름', '유형', '기간', '신청일', '상태', '작업']}>
                        {filteredApplications.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{app.studentId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{app.studentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {app.year}/{app.semester} ~ {app.endYear}/{app.endSemester}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        app.status === '대기중' ? 'bg-yellow-100 text-yellow-800' :
                                        app.status === '승인' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setSelectedApplication(app)}
                                        className="text-brand-blue hover:text-brand-blue-dark"
                                    >
                                        상세
                                    </button>
                                    {app.status === '대기중' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(app.id)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                승인
                                            </button>
                                            <button
                                                onClick={() => openRejectModal(app.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                반려
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </Table>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        {selectedStatus === 'all' ? '신청 내역이 없습니다.' : `${selectedStatus} 상태의 신청이 없습니다.`}
                    </div>
                )}
            </Card>

            {/* 상세 정보 모달 */}
            {selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedApplication(null)}>
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">신청 상세 정보</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-600">학번</label>
                                    <p className="text-lg">{selectedApplication.studentId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600">이름</label>
                                    <p className="text-lg">{selectedApplication.studentName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600">유형</label>
                                    <p className="text-lg">{selectedApplication.type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600">신청일</label>
                                    <p className="text-lg">{selectedApplication.date}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600">시작 학기</label>
                                    <p className="text-lg">{selectedApplication.year}년 {selectedApplication.semester}학기</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600">종료 학기</label>
                                    <p className="text-lg">{selectedApplication.endYear}년 {selectedApplication.endSemester}학기</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-600">신청 사유</label>
                                <p className="mt-1 p-3 bg-slate-50 rounded border">{selectedApplication.reason}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-600">처리 상태</label>
                                <p className="mt-1">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        selectedApplication.status === '대기중' ? 'bg-yellow-100 text-yellow-800' :
                                        selectedApplication.status === '승인' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedApplication.status}
                                    </span>
                                </p>
                            </div>
                            {selectedApplication.approvalDate && (
                                <div>
                                    <label className="text-sm font-medium text-slate-600">처리일</label>
                                    <p className="text-lg">{selectedApplication.approvalDate}</p>
                                </div>
                            )}
                            {selectedApplication.rejectReason && (
                                <div>
                                    <label className="text-sm font-medium text-slate-600">반려 사유</label>
                                    <p className="mt-1 p-3 bg-red-50 rounded border border-red-200 text-red-800">{selectedApplication.rejectReason}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            {selectedApplication.status === '대기중' && (
                                <>
                                    <Button onClick={() => handleApprove(selectedApplication.id)}>승인</Button>
                                    <Button onClick={() => { openRejectModal(selectedApplication.id); setSelectedApplication(null); }}>반려</Button>
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

            {/* 반려 사유 입력 모달 */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowRejectModal(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">신청 반려</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">반려 사유</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="반려 사유를 입력해주세요..."
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                            >
                                취소
                            </button>
                            <Button onClick={handleRejectConfirm}>반려 확정</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
