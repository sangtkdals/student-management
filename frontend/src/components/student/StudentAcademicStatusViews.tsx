import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Modal } from "../ui";

// ==================== 휴학 신청 ====================
export const StudentLeaveApplication: React.FC = () => {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState<"general" | "military">("general");
  const [reason, setReason] = useState("");
  const [startSemester, setStartSemester] = useState({ year: 2025, semester: 1 });
  const [duration, setDuration] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setApplicationStatus("submitted");
      setIsModalOpen(false);
    }, 1500);
  };

  if (applicationStatus === "submitted") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="휴학 신청">
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">신청 완료</h3>
            <p className="text-slate-600 mb-4">휴학 신청이 정상적으로 제출되었습니다.</p>
            <div className="bg-slate-50 p-6 rounded-lg text-left max-w-md w-full mx-auto border border-slate-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">휴학 유형</span>
                <span className="font-bold text-slate-800">{leaveType === "general" ? "일반 휴학" : "군 휴학"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">신청 학기</span>
                <span className="font-bold text-slate-800">
                  {startSemester.year}년 {startSemester.semester}학기
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">휴학 기간</span>
                <span className="font-bold text-slate-800">{duration}학기</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">신청 일시</span>
                <span className="text-slate-800 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6 space-x-3">
              <Button variant="secondary" onClick={() => navigate("/student/leave-history")}>
                휴학 내역 조회
              </Button>
              <Button onClick={() => navigate("/student/home")}>홈으로</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="휴학 신청">
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-blue-800">휴학 신청 안내</h3>
                <p className="text-sm text-blue-700 mt-1">
                  휴학 신청 후 승인까지 3-5일 정도 소요됩니다.
                  <br />
                  군 휴학의 경우 입영통지서 사본을 학사팀에 제출해야 합니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">휴학 유형</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLeaveType("general")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  leaveType === "general"
                    ? "border-brand-blue bg-blue-50 text-brand-blue"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="font-bold mb-1">일반 휴학</div>
                <div className="text-xs">개인 사정으로 인한 휴학</div>
              </button>
              <button
                onClick={() => setLeaveType("military")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  leaveType === "military"
                    ? "border-brand-blue bg-blue-50 text-brand-blue"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="font-bold mb-1">군 휴학</div>
                <div className="text-xs">군 입대로 인한 휴학</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">휴학 시작 학기</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={startSemester.year}
                onChange={(e) => setStartSemester({ ...startSemester, year: parseInt(e.target.value) })}
                className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value={2025}>2025년</option>
                <option value={2026}>2026년</option>
              </select>
              <select
                value={startSemester.semester}
                onChange={(e) => setStartSemester({ ...startSemester, semester: parseInt(e.target.value) })}
                className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value={1}>1학기</option>
                <option value={2}>2학기</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">휴학 기간</label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value={1}>1학기</option>
              <option value={2}>2학기 (1년)</option>
              {leaveType === "military" && (
                <>
                  <option value={3}>3학기</option>
                  <option value={4}>4학기 (2년)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">휴학 사유</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="휴학 사유를 입력해주세요"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSubmit} disabled={!reason.trim()} className="px-8 py-3">
              휴학 신청하기
            </Button>
          </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => !isProcessing && setIsModalOpen(false)} title="휴학 신청 확인">
        <div className="space-y-4">
          <p className="text-slate-600">다음 내용으로 휴학을 신청하시겠습니까?</p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">휴학 유형</span>
              <span className="font-bold text-slate-800">{leaveType === "general" ? "일반 휴학" : "군 휴학"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">시작 학기</span>
              <span className="font-bold text-slate-800">
                {startSemester.year}년 {startSemester.semester}학기
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">휴학 기간</span>
              <span className="font-bold text-slate-800">{duration}학기</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 text-sm block mb-1">휴학 사유</span>
              <p className="text-sm text-slate-800">{reason}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>
              취소
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isProcessing} className="min-w-[100px]">
              {isProcessing ? "처리중..." : "신청하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ==================== 휴학 내역 조회 ====================
export const StudentLeaveHistory: React.FC = () => {
  const navigate = useNavigate();

  const leaveHistory = [
    {
      id: 1,
      type: "일반 휴학",
      startYear: 2024,
      startSemester: 1,
      duration: 2,
      reason: "개인 사정",
      status: "승인",
      applicationDate: "2023-12-15",
      approvalDate: "2023-12-18",
    },
    {
      id: 2,
      type: "군 휴학",
      startYear: 2022,
      startSemester: 2,
      duration: 4,
      reason: "군 입대",
      status: "완료",
      applicationDate: "2022-07-20",
      approvalDate: "2022-07-22",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      승인: "bg-green-100 text-green-800",
      대기: "bg-yellow-100 text-yellow-800",
      완료: "bg-slate-100 text-slate-600",
      반려: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="휴학 내역 조회">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-slate-600">휴학 신청 내역 및 처리 현황을 확인합니다.</p>
          <Button onClick={() => navigate("/student/leave-application")}>휴학 신청하기</Button>
        </div>

        {leaveHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500">휴학 신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaveHistory.map((leave) => (
              <div key={leave.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{leave.type}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(leave.status)}`}>{leave.status}</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {leave.startYear}년 {leave.startSemester}학기부터 {leave.duration}학기간
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">신청일</p>
                    <p className="text-sm font-medium text-slate-700">{leave.applicationDate}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">휴학 사유</span>
                    <span className="text-slate-800 font-medium">{leave.reason}</span>
                  </div>
                  {leave.approvalDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">승인일</span>
                      <span className="text-slate-800 font-medium">{leave.approvalDate}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// ==================== 복학 신청 ====================
export const StudentReturnApplication: React.FC = () => {
  const navigate = useNavigate();
  const [returnSemester, setReturnSemester] = useState({ year: 2025, semester: 2 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"idle" | "submitted">("idle");

  // 현재 휴학 중인 정보 (예시)
  const currentLeave = {
    type: "일반 휴학",
    startYear: 2024,
    startSemester: 1,
    duration: 2,
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setApplicationStatus("submitted");
      setIsModalOpen(false);
    }, 1500);
  };

  if (applicationStatus === "submitted") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="복학 신청">
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">신청 완료</h3>
            <p className="text-slate-600 mb-4">복학 신청이 정상적으로 제출되었습니다.</p>
            <div className="bg-slate-50 p-6 rounded-lg text-left max-w-md w-full mx-auto border border-slate-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">복학 학기</span>
                <span className="font-bold text-slate-800">
                  {returnSemester.year}년 {returnSemester.semester}학기
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">신청 일시</span>
                <span className="text-slate-800 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6 space-x-3">
              <Button variant="secondary" onClick={() => navigate("/student/return-history")}>
                복학 내역 조회
              </Button>
              <Button onClick={() => navigate("/student/home")}>홈으로</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="복학 신청">
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-blue-800">복학 신청 안내</h3>
                <p className="text-sm text-blue-700 mt-1">
                  복학 신청 후 승인까지 3-5일 정도 소요됩니다.
                  <br />
                  복학 신청 기간을 반드시 확인하시기 바랍니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-1.5 h-5 bg-brand-blue mr-2 rounded-sm"></span>
              현재 휴학 정보
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">휴학 유형</span>
                <span className="font-medium text-slate-800">{currentLeave.type}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">휴학 기간</span>
                <span className="font-medium text-slate-800">
                  {currentLeave.startYear}년 {currentLeave.startSemester}학기 ~ {currentLeave.duration}학기
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">복학 학기 선택</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={returnSemester.year}
                onChange={(e) => setReturnSemester({ ...returnSemester, year: parseInt(e.target.value) })}
                className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value={2025}>2025년</option>
                <option value={2026}>2026년</option>
              </select>
              <select
                value={returnSemester.semester}
                onChange={(e) => setReturnSemester({ ...returnSemester, semester: parseInt(e.target.value) })}
                className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value={1}>1학기</option>
                <option value={2}>2학기</option>
              </select>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-sm font-bold text-yellow-800">주의사항</h4>
                <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                  <li>복학 신청 기간 내에만 신청이 가능합니다.</li>
                  <li>군 복학의 경우 전역증 사본을 학사팀에 제출해야 합니다.</li>
                  <li>복학 승인 후 수강신청 기간을 확인하시기 바랍니다.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSubmit} className="px-8 py-3">
              복학 신청하기
            </Button>
          </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => !isProcessing && setIsModalOpen(false)} title="복학 신청 확인">
        <div className="space-y-4">
          <p className="text-slate-600">다음 내용으로 복학을 신청하시겠습니까?</p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">복학 학기</span>
              <span className="font-bold text-slate-800">
                {returnSemester.year}년 {returnSemester.semester}학기
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">현재 휴학 유형</span>
              <span className="font-medium text-slate-800">{currentLeave.type}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>
              취소
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isProcessing} className="min-w-[100px]">
              {isProcessing ? "처리중..." : "신청하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ==================== 복학 내역 조회 ====================
export const StudentReturnHistory: React.FC = () => {
  const navigate = useNavigate();

  const returnHistory = [
    {
      id: 1,
      returnYear: 2025,
      returnSemester: 1,
      previousLeaveType: "일반 휴학",
      status: "승인",
      applicationDate: "2024-11-20",
      approvalDate: "2024-11-23",
    },
    {
      id: 2,
      returnYear: 2024,
      returnSemester: 1,
      previousLeaveType: "군 휴학",
      status: "완료",
      applicationDate: "2023-12-10",
      approvalDate: "2023-12-13",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      승인: "bg-green-100 text-green-800",
      대기: "bg-yellow-100 text-yellow-800",
      완료: "bg-slate-100 text-slate-600",
      반려: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="복학 내역 조회">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-slate-600">복학 신청 내역 및 처리 현황을 확인합니다.</p>
          <Button onClick={() => navigate("/student/return-application")}>
            복학 신청하기
          </Button>
        </div>

        {returnHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500">복학 신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {returnHistory.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">
                        {item.returnYear}년 {item.returnSemester}학기 복학
                      </h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      이전 휴학: {item.previousLeaveType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">신청일</p>
                    <p className="text-sm font-medium text-slate-700">{item.applicationDate}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  {item.approvalDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">승인일</span>
                      <span className="text-slate-800 font-medium">{item.approvalDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">복학 학기</span>
                    <span className="text-slate-800 font-medium">
                      {item.returnYear}년 {item.returnSemester}학기
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
