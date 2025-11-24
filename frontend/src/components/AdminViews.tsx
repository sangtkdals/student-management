import React from "react";
import { Card, Table, Button } from "./ui";
import { MOCK_USERS, MOCK_COURSES } from "../constants";
import type { User, Course } from "../types";

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