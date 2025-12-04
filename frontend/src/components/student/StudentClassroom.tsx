import React, { useState, useEffect } from "react";
import type { User, Course } from "../../types"; // 타입 경로 확인 필요
import { Card } from "../ui"; // UI 컴포넌트 경로 확인 필요
import { useNavigate } from "react-router-dom";

export const StudentClassroom: React.FC<{ user: User }> = ({ user }) => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      const token = localStorage.getItem("token");
      if (!user.memberNo) return;

      // 이미 만들어둔 수강신청 목록 API 활용
      try {
        const res = await fetch(`/api/enrollments/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // API 응답 구조에 따라 .course를 꺼내거나 그대로 씀
          // (보통 enrollment 객체 안에 course 객체가 들어있음)
          const courses = data.map((item: any) => item.course); 
          setMyCourses(courses);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEnrollments();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">내 강의실</h2>
      
      {myCourses.length === 0 ? (
        <Card><p className="text-center py-12 text-slate-500">수강 중인 강의가 없습니다.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <div 
              key={course.courseCode}
              onClick={() => navigate(`/student/classroom/${course.courseCode}`, { state: { course } })}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md hover:border-brand-blue transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-brand-blue text-xs font-bold px-2 py-1 rounded group-hover:bg-blue-100">
                  {course.courseCode}
                </span>
                <span className="text-slate-400 text-sm">{course.credit}학점</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">
                {(course as any).subjectName || (course as any).subject?.sName || course.courseCode}
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-slate-500 flex items-center">
                  <span className="w-16">교수님</span> 
                  <span className="font-medium text-slate-700">{course.professorName || "미정"}</span>
                </p>
                <p className="text-sm text-slate-500 flex items-center">
                  <span className="w-16">강의실</span> 
                  <span className="font-medium text-slate-700">{course.classroom || "미정"}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};