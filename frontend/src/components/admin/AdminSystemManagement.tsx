import React, { useState, useEffect } from "react";
import { Card, Table, Button } from "../ui";

interface Course {
  courseCode: string;
  subjectName: string;
  professorName: string;
  credit: number;
  departmentName: string;
}

interface Department {
  deptCode: string;
  deptName: string;
}

export const AdminSystemManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("courseName");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams({
        department: selectedDepartment,
        type: searchType,
        keyword: searchKeyword,
      }).toString();
      const response = await fetch(`/api/courses/search?${query}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedDepartment]);

  const handleSearch = () => {
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="강의 관리">
        <div className="mb-4 flex items-center space-x-2">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="block w-auto px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm rounded-md focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          >
            <option value="">전체 학과</option>
            {departments.map((dept) => (
              <option key={dept.deptCode} value={dept.deptName}>
                {dept.deptName}
              </option>
            ))}
          </select>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="block w-auto px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm rounded-md focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          >
            <option value="courseName">강의명</option>
            <option value="courseCode">강의코드</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 rounded-md focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
        <Table headers={["학과", "과목코드", "과목명", "담당교수", "학점"]}>
          {courses.map((course) => (
            <tr key={course.courseCode}>
              <td className="px-6 py-4 text-sm text-center">{course.departmentName}</td>
              <td className="px-6 py-4 text-sm text-center">{course.courseCode}</td>
              <td className="px-6 py-4 text-sm font-medium text-center">{course.subjectName}</td>
              <td className="px-6 py-4 text-sm text-center">{course.professorName}</td>
              <td className="px-6 py-4 text-sm text-center">{course.credit}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
