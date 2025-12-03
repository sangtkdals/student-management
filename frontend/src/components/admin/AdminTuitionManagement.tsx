import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, Input } from "../ui";

interface TuitionData {
  tuitionId: number;
  studentNo: string;
  studentName: string;
  academicYear: number;
  semester: number;
  tuitionAmount: number;
  scholarshipAmount: number;
  paidAmount: number;
  paymentStatus: "PAID" | "UNPAID";
  paidDate?: string;
  billDate?: string;
  dueDate?: string;
  paymentMethod?: string;
  receiptNo?: string;
}

interface StudentTuitionStatus {
  studentNo: string;
  studentName: string;
  deptCode: string;
  deptName: string;
  stuGrade: number;
  enrollmentStatus: string;
  hasExistingTuition: boolean;
  existingTuitionId?: number;
  paymentStatus?: string;
}

interface Department {
  deptCode: string;
  deptName: string;
}

interface BatchCreateFormData {
  deptCode: string;
  academicYear: number;
  semester: number;
  tuitionAmount: number;
  scholarshipAmount: number;
}

export const AdminTuitionManagement: React.FC = () => {
  const [tuitionList, setTuitionList] = useState<TuitionData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentNo: "",
    year: new Date().getFullYear(),
    semester: 1,
    amount: 0,
    scholarship: 0,
  });

  // 일괄 생성 관련 상태
  const [batchFormData, setBatchFormData] = useState<BatchCreateFormData>({
    deptCode: "",
    academicYear: new Date().getFullYear(),
    semester: 1,
    tuitionAmount: 5000000,
    scholarshipAmount: 0,
  });
  const [studentList, setStudentList] = useState<StudentTuitionStatus[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    fetchTuitionList();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchTuitionList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/tuitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTuitionList(response.data);
    } catch (error) {
      console.error("Error fetching tuition list:", error);
      // MOCK 데이터 사용 안 함 - 에러 로깅만
      console.error("Failed to fetch tuition list");
    }
  };

  const handleConfirmPayment = async (id: number) => {
    if (confirm("해당 학생의 등록금을 '납부 완료' 처리하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `/api/admin/tuitions/${id}/confirm`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      const token = localStorage.getItem("token");
      const payload = {
        studentNo: formData.studentNo,
        academicYear: formData.year,
        semester: formData.semester,
        tuitionAmount: formData.amount,
        scholarshipAmount: formData.scholarship,
        paymentStatus: "UNPAID",
        billDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0],
      };
      await axios.post("/api/admin/tuitions", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("등록금 고지서가 생성되었습니다.");
      setIsModalOpen(false);
      setFormData({
        studentNo: "",
        year: new Date().getFullYear(),
        semester: 1,
        amount: 0,
        scholarship: 0,
      });
      fetchTuitionList();
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("생성 실패");
    }
  };

  // 학과별 학생 목록 조회
  const handleLoadStudents = async () => {
    if (!batchFormData.deptCode) {
      alert("학과를 선택하세요.");
      return;
    }

    setIsLoadingStudents(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/admin/tuitions/department/${batchFormData.deptCode}/students`, {
        params: {
          academicYear: batchFormData.academicYear,
          semester: batchFormData.semester,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentList(response.data);
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error loading students:", error);
      alert("학생 목록 조회 실패");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedStudents.length === studentList.filter((s) => !s.hasExistingTuition).length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentList.filter((s) => !s.hasExistingTuition).map((s) => s.studentNo));
    }
  };

  // 개별 선택/해제
  const handleSelectStudent = (studentNo: string) => {
    setSelectedStudents((prev) => (prev.includes(studentNo) ? prev.filter((no) => no !== studentNo) : [...prev, studentNo]));
  };

  // 일괄 생성 실행
  const handleBatchCreate = async () => {
    if (selectedStudents.length === 0 && studentList.filter((s) => !s.hasExistingTuition).length > 0) {
      if (!confirm("학생을 선택하지 않았습니다. 등록금이 없는 모든 학생에게 일괄 생성하시겠습니까?")) {
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...batchFormData,
        studentNumbers: selectedStudents.length > 0 ? selectedStudents : undefined,
      };

      const response = await axios.post("/api/admin/tuitions/batch-create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data);
      setIsBatchModalOpen(false);
      setBatchFormData({
        deptCode: "",
        academicYear: new Date().getFullYear(),
        semester: 1,
        tuitionAmount: 5000000,
        scholarshipAmount: 0,
      });
      setStudentList([]);
      setSelectedStudents([]);
      fetchTuitionList();
    } catch (error: any) {
      console.error("Error batch creating:", error);
      alert(error.response?.data || "일괄 생성 실패");
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "PAID" ? (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">납부완료</span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">미납</span>
    );
  };

  const getEnrollmentStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      ENROLLED: "재학",
      LEAVE_OF_ABSENCE: "휴학",
      GRADUATED: "졸업",
      EXPELLED: "제적",
      WITHDRAWN: "자퇴",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="등록금 납부 관리">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            총 대상자: {tuitionList.length}명 / 미납자: {tuitionList.filter((t) => t.paymentStatus === "UNPAID").length}명
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsBatchModalOpen(true)}>
              과별 일괄 생성
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>개별 고지서 생성</Button>
          </div>
        </div>

        <Table headers={["학번", "이름", "학기", "등록금", "장학금", "실납부금액", "상태", "관리"]}>
          {tuitionList.map((item) => (
            <tr key={item.tuitionId}>
              <td className="px-6 py-4 text-sm">{item.studentNo}</td>
              <td className="px-6 py-4 text-sm font-medium">{item.studentName}</td>
              <td className="px-6 py-4 text-sm">
                {item.academicYear}-{item.semester}
              </td>
              <td className="px-6 py-4 text-sm">{item.tuitionAmount?.toLocaleString()}원</td>
              <td className="px-6 py-4 text-sm text-green-600">{item.scholarshipAmount?.toLocaleString()}원</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-700">
                {((item.tuitionAmount || 0) - (item.scholarshipAmount || 0)).toLocaleString()}원
              </td>
              <td className="px-6 py-4 text-sm">{getStatusBadge(item.paymentStatus)}</td>
              <td className="px-6 py-4 text-sm">
                {item.paymentStatus === "UNPAID" ? (
                  <Button variant="secondary" onClick={() => handleConfirmPayment(item.tuitionId)}>
                    납부 확인
                  </Button>
                ) : (
                  <span className="text-xs text-slate-400">{item.paidDate}</span>
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
                onChange={(e) => setFormData({ ...formData, studentNo: e.target.value })}
                placeholder="학번을 입력하세요"
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="년도"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                />
                <Input
                  label="학기"
                  type="number"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                />
              </div>

              <Input
                label="등록금액 (원)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />

              <Input
                label="장학금액 (원)"
                type="number"
                value={formData.scholarship}
                onChange={(e) => setFormData({ ...formData, scholarship: Number(e.target.value) })}
              />

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">실 납부금액:</span>
                  <span className="font-bold text-brand-blue">{(formData.amount - formData.scholarship).toLocaleString()}원</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleCreateBill}>생성</Button>
              </div>
            </div>
          </div>
        )}

        {/* 과별 일괄 생성 모달 */}
        {isBatchModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[900px] max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">과별 등록금 일괄 생성</h3>

              {/* 조회 조건 입력 */}
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="department-select" className="block text-sm font-medium text-slate-700 mb-1">
                      학과 선택
                    </label>
                    <select
                      id="department-select"
                      value={batchFormData.deptCode}
                      onChange={(e) => setBatchFormData({ ...batchFormData, deptCode: e.target.value })}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">학과를 선택하세요</option>
                      {departments.map((dept) => (
                        <option key={dept.deptCode} value={dept.deptCode}>
                          {dept.deptName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="학년도"
                    type="number"
                    value={batchFormData.academicYear}
                    onChange={(e) => setBatchFormData({ ...batchFormData, academicYear: Number(e.target.value) })}
                  />
                  <Input
                    label="학기"
                    type="number"
                    value={batchFormData.semester}
                    onChange={(e) => setBatchFormData({ ...batchFormData, semester: Number(e.target.value) })}
                  />
                  <div className="flex items-end">
                    <Button onClick={handleLoadStudents} disabled={isLoadingStudents}>
                      {isLoadingStudents ? "조회 중..." : "학생 조회"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 등록금 정보 입력 */}
              {studentList.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      label="등록금액 (원)"
                      type="number"
                      value={batchFormData.tuitionAmount}
                      onChange={(e) => setBatchFormData({ ...batchFormData, tuitionAmount: Number(e.target.value) })}
                    />
                    <Input
                      label="장학금액 (원)"
                      type="number"
                      value={batchFormData.scholarshipAmount}
                      onChange={(e) => setBatchFormData({ ...batchFormData, scholarshipAmount: Number(e.target.value) })}
                    />
                  </div>

                  <div className="mb-2 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-slate-700">총 {studentList.length}명 / </span>
                      <span className="text-green-600 font-semibold">등록금 없음: {studentList.filter((s) => !s.hasExistingTuition).length}명</span>
                      <span className="text-slate-500"> / 이미 생성됨: {studentList.filter((s) => s.hasExistingTuition).length}명</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-600 font-semibold">선택: {selectedStudents.length}명</span>
                    </div>
                  </div>

                  {/* 학생 목록 테이블 */}
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                            <input
                              type="checkbox"
                              checked={
                                selectedStudents.length === studentList.filter((s) => !s.hasExistingTuition).length &&
                                studentList.filter((s) => !s.hasExistingTuition).length > 0
                              }
                              onChange={handleSelectAll}
                              className="rounded"
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">학번</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">이름</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">학년</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">재적상태</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">등록금 상태</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {studentList.map((student) => (
                          <tr key={student.studentNo} className={student.hasExistingTuition ? "bg-slate-50" : ""}>
                            <td className="px-4 py-3">
                              {!student.hasExistingTuition && (
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(student.studentNo)}
                                  onChange={() => handleSelectStudent(student.studentNo)}
                                  className="rounded"
                                />
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">{student.studentNo}</td>
                            <td className="px-4 py-3 text-sm font-medium">{student.studentName}</td>
                            <td className="px-4 py-3 text-sm">{student.stuGrade}학년</td>
                            <td className="px-4 py-3 text-sm">{getEnrollmentStatusLabel(student.enrollmentStatus)}</td>
                            <td className="px-4 py-3 text-sm">
                              {student.hasExistingTuition ? (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                  이미 생성됨 ({student.paymentStatus})
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">생성 가능</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">실 납부금액 (1인당):</span>
                      <span className="font-bold text-brand-blue">
                        {(batchFormData.tuitionAmount - batchFormData.scholarshipAmount).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsBatchModalOpen(false);
                    setStudentList([]);
                    setSelectedStudents([]);
                  }}
                >
                  취소
                </Button>
                {studentList.length > 0 && (
                  <Button onClick={handleBatchCreate}>
                    {selectedStudents.length > 0
                      ? `선택한 ${selectedStudents.length}명 생성`
                      : `등록금 없는 전체 ${studentList.filter((s) => !s.hasExistingTuition).length}명 생성`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
