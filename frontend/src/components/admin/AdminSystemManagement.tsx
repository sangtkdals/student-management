import React, { useState, useEffect } from "react";
import { Card, Table, Button } from "../ui";

interface Course {
  courseCode: string;
  subjectName: string;
  professorName: string;
  credit: number;
}

export const AdminSystemManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="강의 관리">
        <div className="mb-4 flex justify-end">
          <Button>새 강의 개설</Button>
        </div>
        <Table headers={["과목코드", "과목명", "담당교수", "학점"]}>
          {courses.map((course) => (
            <tr key={course.courseCode}>
              <td className="px-6 py-4 text-sm">{course.courseCode}</td>
              <td className="px-6 py-4 text-sm font-medium">{course.subjectName}</td>
              <td className="px-6 py-4 text-sm">{course.professorName}</td>
              <td className="px-6 py-4 text-sm">{course.credit}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
