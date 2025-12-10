import React, { useState, useEffect } from "react";
import api from "../../api";
import { Card, Table, Button } from "../ui";
import type { LeaveApplication } from "../../types";

export const AdminLeaveManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "returnPending" | "all" | "onLeave">("pending");
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [studentsOnLeave, setStudentsOnLeave] = useState<any[]>([]);
  const [returnPendingApplications, setReturnPendingApplications] = useState<LeaveApplication[]>([]);

  useEffect(() => {
    fetchApplications();
    fetchStudentsOnLeave();
    fetchReturnPendingApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/api/admin/leave-applications");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    }
  };

  const fetchStudentsOnLeave = async () => {
    try {
      const response = await api.get("/api/admin/leave-applications/approved");
      setStudentsOnLeave(response.data);
    } catch (error) {
      console.error("Error fetching students on leave:", error);
    }
  };

  const fetchReturnPendingApplications = async () => {
    try {
      const response = await api.get("/api/admin/leave-applications/return-pending");
      setReturnPendingApplications(response.data);
    } catch (error) {
      console.error("Error fetching return pending applications:", error);
    }
  };

  const handleApprove = async (id: number) => {
    if (confirm("승인하시겠습니까?")) {
      try {
        await api.post(`/api/admin/leave-applications/${id}/approve`, {});
        fetchApplications();
        fetchStudentsOnLeave();
        alert("승인되었습니다.");
      } catch (error) {
        console.error("Error approving:", error);
        alert(`승인 실패: ${error.response?.data || error.message}`);
      }
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("거부 사유를 입력하세요:");
    if (reason) {
      try {
        await api.post(`/api/admin/leave-applications/${id}/reject`, { rejectReason: reason });
        fetchApplications();
        alert("거부되었습니다.");
      } catch (error) {
        console.error("Error rejecting:", error);
        alert("거부 실패");
      }
    }
  };

  const handleReturnToSchool = async (studentNo: string, studentName: string) => {
    if (confirm(`${studentName} 학생을 복학 처리하시겠습니까?`)) {
      try {
        await api.put(`/api/admin/leave-applications/return/${studentNo}`, {});
        fetchStudentsOnLeave();
        alert("복학 처리되었습니다.");
      } catch (error) {
        console.error("Error processing return:", error);
        alert("복학 처리 실패");
      }
    }
  };

  const handleApproveReturn = async (id: number, studentName: string) => {
    if (confirm(`${studentName} 학생의 복학 신청을 승인하시겠습니까?`)) {
      try {
        await api.post(`/api/admin/leave-applications/${id}/approve-return`, {});
        fetchReturnPendingApplications();
        fetchStudentsOnLeave();
        fetchApplications();
        alert("복학 신청이 승인되었습니다.");
      } catch (error) {
        console.error("Error approving return:", error);
        alert("복학 승인 실패");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      RETURNED: "bg-blue-100 text-blue-800",
      RETURN_PENDING: "bg-purple-100 text-purple-800"
    };
    const labels = {
      PENDING: "심사 중",
      APPROVED: "승인됨",
      REJECTED: "거부됨",
      RETURNED: "복학 완료",
      RETURN_PENDING: "복학 신청 대기"
    };
    // @ts-ignore
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status] || ""}`}>{labels[status] || status}</span>;
  };

  const getLeaveTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "일반휴학": "일반휴학",
      "군입대": "군입대",
      "질병휴학": "질병휴학",
      "창업휴학": "창업휴학",
    };
    return types[type] || type;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="휴학/복학 관리">
        <div className="mb-6 border-b border-slate-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              휴학 심사 대기 ({applications.filter(a => a.approvalStatus === "PENDING").length})
            </button>
            <button
              onClick={() => setActiveTab("returnPending")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "returnPending"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              복학 신청 대기 ({returnPendingApplications.length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              전체 신청 내역 ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab("onLeave")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "onLeave"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              현재 휴학 학생 ({studentsOnLeave.length})
            </button>
          </div>
        </div>

        {activeTab === "pending" && (
          <Table headers={["학번", "학생명", "유형", "기간", "사유", "신청일", "관리"]}>
            {applications
              .filter(app => app.approvalStatus === "PENDING")
              .map((app) => (
                <tr key={app.applicationId}>
                  <td className="px-6 py-4 text-sm">{app.studentNo}</td>
                  <td className="px-6 py-4 text-sm font-medium">{app.studentName}</td>
                  <td className="px-6 py-4 text-sm">{getLeaveTypeLabel(app.leaveType)}</td>
                  <td className="px-6 py-4 text-sm">
                    {app.startYear}-{app.startSemester}학기<br />~ {app.endYear}-{app.endSemester}학기
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate" title={app.applicationReason}>
                    {app.applicationReason}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Button onClick={() => handleApprove(app.applicationId)}>승인</Button>
                      <Button variant="secondary" onClick={() => handleReject(app.applicationId)}>
                        거부
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </Table>
        )}

        {activeTab === "returnPending" && (
          <Table headers={["학번", "학생명", "신청 사유", "신청일", "관리"]}>
            {returnPendingApplications.map((app) => (
              <tr key={app.applicationId}>
                <td className="px-6 py-4 text-sm">{app.studentNo}</td>
                <td className="px-6 py-4 text-sm font-medium">{app.studentName}</td>
                <td className="px-6 py-4 text-sm max-w-xs truncate" title={app.applicationReason}>
                  {app.applicationReason || '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(app.applicationDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button onClick={() => handleApproveReturn(app.applicationId, app.studentName)}>
                    복학 승인
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {activeTab === "all" && (
          <Table headers={["학번", "학생명", "유형", "기간", "신청일", "상태", "처리일/사유"]}>
            {applications.map((app) => (
              <tr key={app.applicationId}>
                <td className="px-6 py-4 text-sm">{app.studentNo}</td>
                <td className="px-6 py-4 text-sm font-medium">{app.studentName}</td>
                <td className="px-6 py-4 text-sm">{getLeaveTypeLabel(app.leaveType)}</td>
                <td className="px-6 py-4 text-sm">
                  {app.startYear}-{app.startSemester}학기<br />~ {app.endYear}-{app.endSemester}학기
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(app.applicationDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">{getStatusBadge(app.approvalStatus)}</td>
                <td className="px-6 py-4 text-sm">
                  {app.approvalStatus === "REJECTED" && app.rejectReason ? (
                    <button
                      onClick={() => alert(`거부 사유: ${app.rejectReason}`)}
                      className="text-red-600 hover:text-red-800 text-xs underline"
                    >
                      사유 확인
                    </button>
                  ) : app.approvalDate ? (
                    <span className="text-xs text-slate-500">
                      {new Date(app.approvalDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}

        {activeTab === "onLeave" && (
          <Table headers={["학번", "학생명", "학과", "학년", "상태", "관리"]}>
            {studentsOnLeave.map((student) => (
              <tr key={student.studentNo}>
                <td className="px-6 py-4 text-sm">{student.studentNo}</td>
                <td className="px-6 py-4 text-sm font-medium">{student.studentName}</td>
                <td className="px-6 py-4 text-sm">{student.department}</td>
                <td className="px-6 py-4 text-sm">{student.gradeLevel}학년</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    휴학중
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button onClick={() => handleReturnToSchool(student.studentNo, student.studentName)}>
                    복학 처리
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
