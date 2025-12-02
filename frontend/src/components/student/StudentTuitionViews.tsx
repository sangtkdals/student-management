import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Modal } from "../ui";

export const StudentTuitionHistory: React.FC = () => {
  const navigate = useNavigate();

  const tuitionData = [
    {
      year: 2024,
      semester: "1학기",
      amount: "3,500,000원",
      status: "납부 완료",
      date: "2024-02-28",
    },
    {
      year: 2023,
      semester: "2학기",
      amount: "3,300,000원",
      status: "납부 완료",
      date: "2023-08-25",
    },
  ];

  const hasUnpaidTuition = false;

  return (
    <Card title="등록금 납부 내역 조회">
      <p className="mb-6 text-slate-600">등록금 납부 내역 및 상세 영수증을 확인합니다.</p>

      <div className="space-y-6">
        {tuitionData.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white">
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {item.year}년 {item.semester}
              </p>
              <p className="text-sm text-slate-600">
                금액: <span className="font-semibold">{item.amount}</span>
              </p>
              <p className={`text-sm font-medium ${item.status === "납부 완료" ? "text-green-600" : "text-red-600"}`}>상태: {item.status}</p>
            </div>
            <Button variant="secondary" onClick={() => navigate("/student/tuition-payment")}>
              자세히 보기
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t">
        <h3 className="text-lg font-bold text-slate-800 mb-4">미납 내역 (예시)</h3>

        {hasUnpaidTuition ? (
          <div className="text-red-600 p-4 border border-red-300 bg-red-50 rounded-lg">
            <p>2025년 1학기 등록금 미납 상태입니다.</p>
            <Button className="mt-3" onClick={() => navigate("/student/tuition-payment")}>
              등록금 납부하기
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center p-4 border border-blue-300 bg-blue-50 rounded-lg">
            <p className="text-slate-700">
              현재 <span className="font-semibold">미납된 등록금 내역은 없습니다.</span> 다음 학기 등록금 납부를 미리 확인하시려면 버튼을
              클릭해주세요.
            </p>
            <Button variant="primary" className="ml-4 flex-shrink-0" onClick={() => navigate("/student/tuition-payment")}>
              등록금 납부 페이지로 이동
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

type StudentTuitionPaymentProps = {
  setActiveView?: (viewName: string) => void;
};

export const StudentTuitionPayment: React.FC<StudentTuitionPaymentProps> = () => {
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid">("unpaid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeOptionalFee, setIncludeOptionalFee] = useState(true);

  const bill = {
    semester: "2024학년도 2학기",
    period: "2024.08.21 ~ 2024.08.27",
    tuition: 4500000,
    scholarship: 1500000,
    studentUnionFee: 20000,
    account: {
      bank: "우리은행",
      number: "1002-987-654321",
      holder: "대학교(김민준)",
    },
  };

  const finalAmount = bill.tuition - bill.scholarship + (includeOptionalFee ? bill.studentUnionFee : 0);
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  });

  const handlePaymentStart = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus("paid");
      setIsModalOpen(false);
    }, 2000);
  };

  if (paymentStatus === "paid") {
    return (
      <div className="space-y-8">
        <Card title="등록금 납부">
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">납부 완료</h3>
            <p className="text-slate-600 mb-4">2024학년도 2학기 등록금 납부가 정상적으로 처리되었습니다.</p>
            <div className="bg-slate-50 p-4 rounded-lg text-left max-w-sm w-full mx-auto border border-slate-200">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 text-sm">납부 금액</span>
                <span className="font-bold text-brand-blue">{formatter.format(finalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">납부 일시</span>
                <span className="text-slate-800 text-sm">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card title="등록금 고지서 조회 및 납부">
        <div className="space-y-6">
          {/* Warning Alert */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-red-800">미납 등록금이 있습니다.</h3>
                <p className="text-sm text-red-700 mt-1">
                  <span className="font-semibold">{bill.semester}</span> 납부 기간입니다. ({bill.period})
                  <br />
                  기한 내에 납부하지 않을 경우 수강신청 내역이 취소될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
              <span className="w-1.5 h-6 bg-brand-blue mr-2 rounded-sm"></span>
              등록금 고지 내역
            </h4>
            <div className="border border-brand-gray rounded-lg overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-brand-gray-light">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      항목
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">수업료 (Tuition)</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-800">{formatter.format(bill.tuition)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      장학금 (성적우수)
                      <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">감면</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-red-600 font-medium">- {formatter.format(bill.scholarship)}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 flex items-center">
                      <input
                        id="union-fee"
                        type="checkbox"
                        checked={includeOptionalFee}
                        onChange={(e) => setIncludeOptionalFee(e.target.checked)}
                        className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-slate-300 rounded mr-3 cursor-pointer"
                      />
                      <label htmlFor="union-fee" className="cursor-pointer select-none">
                        학생회비 (선택)
                      </label>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-slate-600">{formatter.format(bill.studentUnionFee)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td className="px-6 py-4 text-base font-bold text-slate-800">실 납부 금액</td>
                    <td className="px-6 py-4 text-xl font-bold text-right text-brand-blue">{formatter.format(finalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handlePaymentStart} className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transform transition-all active:scale-95">
              납부하기 (가상계좌)
            </Button>
          </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => !isProcessing && setIsModalOpen(false)} title="가상계좌 납부 안내">
        <div className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h4 className="font-bold text-xl text-slate-800">납부하실 금액</h4>
            <p className="text-3xl font-extrabold text-brand-blue tracking-tight">{formatter.format(finalAmount)}</p>
          </div>

          <div className="bg-slate-100 p-5 rounded-lg border border-slate-200 shadow-inner space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">입금 은행</span>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold mr-2">W</span>
                <span className="font-bold text-slate-800">{bill.account.bank}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
              <span className="text-slate-500 text-sm font-medium">계좌번호</span>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-800 text-lg tracking-wider block">{bill.account.number}</span>
                <span className="text-xs text-slate-400">예금주: {bill.account.holder}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-yellow-800">
              <span className="font-bold">주의사항:</span> 반드시 학생 본인 명의 또는 지정된 가상계좌로 입금해야 처리가 완료됩니다. <br />
              이체 후 아래 <span className="font-bold">'이체 완료 확인'</span> 버튼을 눌러주세요.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>
              취소
            </Button>
            <Button onClick={handleConfirmPayment} disabled={isProcessing} className="min-w-[140px]">
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  처리중...
                </span>
              ) : (
                "이체 완료 확인"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
