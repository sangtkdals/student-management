// src/components/RegistrationResult.tsx
import React, { useEffect } from "react";
import MyTimetable from "./MyTimetable"; // 혹은 "./Timetable" (현재 merge 브랜치 구조에 맞춰서)
import type { Course, User } from "../types";
import { CheckCircleIcon } from "./icons/Icons";

interface RegistrationResultProps {
  courses: Course[];      // 이번에 신청한 과목 목록
  user: User;
  totalCredits: number;
  maxCredits: number;
  onGoBack: () => void;
}

const RegistrationResult: React.FC<RegistrationResultProps> = ({
  courses,
  user,
  totalCredits,
  maxCredits,
  onGoBack,
}) => {
  // ✅ 수강신청 완료 후, 시간표를 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem("registeredCourses", JSON.stringify(courses));
      console.log("✅ registeredCourses 저장 완료:", courses);
    } catch (e) {
      console.error("❌ registeredCourses 저장 중 오류:", e);
    }
  }, [courses]);

  return (
    <main className="flex-grow container mx-auto p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 lg:p-10 animate-fade-in">
        {/* 상단 완료 메시지 */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-800">
            수강신청 완료
          </h2>
          <p className="mt-2 text-md text-gray-600">
            {user.name}님의 수강신청이 정상적으로 완료되었습니다.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            총 신청 학점:{" "}
            <span className="font-semibold text-gray-800">
              {totalCredits}
            </span>{" "}
            / {maxCredits}학점
          </p>
        </div>

        {/* 신청 과목 리스트 */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            신청 과목 목록
          </h3>
          {courses.length === 0 ? (
            <p className="text-gray-500 text-sm">
              신청된 과목이 없습니다. 이전 화면으로 돌아가 과목을 선택해 주세요.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {course.name} ({course.code})
                    </p>
                    <p className="text-sm text-gray-500">
                      {course.professor} · {course.time} ·{" "}
                      {course.location}
                    </p>
                  </div>
                  <p className="mt-1 sm:mt-0 text-sm text-gray-600">
                    {course.credits}학점
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ✅ 여기서 MyTimetable(또는 Timetable)로 미리보기도 가능 */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            시간표 미리보기
          </h3>
          <div className="border rounded-xl p-4 bg-gray-50">
            {/* MyTimetable이 props로 courses를 받도록 해도 되고,
               아래 Timetable처럼 localStorage에서 읽도록 해도 됨 */}
            <MyTimetable courses={courses} />
          </div>
        </section>

        {/* 버튼 */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onGoBack}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            과목 선택 다시하기
          </button>
          {/* 여기서 "시간표 조회로 이동" 버튼을 라우터와 연결해도 됨 */}
        </div>
      </div>
    </main>
  );
};

export default RegistrationResult;
