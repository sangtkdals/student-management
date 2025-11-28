// src/components/Timetable.tsx
import React, { useEffect, useState, useMemo } from "react";
import type { Course } from "../types";

interface MyTimetableProps {
  // props로도 받을 수 있게 해둠 (선택사항)
  courses?: Course[];
}

/**
 * 요일/시간별 격자 시간표 형태로 렌더링하는 컴포넌트
 * - 우선 props.courses를 사용
 * - 없으면 localStorage("registeredCourses")에서 읽어옴
 */
const MyTimetable: React.FC<MyTimetableProps> = ({ courses: propCourses }) => {
  const [storedCourses, setStoredCourses] = useState<Course[]>([]);

  // 🔁 localStorage에서 과목 목록 로드
  useEffect(() => {
    if (propCourses && propCourses.length > 0) {
      // props로 받은 게 있으면 우선 사용
      setStoredCourses(propCourses);
      return;
    }

    try {
      const raw = localStorage.getItem("registeredCourses");
      if (raw) {
        const parsed = JSON.parse(raw) as Course[];
        setStoredCourses(parsed);
        console.log("📥 localStorage에서 registeredCourses 로드:", parsed);
      } else {
        console.log("ℹ️ registeredCourses가 localStorage에 없음");
      }
    } catch (e) {
      console.error("❌ registeredCourses 로드 중 오류:", e);
    }
  }, [propCourses]);

  // 요일, 시간슬롯 등은 프로젝트에서 쓰던 규칙에 맞게 조절
  const days = ["월", "화", "수", "목", "금"];
  const timeSlots = useMemo(
    () => [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ],
    []
  );

  // [day][time] → 과목
  const MyTimetableMap = useMemo(() => {
    const map: Record<string, Course[]> = {};

    storedCourses.forEach((course) => {
      // 프로젝트에서 쓰는 timeText 형식에 맞게 파싱 필요
      // 예: "월 09:00-10:50, 수 11:00-12:50"
      const times = course.time?.split(",") || [];
      times.forEach((part) => {
        const trimmed = part.trim(); // "월 09:00-10:50"
        if (!trimmed) return;

        const [day, timeRange] = trimmed.split(" ");
        if (!day || !timeRange) return;

        const [start] = timeRange.split("-");
        const key = `${day}_${start}`;
        if (!map[key]) map[key] = [];
        map[key].push(course);
      });
    });

    return map;
  }, [storedCourses]);

  return (
    <div className="w-full overflow-x-auto">
      {storedCourses.length === 0 ? (
        <p className="text-sm text-gray-500">
          저장된 시간표가 없습니다. 먼저 수강신청을 완료해 주세요.
        </p>
      ) : null}

      <table className="min-w-full border border-gray-200 text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-200 px-2 py-2 w-20">시간</th>
            {days.map((day) => (
              <th key={day} className="border border-gray-200 px-2 py-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot}>
              <td className="border border-gray-200 px-2 py-2 bg-gray-50 font-semibold">
                {slot}
              </td>
              {days.map((day) => {
                const key = `${day}_${slot}`;
                const cellCourses = MyTimetableMap[key] || [];

                return (
                  <td
                    key={key}
                    className="border border-gray-200 px-1 py-2 align-top"
                  >
                    {cellCourses.length > 0 ? (
                      <div className="space-y-1">
                        {cellCourses.map((c) => (
                          <div
                            key={c.id}
                            className="rounded-md bg-blue-50 border border-blue-200 px-1 py-1"
                          >
                            <p className="text-xs font-semibold text-blue-800">
                              {c.name}
                            </p>
                            <p className="text-[10px] text-blue-700">
                              {c.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-300">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTimetable;
