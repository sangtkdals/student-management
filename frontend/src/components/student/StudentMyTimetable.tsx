import React from "react";
import MyTimetable from "../../ai-course-registration/components/MyTimetable";

export const StudentMyTimetable: React.FC = () => (
  <main className="flex-grow container mx-auto p-4 lg:p-6">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 lg:p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">시간표 조회</h2>
      <p className="text-sm text-gray-500 mb-6">이번 학기 수강 신청한 과목의 시간표를 확인합니다.</p>

      {/* 🔥 실제 시간표 */}
      <MyTimetable />
    </div>
  </main>
);
