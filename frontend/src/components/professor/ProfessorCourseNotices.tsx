import React, { useState, useEffect } from "react";
import type { User, Course } from "../../types";
import { Card } from "../ui";
import { CourseNoticeBoard } from "../common/CourseNoticeBoard"; // 공통 컴포넌트 재사용

export const ProfessorCourseNotices: React.FC<{ user: User }> = ({ user }) => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // 1. 교수님의 강의 목록 불러오기 (기존 로직 동일)
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.memberNo) return;
      try {
        const token = localStorage.getItem("token");
        // 새 컨트롤러 주소 사용
        const response = await fetch(`/api/professors/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          // 과목명 매핑 로직
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.subjectName || c.subject?.sname || c.courseName || c.courseCode,
          }));
          setMyCourses(mappedCourses);
          if (mappedCourses.length > 0) setSelectedCourse(mappedCourses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, [user.memberNo]);

  return (
    <Card title="강의 공지사항 관리">
      {/* 강의 선택 드롭다운 */}
      <div className="mb-6 pb-4 border-b border-slate-200 flex items-center space-x-4">
        <label htmlFor="course-select" className="font-semibold text-slate-700 shrink-0">
          강의 선택:
        </label>
        <select
          id="course-select"
          value={selectedCourse?.courseCode || ""}
          onChange={(e) => setSelectedCourse(myCourses.find((c) => c.courseCode === e.target.value) || null)}
          className="block w-full max-w-sm px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
        >
          {myCourses.map((course) => (
            <option key={course.courseCode} value={course.courseCode}>
              {course.subjectName} ({course.courseCode})
            </option>
          ))}
        </select>
      </div>

      {/* 공지사항 게시판 컴포넌트 */}
      {selectedCourse ? (
        <CourseNoticeBoard 
          courseCode={selectedCourse.courseCode} 
          courseName={selectedCourse.subjectName}
          userRole="PROFESSOR"
          writerId={user.memberNo} 
        />
      ) : (
        <div className="text-center py-12 text-slate-500">
          관리할 강의가 없습니다.
        </div>
      )}
    </Card>
  );
};
