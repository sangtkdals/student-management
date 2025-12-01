import React from "react";
import { Card, Table } from "../ui";
import { MOCK_USERS } from "../../constants";
import type { User } from "../../types";

export const AdminUserManagement: React.FC = () => {
  const roleMap: { [key: string]: string } = {
    STUDENT: "학생", student: "학생",
    PROFESSOR: "교수", professor: "교수",
    ADMIN: "관리자", admin: "관리자",
  };

  const users = Object.values(MOCK_USERS) as unknown as User[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="사용자 관리">
        <Table headers={["학번/교번", "이름", "역할", "소속", "이메일"]}>
          {users.map((user) => (
            <tr key={user.memberNo || user.id}>
              <td className="px-6 py-4 text-sm">{user.memberNo || user.id}</td>
              <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
              <td className="px-6 py-4 text-sm capitalize">{roleMap[user.role] || user.role}</td>
              <td className="px-6 py-4 text-sm">{user.departmentName || user.department || user.deptCode}</td>
              <td className="px-6 py-4 text-sm">{user.email}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
