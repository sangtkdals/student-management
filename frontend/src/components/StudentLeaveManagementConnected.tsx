import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Input } from './ui';
import { getAllLeaveApplications, createLeaveApplication } from '../api/services';

interface StudentLeaveManagementProps {
    defaultTab?: 'leave' | 'return' | 'history';
    user?: { id: string };
}

interface HistoryItem {
    id: number;
    type: string;
    category: string;
    year: number;
    semester: number;
    date: string;
    status: string;
    statusColor: string;
    reason?: string;
    rejectReason?: string;
    contactNumber?: string;
    address?: string;
    documents?: string[];
}

export const StudentLeaveManagementConnected: React.FC<StudentLeaveManagementProps> = ({ defaultTab = 'leave', user }) => {
    const [activeTab, setActiveTab] = useState<'leave' | 'return' | 'history'>(defaultTab);
    const [leaveType, setLeaveType] = useState('GENERAL');
    const [leaveReason, setLeaveReason] = useState('');
    const [returnType, setReturnType] = useState('GENERAL');
    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadApplicationHistory();
    }, []);

    const loadApplicationHistory = async () => {
        try {
            setIsLoading(true);
            const applications = await getAllLeaveApplications();

            const statusMap: { [key: string]: string } = {
                'PENDING': '검토중',
                'APPROVED': '승인',
                'REJECTED': '거절'
            };

            const statusColorMap: { [key: string]: string } = {
                'PENDING': 'bg-yellow-100 text-yellow-800',
                'APPROVED': 'bg-green-100 text-green-800',
                'REJECTED': 'bg-red-100 text-red-800'
            };

            const typeMap: { [key: string]: string } = {
                'GENERAL': '일반휴학',
                'MILITARY': '군입대휴학',
                'ILLNESS': '질병휴학',
                'PREGNANCY': '육아휴학'
            };

            const historyItems: HistoryItem[] = applications.map((app: any) => ({
                id: app.applicationId || app.applicationid,
                type: '휴학',
                category: typeMap[app.leaveType || app.leavetype] || app.leaveType || app.leavetype,
                year: app.startYear || app.startyear,
                semester: app.startSemester || app.startsemester,
                date: new Date(app.applicationDate || app.applicationdate).toISOString().split('T')[0],
                status: statusMap[app.approvalStatus || app.approvalstatus] || '검토중',
                statusColor: statusColorMap[app.approvalStatus || app.approvalstatus] || 'bg-yellow-100 text-yellow-800',
                reason: app.applicationReason || app.applicationreason || '',
                rejectReason: app.rejectReason || app.rejectreason || '',
                contactNumber: '010-1234-5678',
                address: '서울시 강남구 테헤란로 123'
            }));

            setHistory(historyItems);
        } catch (error) {
            console.error('Failed to load applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeaveSubmit = async () => {
        if (!leaveReason.trim()) {
            alert('휴학 사유를 입력해주세요.');
            return;
        }

        try {
            const applicationData = {
                stuNo: user?.id || 'aaa',
                leaveType: leaveType,
                startYear: 2025,
                startSemester: 1,
                endYear: 2025,
                endSemester: 2,
                applicationReason: leaveReason
            };

            await createLeaveApplication(applicationData);
            alert('휴학 신청이 정상적으로 접수되었습니다.');
            setLeaveReason('');
            setActiveTab('history');
            await loadApplicationHistory();
        } catch (error) {
            console.error('Failed to submit leave application:', error);
            alert('휴학 신청 중 오류가 발생했습니다.');
        }
    };

    const handleReturnSubmit = () => {
        alert('복학 신청 기능은 현재 개발 중입니다.');
    };

    const toggleExpand = (itemId: number) => {
        setExpandedItemId(expandedItemId === itemId ? null : itemId);
    };

    const ApplyLeaveTab = useMemo(() => (
        <div className="space-y-6 max-w-2xl w-full mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex flex-col md:flex-row items-start">
                    <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-3">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-0 md:ml-3">
                        <p className="text-sm text-yellow-700 leading-relaxed">
                            휴학 신청 전 반드시 도서관 미반납 도서 및 미납 연체료를 확인해 주시기 바랍니다.
                            <br className="hidden md:block"/> 일반 휴학은 1회에 1년(2학기)까지 신청 가능하며, 재학 중 통산 3년(6학기)을 초과할 수 없습니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">신청 년도/학기</label>
                    <input type="text" value="2025년 1학기" disabled className="block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">휴학 구분</label>
                    <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
                    >
                        <option value="GENERAL">일반휴학</option>
                        <option value="MILITARY">군입대휴학</option>
                        <option value="ILLNESS">질병휴학</option>
                        <option value="PREGNANCY">육아휴학</option>
                    </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <Input label="연락처 (비상연락망)" defaultValue="010-1234-5678" />
                </div>
                <div className="col-span-1 md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">휴학 사유</label>
                     <textarea
                        rows={4}
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="구체적인 휴학 사유를 입력하세요."
                    ></textarea>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">증빙 서류 첨부 (해당자)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-slate-50 transition-colors">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-brand-blue-dark focus-within:outline-none">
                                    <span>파일 업로드</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1 pt-1 sm:pt-0">또는 드래그 앤 드롭</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button className="w-full md:w-auto" onClick={handleLeaveSubmit}>휴학 신청 제출</Button>
            </div>
        </div>
    ), [leaveType, leaveReason, handleLeaveSubmit]);

    const ApplyReturnTab = useMemo(() => (
        <div className="space-y-6 max-w-2xl w-full mx-auto">
             <div className="bg-blue-50 border-l-4 border-brand-blue p-4">
                <div className="flex flex-col md:flex-row items-start">
                    <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-3">
                        <svg className="h-5 w-5 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-0 md:ml-3">
                        <p className="text-sm text-blue-700 leading-relaxed">
                            복학 신청 기간은 학기 개시일로부터 4주 이내입니다.
                            <br className="hidden md:block"/> 군제대 복학자는 전역증 사본 또는 병적증명서를 첨부해야 합니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">복학 예정 학기</label>
                        <input type="text" value="2025년 1학기" disabled className="block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">복학 구분</label>
                        <select
                            value={returnType}
                            onChange={(e) => setReturnType(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
                        >
                            <option value="GENERAL">일반복학</option>
                            <option value="MILITARY">제대복학</option>
                        </select>
                    </div>
                 </div>

                 <Input label="연락처 (휴대전화)" defaultValue="010-1234-5678" />
                 <Input label="주소" defaultValue="서울시 강남구 테헤란로 123" />

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">증빙 서류 첨부 (제대복학 시)</label>
                    <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"/>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button className="w-full md:w-auto" onClick={handleReturnSubmit}>복학 신청 제출</Button>
            </div>
        </div>
    ), [returnType, handleReturnSubmit]);

    const HistoryTab = useMemo(() => (
        <div className="space-y-4">
            <p className="text-slate-600 mb-2 text-sm md:text-base">최근 3년간의 휴/복학 신청 내역입니다.</p>

            {isLoading ? (
                <div className="text-center py-12 text-slate-500">로딩 중...</div>
            ) : history.length === 0 ? (
                <div className="text-center py-12 text-slate-500">신청 내역이 없습니다.</div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <div className="overflow-hidden border border-slate-200 rounded-lg">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">신청일자</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">구분</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">세부구분</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">신청학기</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">상태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">상세</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {history.map(item => (
                                        <React.Fragment key={item.id}>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.type}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.year}년 {item.semester}학기</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.statusColor}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => toggleExpand(item.id)}
                                                        className="text-brand-blue hover:text-brand-blue-dark font-medium flex items-center"
                                                    >
                                                        {expandedItemId === item.id ? '접기' : '상세보기'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedItemId === item.id && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 bg-slate-50">
                                                        <div className="space-y-4 text-sm">
                                                            {item.reason && (
                                                                <div>
                                                                    <span className="font-semibold text-slate-700 block mb-1">{item.type} 사유:</span>
                                                                    <p className="text-slate-600 bg-white p-3 rounded border border-slate-200">
                                                                        {item.reason}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {item.rejectReason && (
                                                                <div>
                                                                    <span className="font-semibold text-red-700 block mb-1">거절 사유:</span>
                                                                    <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                                                        {item.rejectReason}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="md:hidden space-y-4">
                        {history.map(item => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${item.type === '휴학' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-sm font-bold text-slate-800">{item.category}</span>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.statusColor}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-sm mb-3">
                                         <div className="flex justify-between border-b border-slate-100 pb-2">
                                            <span className="text-slate-400">신청일자</span>
                                            <span className="text-slate-600">{item.date}</span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span className="text-slate-400">신청학기</span>
                                            <span className="text-slate-600">{item.year}년 {item.semester}학기</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleExpand(item.id)}
                                        className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-brand-blue font-medium rounded text-sm flex items-center justify-center transition-colors"
                                    >
                                        {expandedItemId === item.id ? '접기' : '상세보기'}
                                    </button>
                                </div>

                                {expandedItemId === item.id && (
                                    <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-200">
                                        <div className="space-y-3 text-sm">
                                            {item.reason && (
                                                <div>
                                                    <span className="font-semibold text-slate-700 block mb-1">{item.type} 사유</span>
                                                    <p className="text-slate-600 bg-white p-3 rounded border border-slate-200">
                                                        {item.reason}
                                                    </p>
                                                </div>
                                            )}

                                            {item.rejectReason && (
                                                <div>
                                                    <span className="font-semibold text-red-700 block mb-1">거절 사유</span>
                                                    <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                                        {item.rejectReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    ), [history, expandedItemId, isLoading]);

    return (
        <Card title="휴학/복학 관리">
            <div className="border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                <nav className="-mb-px flex space-x-8 min-w-max px-1">
                    <button
                        onClick={() => setActiveTab('leave')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'leave'
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        휴학 신청
                    </button>
                    <button
                        onClick={() => setActiveTab('return')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'return'
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        복학 신청
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'history'
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        신청 내역 조회
                    </button>
                </nav>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'leave' && ApplyLeaveTab}
                {activeTab === 'return' && ApplyReturnTab}
                {activeTab === 'history' && HistoryTab}
            </div>
        </Card>
    );
};
