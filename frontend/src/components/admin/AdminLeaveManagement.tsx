import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button } from "../ui";
import type { LeaveApplication } from "../../types";

export const AdminLeaveManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"applications" | "onLeave">("applications");
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [studentsOnLeave, setStudentsOnLeave] = useState<any[]>([]);

  useEffect(() => {
    fetchApplications();
    fetchStudentsOnLeave();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/admin/leave-applications", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    }
  };

  const fetchStudentsOnLeave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/admin/leave-applications/approved", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudentsOnLeave(response.data);
    } catch (error) {
      console.error("Error fetching students on leave:", error);
    }
  };

  const handleApprove = async (id: number) => {
    if (confirm("승인하시겠습니까?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`/api/admin/leave-applications/${id}/approve`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchApplications();
        fetchStudentsOnLeave();
        alert("승인되었습니다.");
      } catch (error) {
        console.error("Error approving:", error);
        alert("승인 실패");
      }
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("거부 사유를 입력하세요:");
    if (reason) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`/api/admin/leave-applications/${id}/reject`, { rejectReason: reason }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
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
        const token = localStorage.getItem('token');
        await axios.put(`/api/admin/leave-applications/return/${studentNo}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchStudentsOnLeave();
        alert("복학 처리되었습니다.");
      } catch (error) {
        console.error("Error processing return:", error);
        alert("복학 처리 실패");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800"
    };
    const labels = {
      PENDING: "대기중",
      APPROVED: "승인",
      REJECTED: "거부"
    };
    // @ts-ignore
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status] || ""}`}>{labels[status] || status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="휴학/복학 관리">
        <div className="mb-6 border-b border-slate-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("applications")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "applications"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              휴학 신청 관리 ({applications.filter(a => a.approvalStatus === "PENDING").length})
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

        {activeTab === "applications" && (
          <Table headers={["학번", "학생명", "유형", "기간", "신청일", "상태", "관리"]}>
            {applications
              .filter(app => app.approvalStatus === "PENDING")
              .map((app) => (
                <tr key={app.applicationId}>
                  <td className="px-6 py-4 text-sm">{app.studentNo}</td>
                  <td className="px-6 py-4 text-sm font-medium">{app.studentName}</td>
                  <td className="px-6 py-4 text-sm">{app.leaveType}</td>
                  <td className="px-6 py-4 text-sm">
                    {app.startYear}-{app.startSemester} ~ {app.endYear}-{app.endSemester}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{getStatusBadge(app.approvalStatus)}</td>
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
