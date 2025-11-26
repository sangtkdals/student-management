import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Button } from './ui';
import { getAllTuition } from '../api/services';

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

export const AdminTuitionManagementConnected: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<'all' | '완납' | '미납' | '부분납부'>('all');
    const [tuitionRecords, setTuitionRecords] = useState<TuitionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadTuitionRecords();
    }, []);

    const loadTuitionRecords = async () => {
        try {
            setIsLoading(true);
            const data = await getAllTuition();

            const mappedRecords: TuitionRecord[] = data.map((record: any) => {
                const amount = record.tuitionAmount || record.tuitionamount || 0;
                const paidAmount = record.paidAmount || record.paidamount || 0;

                let status: '완납' | '미납' | '부분납부' = '미납';
                if (paidAmount >= amount) {
                    status = '완납';
                } else if (paidAmount > 0) {
                    status = '부분납부';
                }

                return {
                    id: String(record.tuitionId || record.tuitionid || record.id),
                    studentId: record.stuNo || record.stuno || '',
                    studentName: '학생', // 백엔드에서 조인 필요
                    department: '', // 백엔드에서 조인 필요
                    year: record.academicYear || record.academicyear || 2024,
                    semester: record.semester || 1,
                    amount: amount,
                    paidAmount: paidAmount,
                    status: status,
                    dueDate: record.dueDate || record.duedate || '2024-03-15',
                    paidDate: record.paymentDate || record.paymentdate || undefined
                };
            });

            setTuitionRecords(mappedRecords);
        } catch (error) {
            console.error('Failed to load tuition records:', error);
            alert('등록금 내역을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRecords = useMemo(() => {
        if (selectedStatus === 'all') return tuitionRecords;
        return tuitionRecords.filter(record => record.status === selectedStatus);
    }, [tuitionRecords, selectedStatus]);

    const stats = useMemo(() => {
        const total = tuitionRecords.length;
        const paid = tuitionRecords.filter(r => r.status === '완납').length;
        const unpaid = tuitionRecords.filter(r => r.status === '미납').length;
        const partial = tuitionRecords.filter(r => r.status === '부분납부').length;
        const totalAmount = tuitionRecords.reduce((sum, r) => sum + r.amount, 0);
        const paidAmount = tuitionRecords.reduce((sum, r) => sum + r.paidAmount, 0);

        return { total, paid, unpaid, partial, totalAmount, paidAmount };
    }, [tuitionRecords]);

    const getStatusColor = (status: string) => {
        switch(status) {
            case '완납': return 'bg-green-100 text-green-800';
            case '미납': return 'bg-red-100 text-red-800';
            case '부분납부': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    if (isLoading) {
        return (
            <Card title="등록금 납부 현황">
                <div className="flex justify-center items-center py-12">
                    <div className="text-slate-500">로딩 중...</div>
                </div>
            </Card>
        );
    }

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
                                    <td className="px-6 py-4 text-sm text-slate-600">{record.department || '-'}</td>
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
