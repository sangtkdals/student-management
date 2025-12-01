import React, {useState, useEffect} from "react";
import axios from "axios";
import { Card, Table, Button, Input } from "./ui";
import { MOCK_USERS, MOCK_COURSES } from "../constants";
import type { User, Course, LeaveApplication, Post } from "../types";

export const AdminDashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* 대시보드 카드는 정적 데이터이므로 타입 영향 없음 */}
    <Card>
      <h3 className="text-lg font-semibold text-slate-500">총 학생 수</h3>
      <p className="text-3xl font-bold text-slate-800 mt-2">1,234</p>
    </Card>
    <Card>
      <h3 className="text-lg font-semibold text-slate-500">총 교수 수</h3>
      <p className="text-3xl font-bold text-slate-800 mt-2">156</p>
    </Card>
    <Card>
      <h3 className="text-lg font-semibold text-slate-500">개설 강의 수</h3>
      <p className="text-3xl font-bold text-slate-800 mt-2">289</p>
    </Card>
  </div>
);

export const AdminUserManagement: React.FC = () => {
  const roleMap: { [key: string]: string } = {
    STUDENT: "학생", student: "학생",
    PROFESSOR: "교수", professor: "교수",
    ADMIN: "관리자", admin: "관리자",
  };

  // MOCK_USERS를 User[]로 캐스팅하여 안전하게 순회
  const users = Object.values(MOCK_USERS) as unknown as User[];

  return (
    <Card title="사용자 관리">
      <Table headers={["학번/교번", "이름", "역할", "소속", "이메일"]}>
        {users.map((user) => (
          <tr key={user.memberNo || user.id}>
            {/* types.ts: memberNo 사용 */}
            <td className="px-6 py-4 text-sm">{user.memberNo || user.id}</td>
            <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
            <td className="px-6 py-4 text-sm capitalize">{roleMap[user.role] || user.role}</td>
            {/* types.ts: departmentName 또는 deptCode */}
            <td className="px-6 py-4 text-sm">{user.departmentName || user.department || user.deptCode}</td>
            <td className="px-6 py-4 text-sm">{user.email}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const AdminSystemManagement: React.FC = () => {
    // MOCK_COURSES를 Course[]로 처리
    // 주의: MOCK_COURSES 상수가 types.ts의 Course와 일부 필드명이 다를 수 있으므로(ex: id vs courseCode)
    // 실제 구현시 constants.ts도 수정되어야 하지만, 여기서는 매핑으로 처리합니다.
    const courses = MOCK_COURSES as any[]; 

    return (
        <Card title="강의 관리">
            <div className="mb-4 flex justify-end">
            <Button>새 강의 개설</Button>
            </div>
            <Table headers={["과목코드", "과목명", "담당교수", "학점"]}>
            {courses.map((course) => (
                // types.ts의 Course 필드명 우선: courseCode, subjectName, professorName
                // fallback으로 MOCK 데이터 필드(id, name 등) 사용
                <tr key={course.courseCode || course.id}>
                    <td className="px-6 py-4 text-sm">{course.courseCode || course.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{course.subjectName || course.name}</td>
                    <td className="px-6 py-4 text-sm">{course.professorName || course.professor}</td>
                    <td className="px-6 py-4 text-sm">{course.credit || course.credits}</td>
                </tr>
            ))}
            </Table>
        </Card>
    );
};

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
      const response = await axios.get("/api/leave-applications",{
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
      const response = await axios.get("/api/leave-applications/on-leave",{
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
        await axios.put(`/api/leave-applications/${id}/approve`,{},{
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
        await axios.put(`/api/leave-applications/${id}/reject`, { reason },{
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
        await axios.put(`/api/leave-applications/return/${studentNo}`,{},{
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
    // @ts-ignore - 키값 타입 추론 회피
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status] || ""}`}>{labels[status] || status}</span>;
  };

  return (
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
  );
};

export const AdminNoticeManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/announcements");
      const mappedPosts = response.data.map((post: any) => ({
        postId: post.postId,
        title: post.postTitle,
        content: post.postContent,
        createdAt: post.createdAt,
        writerName: post.writer.mName,
      }));
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.postId);
    setFormData({
      title: post.title,
      content: post.content
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      content: ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        await axios.put(`/api/announcements/${editingId}`, {
          title: formData.title,
          content: formData.content
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("공지사항이 수정되었습니다.");
      } else {
        await axios.post("/api/announcements", {
          title: formData.title,
          content: formData.content
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("공지사항이 등록되었습니다.");
      }
      fetchPosts();
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("저장 실패");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/announcements/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPosts();
        alert("삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("삭제 실패");
      }
    }
  };

  return (
    <Card title="공지사항 관리">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAdd}>공지사항 작성</Button>
      </div>
      
      <Table headers={["제목", "작성일", "작성자", "관리"]}>
        {posts.map((post) => (
          <tr key={post.postId}>
            <td className="px-6 py-4 text-sm font-medium">{post.title}</td>
            <td className="px-6 py-4 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-sm">{post.writerName}</td>
            <td className="px-6 py-4 text-sm">
               <div className="flex space-x-2">
                <Button onClick={() => handleEdit(post)}>수정</Button>
                <Button variant="secondary" onClick={() => handleDelete(post.postId)}>
                삭제
              </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px]">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "공지사항 수정" : "공지사항 작성"}
            </h3>
            
            <Input 
              label="제목" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                내용
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button onClick={handleSave}>등록</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};