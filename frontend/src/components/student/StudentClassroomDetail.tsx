import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CourseNoticeBoard } from "../common/CourseNoticeBoard"; // 공통 컴포넌트 import
import { Button } from "../ui";

export const StudentClassroomDetail: React.FC = () => {
  const { courseCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 목록 페이지에서 넘겨준 강의 정보 받아오기
  const course = location.state?.course; 

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 상단 헤더 (강의명 + 뒤로가기 버튼) */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {course?.subjectName || course?.courseName || courseCode}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            내 강의실 &gt; 공지사항
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          목록으로
        </Button>
      </div>

      {/* 공통 게시판 컴포넌트 사용 (학생 모드) */}
      {courseCode && (
        <CourseNoticeBoard 
          courseCode={courseCode} 
          courseName={course?.subjectName || course?.courseName || courseCode}
          userRole="STUDENT" 
          // writerId는 필요 없음 (학생은 글쓰기 불가)
        />
      )}
    </div>
  );
};