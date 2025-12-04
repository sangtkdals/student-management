import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button } from "../ui";

interface User {
  memberNo: string;
  memberName: string;
  memberType: string;
  email: string;
  phone: string;
  deptCode?: string;
  deptName?: string;
  stuGrade?: number;
  enrollmentStatus?: string;
  officeLocation?: string;
  position?: string;
}

interface Department {
  deptCode: string;
  deptName: string;
}

export const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [memberType, setMemberType] = useState<string>("ALL");
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>("ALL");
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/departments", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params: any = {};

      if (memberType !== "ALL") params.memberType = memberType;
      if (selectedDeptCode !== "ALL") params.deptCode = selectedDeptCode;
      if (selectedGrade !== "ALL") params.stuGrade = parseInt(selectedGrade);
      if (searchName.trim()) params.searchName = searchName.trim();

      const response = await axios.get("/api/admin/users", {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchUsers();
  };

  const handleResetFilters = () => {
    setMemberType("ALL");
    setSelectedDeptCode("ALL");
    setSelectedGrade("ALL");
    setSearchName("");
  };

  const getMemberTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      STUDENT: "학생",
      PROFESSOR: "교수",
      ADMIN: "관리자"
    };
    return labels[type] || type;
  };

  const getMemberTypeBadge = (type: string) => {
    const badges: { [key: string]: string } = {
      STUDENT: "bg-blue-100 text-blue-800",
      PROFESSOR: "bg-green-100 text-green-800",
      ADMIN: "bg-purple-100 text-purple-800"
    };
    return badges[type] || "bg-slate-100 text-slate-800";
  };

  const getEnrollmentStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      ENROLLED: "재학",
      LEAVE_OF_ABSENCE: "휴학",
      GRADUATED: "졸업",
      EXPELLED: "제적"
    };
    return labels[status] || status;
  };

  const getEnrollmentStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      ENROLLED: "bg-green-100 text-green-800",
      LEAVE_OF_ABSENCE: "bg-yellow-100 text-yellow-800",
      GRADUATED: "bg-slate-100 text-slate-600",
      EXPELLED: "bg-red-100 text-red-800"
    };
    return badges[status] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="사용자 관리">
        {/* Filters Section */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-4">검색 필터</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Member Type Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">사용자 유형</label>
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="ALL">전체</option>
                <option value="STUDENT">학생</option>
                <option value="PROFESSOR">교수</option>
                <option value="ADMIN">관리자</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">학과</label>
              <select
                value={selectedDeptCode}
                onChange={(e) => setSelectedDeptCode(e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                disabled={memberType === "ADMIN"}
              >
                <option value="ALL">전체</option>
                {departments.map((dept) => (
                  <option key={dept.deptCode} value={dept.deptCode}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Filter (only for students) */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">학년</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                disabled={memberType !== "STUDENT"}
              >
                <option value="ALL">전체</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
                <option value="4">4학년</option>
              </select>
            </div>

            {/* Name Search */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">이름 검색</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="이름 입력"
                className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleResetFilters} className="text-sm">
              초기화
            </Button>
            <Button onClick={handleApplyFilters} className="text-sm">
              검색
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-slate-600">
            총 <span className="font-bold text-brand-blue">{users.length}</span>명
          </p>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-slate-500">로딩 중...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-slate-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table headers={["유형", "번호", "이름", "학과/부서", "추가정보", "이메일", "연락처"]}>
              {users.map((user) => (
                <tr key={user.memberNo}>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMemberTypeBadge(user.memberType)}`}>
                      {getMemberTypeLabel(user.memberType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{user.memberNo}</td>
                  <td className="px-6 py-4 text-sm font-medium">{user.memberName}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.deptName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.memberType === "STUDENT" && (
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500">
                          {user.stuGrade}학년
                        </div>
                        {user.enrollmentStatus && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEnrollmentStatusBadge(user.enrollmentStatus)}`}>
                            {getEnrollmentStatusLabel(user.enrollmentStatus)}
                          </span>
                        )}
                      </div>
                    )}
                    {user.memberType === "PROFESSOR" && (
                      <div className="space-y-1">
                        {user.position && (
                          <div className="text-xs text-slate-600">{user.position}</div>
                        )}
                        {user.officeLocation && (
                          <div className="text-xs text-slate-500">{user.officeLocation}</div>
                        )}
                      </div>
                    )}
                    {user.memberType === "ADMIN" && (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.phone || '-'}</td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};
