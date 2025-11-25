import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Card, Table } from './ui';
import { getTuitionByStudent } from '../api/services';

interface TuitionRecord {
    tuitionId: number;
    academicYear: number;
    semester: number;
    tuitionAmount: number;
    scholarshipAmount: number;
    paidAmount: number;
    billDate: string;
    dueDate: string;
    paidDate: string;
    paymentStatus: string;
}

export const StudentTuitionHistoryConnected: React.FC<{ user: User }> = ({ user }) => {
    const [tuitionRecords, setTuitionRecords] = useState<TuitionRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTuitionHistory();
    }, []);

    const loadTuitionHistory = async () => {
        try {
            setLoading(true);
            const data = await getTuitionByStudent(user.id);

            const mappedRecords: TuitionRecord[] = data.map((t: any) => ({
                tuitionId: t.tuitionId || t.tuitionid,
                academicYear: t.academicYear || t.academicyear || 0,
                semester: t.semester || 0,
                tuitionAmount: t.tuitionAmount || t.tuitionamount || 0,
                scholarshipAmount: t.scholarshipAmount || t.scholarshipamount || 0,
                paidAmount: t.paidAmount || t.paidamount || 0,
                billDate: t.billDate || t.billdate || '',
                dueDate: t.dueDate || t.duedate || '',
                paidDate: t.paidDate || t.paiddate || '',
                paymentStatus: t.paymentStatus || t.paymentstatus || 'UNPAID'
            }));

            setTuitionRecords(mappedRecords);
        } catch (error) {
            console.error('Failed to load tuition history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'PAID') {
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">납부 완료</span>;
        } else if (status === 'UNPAID') {
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">미납</span>;
        } else if (status === 'OVERDUE') {
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">연체</span>;
        }
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">{status}</span>;
    };

    if (loading) {
        return (
            <Card title="등록금 납부 내역">
                <div className="flex justify-center items-center h-32">
                    <div className="text-slate-600">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="등록금 납부 내역">
            {tuitionRecords.length > 0 ? (
                <Table headers={['년도/학기', '등록금', '장학금', '납부액', '납부일', '상태']}>
                    {tuitionRecords.map(record => (
                        <tr key={record.tuitionId}>
                            <td className="px-6 py-4 text-sm">{record.academicYear} / {record.semester}</td>
                            <td className="px-6 py-4 text-sm">₩{record.tuitionAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm">₩{record.scholarshipAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm font-semibold">₩{record.paidAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm">{record.paidDate || '-'}</td>
                            <td className="px-6 py-4 text-sm">{getStatusBadge(record.paymentStatus)}</td>
                        </tr>
                    ))}
                </Table>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    등록금 납부 내역이 없습니다.
                </div>
            )}
        </Card>
    );
};

export const StudentTuitionPaymentConnected: React.FC<{ user: User }> = ({ user }) => {
    const [currentTuition, setCurrentTuition] = useState<TuitionRecord | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCurrentTuition();
    }, []);

    const loadCurrentTuition = async () => {
        try {
            setLoading(true);
            const data = await getTuitionByStudent(user.id);

            // 가장 최근 미납 등록금 찾기
            const unpaidRecords = data.filter((t: any) =>
                (t.paymentStatus || t.paymentstatus) === 'UNPAID'
            );

            if (unpaidRecords.length > 0) {
                const latest = unpaidRecords[unpaidRecords.length - 1];
                setCurrentTuition({
                    tuitionId: latest.tuitionId || latest.tuitionid,
                    academicYear: latest.academicYear || latest.academicyear || 0,
                    semester: latest.semester || 0,
                    tuitionAmount: latest.tuitionAmount || latest.tuitionamount || 0,
                    scholarshipAmount: latest.scholarshipAmount || latest.scholarshipamount || 0,
                    paidAmount: latest.paidAmount || latest.paidamount || 0,
                    billDate: latest.billDate || latest.billdate || '',
                    dueDate: latest.dueDate || latest.duedate || '',
                    paidDate: latest.paidDate || latest.paiddate || '',
                    paymentStatus: latest.paymentStatus || latest.paymentstatus || 'UNPAID'
                });
            }
        } catch (error) {
            console.error('Failed to load current tuition:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card title="등록금 납부">
                <div className="flex justify-center items-center h-32">
                    <div className="text-slate-600">로딩 중...</div>
                </div>
            </Card>
        );
    }

    if (!currentTuition) {
        return (
            <Card title="등록금 납부">
                <div className="text-center py-8 text-slate-500">
                    현재 납부할 등록금이 없습니다.
                </div>
            </Card>
        );
    }

    const finalAmount = currentTuition.tuitionAmount - currentTuition.scholarshipAmount;

    return (
        <Card title="등록금 납부">
            <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">{currentTuition.academicYear}년 {currentTuition.semester}학기 등록금</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-600">등록금</span>
                            <span className="font-semibold">₩{currentTuition.tuitionAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>장학금</span>
                            <span className="font-semibold">- ₩{currentTuition.scholarshipAmount.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between text-lg">
                            <span className="font-bold">납부 금액</span>
                            <span className="font-bold text-brand-blue">₩{finalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>납부 기한</span>
                            <span>{currentTuition.dueDate}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="font-bold">납부 방법 선택</h4>
                    <div className="space-y-2">
                        <button className="w-full p-3 border-2 border-brand-gray rounded-lg hover:border-brand-blue hover:bg-blue-50 text-left transition-colors">
                            <div className="font-semibold">가상계좌 입금</div>
                            <div className="text-sm text-slate-500">은행: 신한은행 | 계좌번호: 110-123-456789</div>
                        </button>
                        <button className="w-full p-3 border-2 border-brand-gray rounded-lg hover:border-brand-blue hover:bg-blue-50 text-left transition-colors">
                            <div className="font-semibold">카드 결제</div>
                            <div className="text-sm text-slate-500">신용카드 또는 체크카드로 납부</div>
                        </button>
                        <button className="w-full p-3 border-2 border-brand-gray rounded-lg hover:border-brand-blue hover:bg-blue-50 text-left transition-colors">
                            <div className="font-semibold">계좌이체</div>
                            <div className="text-sm text-slate-500">본인 계좌에서 직접 이체</div>
                        </button>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">유의사항</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                        <li>납부 기한을 꼭 확인해주세요.</li>
                        <li>가상계좌 입금 시 입금자명을 학번으로 입력해주세요.</li>
                        <li>납부 후 영수증은 자동으로 발급됩니다.</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};
