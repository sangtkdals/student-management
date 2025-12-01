import React from "react";
import { Card, Table, Button } from "../ui";
import { MOCK_COURSES } from "../../constants";

export const AdminSystemManagement: React.FC = () => {
  const courses = MOCK_COURSES as any[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="강의 관리">
        <div className="mb-4 flex justify-end">
          <Button>새 강의 개설</Button>
        </div>
        <Table headers={["과목코드", "과목명", "담당교수", "학점"]}>
          {courses.map((course) => (
            <tr key={course.courseCode || course.id}>
              <td className="px-6 py-4 text-sm">{course.courseCode || course.id}</td>
              <td className="px-6 py-4 text-sm font-medium">{course.subjectName || course.name}</td>
              <td className="px-6 py-4 text-sm">{course.professorName || course.professor}</td>
              <td className="px-6 py-4 text-sm">{course.credit || course.credits}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
