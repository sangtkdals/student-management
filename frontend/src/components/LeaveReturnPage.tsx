import React, { useState } from 'react';
import Header from './Header';
import { Card, Button, Badge, InputGroup, SelectGroup } from './ui';
import { 
  MOCK_STUDENT_INFO, 
  MOCK_HISTORY, 
  LEAVE_REASONS, 
  RETURN_REASONS 
} from '../constants';
import type { ApplicationRecord, ApplicationType } from '../types';

interface LeaveReturnPageProps {
  onLogout: () => void;
}

type Tab = 'apply' | 'history';

const LeaveReturnPage: React.FC<LeaveReturnPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('apply');
  const [history, setHistory] = useState<ApplicationRecord[]>(MOCK_HISTORY);
  
  // Form State
  const [appType, setAppType] = useState<ApplicationType>('Leave');
  const [year, setYear] = useState<number>(2025);
  const [semester, setSemester] = useState<number>(1);
  const [reason, setReason] = useState<string>(LEAVE_REASONS[0].value);
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAppTypeChange = (type: ApplicationType) => {
    setAppType(type);
    setReason(type === 'Leave' ? LEAVE_REASONS[0].value : RETURN_REASONS[0].value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call
    setTimeout(() => {
      const newRecord: ApplicationRecord = {
        id: `new-${Date.now()}`,
        type: appType,
        year,
        semester,
        reason: reason as any,
        applyDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        detail: details
      };
      
      setHistory([newRecord, ...history]);
      setIsSubmitting(false);
      setActiveTab('history');
      alert('신청이 완료되었습니다.');
      
      // Reset form
      setDetails('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-gray-light">
      <Header isLoggedIn={true} userName={MOCK_STUDENT_INFO.name} onLogout={onLogout} />

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">휴학 / 복학 신청</h2>
          <p className="mt-2 text-slate-600">학사 일정에 맞춰 휴학 및 복학을 신청하고 결과를 확인할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Student Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-t-4 border-t-brand-blue">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                기본 정보
              </h3>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">성명</dt>
                  <dd className="font-medium text-slate-900">{MOCK_STUDENT_INFO.name}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">학번</dt>
                  <dd className="font-medium text-slate-900">{MOCK_STUDENT_INFO.studentId}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">소속</dt>
                  <dd className="font-medium text-slate-900">{MOCK_STUDENT_INFO.department}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">학년</dt>
                  <dd className="font-medium text-slate-900">{MOCK_STUDENT_INFO.grade}학년</dd>
                </div>
                <div className="flex justify-between pt-1">
                  <dt className="text-slate-500">현재 상태</dt>
                  <dd className="font-medium text-brand-blue">{MOCK_STUDENT_INFO.status}</dd>
                </div>
              </dl>
            </Card>

            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <h4 className="font-semibold text-blue-800 text-sm mb-2">💡 안내사항</h4>
              <ul className="text-xs text-blue-700 space-y-1.5 list-disc list-inside">
                <li>일반 휴학은 1회 1년(2학기) 이내 신청 가능합니다.</li>
                <li>군 휴학 신청 시 입영통지서 사본 첨부가 필수입니다.</li>
                <li>복학 신청은 개강일 이전까지 완료해야 수강신청이 가능합니다.</li>
                <li>신청 결과는 3-5일 이내 처리되며, 알림으로 안내됩니다.</li>
              </ul>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8">
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg border border-brand-gray mb-6 w-fit shadow-sm">
              <button
                onClick={() => setActiveTab('apply')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'apply' 
                    ? 'bg-brand-blue text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                신청하기
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'history' 
                    ? 'bg-brand-blue text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                신청내역 조회
              </button>
            </div>

            {activeTab === 'apply' ? (
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Application Type Selector */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-2">신청 구분</label>
                      <div className="flex space-x-3">
                        <label className={`flex-1 cursor-pointer border rounded-md p-3 flex items-center justify-center space-x-2 transition-all ${appType === 'Leave' ? 'border-brand-blue bg-blue-50 ring-1 ring-brand-blue' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input 
                            type="radio" 
                            name="appType" 
                            className="hidden" 
                            checked={appType === 'Leave'} 
                            onChange={() => handleAppTypeChange('Leave')} 
                          />
                          <span className={appType === 'Leave' ? 'font-bold text-brand-blue' : 'text-slate-600'}>휴학 신청</span>
                        </label>
                        <label className={`flex-1 cursor-pointer border rounded-md p-3 flex items-center justify-center space-x-2 transition-all ${appType === 'Return' ? 'border-brand-blue bg-blue-50 ring-1 ring-brand-blue' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input 
                            type="radio" 
                            name="appType" 
                            className="hidden" 
                            checked={appType === 'Return'} 
                            onChange={() => handleAppTypeChange('Return')} 
                          />
                          <span className={appType === 'Return' ? 'font-bold text-brand-blue' : 'text-slate-600'}>복학 신청</span>
                        </label>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="col-span-2 sm:col-span-1">
                      <SelectGroup
                        label={appType === 'Leave' ? '휴학 사유' : '복학 사유'}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        options={appType === 'Leave' ? LEAVE_REASONS : RETURN_REASONS}
                      />
                    </div>

                    {/* Year/Semester */}
                    <div className="col-span-2 sm:col-span-1">
                      <SelectGroup
                        label="대상 년도"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        options={[
                          { value: '2025', label: '2025년' },
                          { value: '2024', label: '2024년' },
                        ]}
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <SelectGroup
                        label="대상 학기"
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        options={[
                          { value: '1', label: '1학기' },
                          { value: '2', label: '2학기' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Detail Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      상세 사유 및 비고
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border border-slate-300 focus:ring-brand-blue focus:border-brand-blue px-3 py-2 shadow-sm text-sm focus:outline-none focus:ring-1 resize-none"
                      placeholder={appType === 'Leave' ? "휴학에 대한 구체적인 사유를 입력해주세요." : "복학 관련 특이사항이 있다면 입력해주세요."}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>

                  {/* File Attachment (Mock) */}
                  {appType === 'Leave' && reason !== 'General' && (
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200 border-dashed">
                      <label className="block text-sm font-medium text-slate-700 mb-2">증빙 서류 첨부</label>
                      <div className="flex items-center space-x-2">
                        <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"/>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">* 군 휴학: 입영통지서 / 질병 휴학: 진단서 (4주 이상)</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? '처리중...' : '신청서 제출하기'}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-brand-gray">
                    <p className="text-slate-500">신청 내역이 없습니다.</p>
                  </div>
                ) : (
                  history.map((record) => (
                    <Card key={record.id} className="p-5 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <Badge status={record.type} />
                          <span className="font-bold text-slate-800 text-lg">
                            {record.year}년 {record.semester}학기 {record.type === 'Leave' ? '휴학' : '복학'}
                          </span>
                        </div>
                        <Badge status={record.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="block text-slate-500 text-xs mb-1">신청일</span>
                          <span className="text-slate-800 font-medium">{record.applyDate}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 text-xs mb-1">사유</span>
                          <span className="text-slate-800 font-medium">
                            {[...LEAVE_REASONS, ...RETURN_REASONS].find(r => r.value === record.reason)?.label || record.reason}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                           {record.detail && (
                             <>
                              <span className="block text-slate-500 text-xs mb-1">비고</span>
                              <span className="text-slate-600 truncate block">{record.detail}</span>
                             </>
                           )}
                        </div>
                      </div>
                      
                      {record.status === 'Pending' && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                           <button className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline">
                             신청 취소
                           </button>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaveReturnPage;