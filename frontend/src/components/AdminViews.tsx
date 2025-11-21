import React from "react";
import { Card, Table, Button } from "./ui";
import { MOCK_USERS, MOCK_COURSES } from "../constants";

export const AdminDashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    student: "학생",
    professor: "교수",
    admin: "관리자",
  };
  return (
    <Card title="사용자 관리">
      <Table headers={["사용자 ID", "이름", "역할", "소속", "이메일"]}>
        {Object.values(MOCK_USERS).map((user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 text-sm">{user.id}</td>
            <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
            <td className="px-6 py-4 text-sm capitalize">{roleMap[user.role] || user.role}</td>
            <td className="px-6 py-4 text-sm">{user.department}</td>
            <td className="px-6 py-4 text-sm">{user.email}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const AdminSystemManagement: React.FC = () => (
  <Card title="강의 관리">
    <div className="mb-4 flex justify-end">
      <Button>새 강의 개설</Button>
    </div>
    <Table headers={["과목코드", "과목명", "담당교수", "학점", "개설학과"]}>
      {MOCK_COURSES.map((course) => (
        <tr key={course.id}>
          <td className="px-6 py-4 text-sm">{course.id}</td>
          <td className="px-6 py-4 text-sm font-medium">{course.name}</td>
          <td className="px-6 py-4 text-sm">{course.professor}</td>
          <td className="px-6 py-4 text-sm">{course.credits}</td>
          <td className="px-6 py-4 text-sm">{course.department}</td>
        </tr>
      ))}
    </Table>
  </Card>
);
