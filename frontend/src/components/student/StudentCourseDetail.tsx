import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Course } from "../../types";

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const StudentCourseDetail: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("인증 토큰이 없습니다.");

        const response = await fetch(`/api/courses/${courseCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setCourse(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (courseCode) {
      fetchCourseDetail();
    }
  }, [courseCode]);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">오류: {error}</div>;
  if (!course) return <div className="p-8 text-center">강의 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{course.subjectName}</h1>
        <p className="mt-2 text-gray-600">
          {course.professorName} 교수님
          <span className="mx-2">|</span>
          <span className="font-mono bg-gray-100 p-1 rounded text-sm">{course.courseCode}</span>
        </p>
      </div>

      {/* TODO: Add tabs for Syllabus, Announcements, Assignments etc. */}

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">강의계획서</h2>
        <div className="space-y-6">
          <DetailSection title="과목 개요">
            <p className="whitespace-pre-wrap">{course.courseObjectives || "내용이 없습니다."}</p>
          </DetailSection>
          <DetailSection title="강의 내용">
            <p className="whitespace-pre-wrap">{course.courseContent || "내용이 없습니다."}</p>
          </DetailSection>
          <DetailSection title="평가 방법">
            {course.evaluationMethod ? (
              <ul className="list-disc list-inside">
                {Object.entries(course.evaluationMethod).map(([key, value]) => (
                  <li key={key}>{`${key}: ${value}%`}</li>
                ))}
              </ul>
            ) : (
              <p>내용이 없습니다.</p>
            )}
          </DetailSection>
          <DetailSection title="교재 및 참고자료">
            <p className="whitespace-pre-wrap">{course.textbookInfo || "내용이 없습니다."}</p>
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetail;
