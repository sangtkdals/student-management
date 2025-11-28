import  React, { useState, useEffect } from "react";
import { Card, Table, Button, Input } from "./ui";
import { MOCK_USERS, MOCK_COURSES } from "../constants";
import type { User, Course, AcademicSchedule, LeaveApplication, Post } from "../types";
import axios from "axios";

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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
    name: "",
    memberType: "STUDENT",
    memberNo: "",
    email: "",
    phone: "",
    residentNumber: "",
    address: "",
    deptCode: "",
    stuGrade: 1,
    enrollmentStatus: "ENROLLED",
    position: "",
    officeRoom: "",
    majorField: ""
  });
  const roleMap: { [key: string]: string } = {
    STUDENT: "학생", student: "학생",
    PROFESSOR: "교수", professor: "교수",
    ADMIN: "관리자", admin: "관리자",
  };

  useEffect(() => {
    fetchUsers();
  }, [filterType]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filterType
        ? `/api/members?memberType=${filterType}`
        : '/api/members';

      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/members', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('사용자가 추가되었습니다.');
      setIsModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      alert('사용자 추가 실패: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        deptCode: formData.deptCode,
        stuGrade: formData.stuGrade,
        enrollmentStatus: formData.enrollmentStatus,
        position: formData.position,
        officeRoom: formData.officeRoom,
        majorField: formData.majorField
      };

      await axios.put(`/api/members/${editingUser.memberNo}`, updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('사용자 정보가 수정되었습니다.');
      setIsModalOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      alert('사용자 수정 실패: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (memberNo: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/members/${memberNo}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('사용자가 삭제되었습니다.');
      fetchUsers();
    } catch (error: any) {
      alert('사용자 삭제 실패: ' + (error.response?.data?.message || error.message));
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      memberId: user.memberId,
      password: "",
      name: user.name,
      memberType: user.memberType,
      memberNo: user.memberNo,
      email: user.email,
      phone: user.phone || "",
      residentNumber: "",
      address: user.address || "",
      deptCode: user.deptCode || "",
      stuGrade: user.stuGrade || 1,
      enrollmentStatus: user.enrollmentStatus || "ENROLLED",
      position: user.position || "",
      officeRoom: user.officeRoom || "",
      majorField: user.majorField || ""
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      memberId: "",
      password: "",
      name: "",
      memberType: "STUDENT",
      memberNo: "",
      email: "",
      phone: "",
      residentNumber: "",
      address: "",
      deptCode: "",
      stuGrade: 1,
      enrollmentStatus: "ENROLLED",
      position: "",
      officeRoom: "",
      majorField: ""
    });
  };

  return (
    <Card title="사용자 관리">
       <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">전체</option>
            <option value="STUDENT">학생</option>
            <option value="PROFESSOR">교수</option>
            <option value="ADMIN">관리자</option>
          </select>
        </div>
        <Button onClick={openCreateModal}>사용자 추가</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">로딩 중...</div>
      ) : (
        <Table headers={["학번/교번", "이름", "역할", "소속", "이메일", "관리"]}>
          {users.map((user) => (
            <tr key={user.memberNo}>
              <td className="px-6 py-4 text-sm">{user.memberNo}</td>
              <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
              <td className="px-6 py-4 text-sm">{roleMap[user.memberType] || user.memberType}</td>
              <td className="px-6 py-4 text-sm">{user.deptName || user.deptCode || "-"}</td>
              <td className="px-6 py-4 text-sm">{user.email}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => openEditModal(user)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteUser(user.memberNo)}
                  className="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "사용자 수정" : "사용자 추가"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="아이디"
                value={formData.memberId}
                onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                disabled={!!editingUser}
              />
              {!editingUser && (
                <Input
                  label="비밀번호"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              )}
              <Input
                label="이름"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">역할</label>
                <select
                  value={formData.memberType}
                  onChange={(e) => setFormData({...formData, memberType: e.target.value})}
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="STUDENT">학생</option>
                  <option value="PROFESSOR">교수</option>
                  <option value="ADMIN">관리자</option>
                </select>
              </div>
              <Input
                label="학번/교번"
                value={formData.memberNo}
                onChange={(e) => setFormData({...formData, memberNo: e.target.value})}
                disabled={!!editingUser}
              />
              <Input
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Input
                label="전화번호"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <Input
                label="학과코드"
                value={formData.deptCode}
                onChange={(e) => setFormData({...formData, deptCode: e.target.value})}
              />
              {formData.memberType === "STUDENT" && (
                <>
                  <Input
                    label="학년"
                    type="number"
                    value={formData.stuGrade}
                    onChange={(e) => setFormData({...formData, stuGrade: parseInt(e.target.value)})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">학적상태</label>
                    <select
                      value={formData.enrollmentStatus}
                      onChange={(e) => setFormData({...formData, enrollmentStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="ENROLLED">재학</option>
                      <option value="LEAVE">휴학</option>
                      <option value="GRADUATED">졸업</option>
                    </select>
                  </div>
                </>
              )}
              {formData.memberType === "PROFESSOR" && (
                <>
                  <Input
                    label="직급"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                  <Input
                    label="연구실"
                    value={formData.officeRoom}
                    onChange={(e) => setFormData({...formData, officeRoom: e.target.value})}
                  />
                  <Input
                    label="전공분야"
                    value={formData.majorField}
                    onChange={(e) => setFormData({...formData, majorField: e.target.value})}
                  />
                </>
              )}
            </div>

            <div className="mt-4">
              <Input
                label="주소"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                취소
              </button>
              <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                {editingUser ? "수정" : "추가"}
              </Button>
            </div>
          </div>
        </div>
      )}
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

export const AdminScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<AcademicSchedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: new Date().getFullYear(),
    semester: 1,
    title: "",
    content: "",
    startDate: "",
    endDate: "",
    backgroundColor: "#3B82F6",
    recurrenceType: "NONE"
  });

  // 데이터 불러오기
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("/api/schedules");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  // 추가 버튼 클릭
  const handleAdd = () => {
    setFormData({
      academicYear: new Date().getFullYear(),
      semester: 1,
      title: "",
      content: "",
      startDate: "",
      endDate: "",
      backgroundColor: "#3B82F6",
      recurrenceType: "NONE"
    });
    setIsModalOpen(true);
  };

  // 저장
  const handleSave = async () => {
    try {
      await axios.post("/api/schedules", formData);
      fetchSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("저장 실패");
    }
  };

  // 삭제
  const handleDelete = async (id: number) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/schedules/${id}`);
        fetchSchedules();
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  return (
    <Card title="학사일정 관리">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAdd}>일정 추가</Button>
      </div>
      
      <Table headers={["학년도", "학기", "제목", "시작일", "종료일", "관리"]}>
        {schedules.map((schedule) => (
          <tr key={schedule.scheduleId}>
            <td className="px-6 py-4 text-sm">{schedule.academicYear}</td>
            <td className="px-6 py-4 text-sm">{schedule.semester}</td>
            <td className="px-6 py-4 text-sm font-medium">{schedule.title}</td>
            <td className="px-6 py-4 text-sm">{schedule.startDate}</td>
            <td className="px-6 py-4 text-sm">{schedule.endDate}</td>
            <td className="px-6 py-4 text-sm">
              <Button variant="secondary" onClick={() => handleDelete(schedule.scheduleId)}>
                삭제
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">일정 추가</h3>
            
            <Input 
              label="제목" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            
            <Input 
              label="내용" 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
            
            <Input 
              label="시작일" 
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
            
            <Input 
              label="종료일" 
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button onClick={handleSave}>저장</Button>
            </div>
          </div>
        </div>
      )}
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
       headers: {
        'Authorization': `Bearer ${token}`
      }
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchApplications();
        fetchStudentsOnLeave(); // 휴학중인 학생 목록도 새로고침
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
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
          headers: {
            'Authorizaion': `Bearer ${token}`
          }
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
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status] || ""}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <Card title="휴학/복학 관리">
      {/* 탭 버튼 */}
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

      {/* 휴학 신청 관리 탭 */}
      {activeTab === "applications" && (
        <Table headers={["학번", "학생명", "유형", "기간", "신청일", "상태", "관리"]}>
          {applications
            .filter(app => app.approvalStatus === "PENDING") // 대기중인 신청만 표시
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

      {/* 현재 휴학 학생 탭 */}
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
                <Button 
                  onClick={() => handleReturnToSchool(student.studentNo, student.studentName)}
                >
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
    setEditingId(post.postId);  // 수정할 공지사항의 ID 저장
    setFormData({
      title: post.title,        // 기존 제목을 폼에 채움
      content: post.content     // 기존 내용을 폼에 채움
    });
    setIsModalOpen(true);       // 모달 열기
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
      // 수정 모드 (editingId가 있으면)
      await axios.put(`/api/announcements/${editingId}`, {
        title: formData.title,
        content: formData.content
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("공지사항이 수정되었습니다.");
    } else {
      // 신규 등록 모드 (editingId가 null이면)
      await axios.post("/api/announcements", {
        title: formData.title,
        content: formData.content
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("공지사항이 등록되었습니다.");
    }
    fetchPosts();           // 목록 새로고침
    setIsModalOpen(false);  // 모달 닫기
    setEditingId(null);     // editingId 초기화
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

// AdminViews.tsx 파일 하단에 추가

export const AdminTuitionManagement: React.FC = () => {
  // 등록금 데이터 타입 정의 (실제로는 types.ts에 정의 권장)
  interface TuitionData {
    tuitionId: number;
    studentNo: string;
    studentName: string;
    department: string;
    academicYear: number;
    semester: number;
    amount: number;       // 등록금액
    scholarship: number;  // 장학금액
    paymentStatus: "PAID" | "UNPAID";
    paymentDate?: string;
  }

  const [tuitionList, setTuitionList] = useState<TuitionData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 고지서 생성 폼 데이터
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
      // 실제 API 엔드포인트에 맞춰 수정 필요
      const response = await axios.get("/api/tuition/admin/list", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTuitionList(response.data);
    } catch (error) {
      console.error("Error fetching tuition list:", error);
      // MOCK 데이터 (API 연동 전 테스트용)
      setTuitionList([
        { tuitionId: 1, studentNo: "2024001", studentName: "김철수", department: "컴퓨터공학과", academicYear: 2024, semester: 1, amount: 4000000, scholarship: 1000000, paymentStatus: "UNPAID" },
        { tuitionId: 2, studentNo: "2024002", studentName: "이영희", department: "경영학과", academicYear: 2024, semester: 1, amount: 3500000, scholarship: 0, paymentStatus: "PAID", paymentDate: "2024-02-20" },
      ]);
    }
  };

  // 납부 확인 처리
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
        alert("처리 실패 (API 미연동 상태일 수 있습니다)");
        // UI 테스트를 위해 강제 업데이트 로직 추가 가능
      }
    }
  };

  // 고지서 생성 (저장)
  const handleCreateBill = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post("/api/tuition", formData, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("등록금 고지서가 생성되었습니다.");
      setIsModalOpen(false);
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
            <td className="px-6 py-4 text-sm">{item.academicYear}-{item.semester}</td>
            <td className="px-6 py-4 text-sm font-bold text-slate-700">
              {(item.amount - item.scholarship).toLocaleString()}원
            </td>
            <td className="px-6 py-4 text-sm">{getStatusBadge(item.paymentStatus)}</td>
            <td className="px-6 py-4 text-sm">
              {item.paymentStatus === "UNPAID" && (
                <Button variant="secondary" onClick={() => handleConfirmPayment(item.tuitionId)}>
                  납부 확인
                </Button>
              )}
              {item.paymentStatus === "PAID" && (
                <span className="text-xs text-slate-400">{item.paymentDate}</span>
              )}
            </td>
          </tr>
        ))}
      </Table>

      {/* 고지서 생성 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">등록금 고지서 생성</h3>
            <Input 
              label="학번" 
              value={formData.studentNo}
              onChange={(e) => setFormData({...formData, studentNo: e.target.value})}
            />
            <div className="flex space-x-2">
                <div className="flex-1">
                    <Input 
                        label="년도" 
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                    />
                </div>
                <div className="flex-1">
                    <Input 
                        label="학기" 
                        type="number"
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                    />
                </div>
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
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button onClick={handleCreateBill}>생성</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};