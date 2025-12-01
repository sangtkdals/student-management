import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, Input } from "../ui";

interface TuitionData {
  tuitionId: number;
  studentNo: string;
  studentName: string;
  department: string;
  academicYear: number;
  semester: number;
  amount: number;
  scholarship: number;
  paymentStatus: "PAID" | "UNPAID";
  paymentDate?: string;
}

export const AdminTuitionManagement: React.FC = () => {
  const [tuitionList, setTuitionList] = useState<TuitionData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentNo: "",
    year: new Date().getFullYear(),
    semester: 1,
    amount: 0,
    scholarship: 0
  });

  useEffect(() => {
    fetchTuitionList();
  }, []);

  const fetchTuitionList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/tuition/admin/list", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTuitionList(response.data);
    } catch (error) {
      console.error("Error fetching tuition list:", error);
      // MOCK 데이터 (API 연동 전 테스트용)
      setTuitionList([
        {
          tuitionId: 1,
          studentNo: "2024001",
          studentName: "김철수",
          department: "컴퓨터공학과",
          academicYear: 2024,
          semester: 1,
          amount: 4000000,
          scholarship: 1000000,
          paymentStatus: "UNPAID"
        },
        {
          tuitionId: 2,
          studentNo: "2024002",
          studentName: "이영희",
          department: "경영학과",
          academicYear: 2024,
          semester: 1,
          amount: 3500000,
          scholarship: 0,
          paymentStatus: "PAID",
          paymentDate: "2024-02-20"
        },
      ]);
    }
  };

  const handleConfirmPayment = async (id: number) => {
    if (confirm("해당 학생의 등록금을 '납부 완료' 처리하시겠습니까?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/tuition/${id}/confirm`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("납부 처리되었습니다.");
        fetchTuitionList();
      } catch (error) {
        console.error("Error confirming payment:", error);
        alert("처리 실패");
      }
    }
  };

  const handleCreateBill = async () => {
    if (!formData.studentNo || !formData.amount) {
      alert("학번과 등록금액을 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post("/api/tuition", formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("등록금 고지서가 생성되었습니다.");
      setIsModalOpen(false);
      setFormData({
        studentNo: "",
        year: new Date().getFullYear(),
        semester: 1,
        amount: 0,
        scholarship: 0
      });
      fetchTuitionList();
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("생성 실패");
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "PAID" ? (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">납부완료</span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">미납</span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="등록금 납부 관리">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            총 대상자: {tuitionList.length}명 / 미납자: {tuitionList.filter(t => t.paymentStatus === "UNPAID").length}명
          </div>
          <Button onClick={() => setIsModalOpen(true)}>개별 고지서 생성</Button>
        </div>

        <Table headers={["학번", "이름", "학과", "학기", "실납부금액", "상태", "관리"]}>
          {tuitionList.map((item) => (
            <tr key={item.tuitionId}>
              <td className="px-6 py-4 text-sm">{item.studentNo}</td>
              <td className="px-6 py-4 text-sm font-medium">{item.studentName}</td>
              <td className="px-6 py-4 text-sm">{item.department}</td>
              <td className="px-6 py-4 text-sm">
                {item.academicYear}-{item.semester}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-slate-700">
                {(item.amount - item.scholarship).toLocaleString()}원
              </td>
              <td className="px-6 py-4 text-sm">{getStatusBadge(item.paymentStatus)}</td>
              <td className="px-6 py-4 text-sm">
                {item.paymentStatus === "UNPAID" ? (
                  <Button variant="secondary" onClick={() => handleConfirmPayment(item.tuitionId)}>
                    납부 확인
                  </Button>
                ) : (
                  <span className="text-xs text-slate-400">{item.paymentDate}</span>
                )}
              </td>
            </tr>
          ))}
        </Table>

        {/* 고지서 생성 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[500px]">
              <h3 className="text-xl font-bold mb-4">등록금 고지서 생성</h3>

              <Input
                label="학번"
                value={formData.studentNo}
                onChange={(e) => setFormData({...formData, studentNo: e.target.value})}
                placeholder="학번을 입력하세요"
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="년도"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                />
                <Input
                  label="학기"
                  type="number"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                />
              </div>

              <Input
                label="등록금액 (원)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
              />

              <Input
                label="장학금액 (원)"
                type="number"
                value={formData.scholarship}
                onChange={(e) => setFormData({...formData, scholarship: Number(e.target.value)})}
              />

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">실 납부금액:</span>
                  <span className="font-bold text-brand-blue">
                    {(formData.amount - formData.scholarship).toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
                <Button onClick={handleCreateBill}>생성</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
