// src/ai-course-registration/components/MyTimetable.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { Course } from "../types"; // 실제 types 경로에 맞게 조정

interface MyTimetableProps {
  courses?: Course[];
}

// "HH:MM" → 분 단위 숫자
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const MyTimetable: React.FC<MyTimetableProps> = ({ courses: propCourses }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  // 1) props.courses 우선 사용
  // 2) 없으면 localStorage에서 registeredCourses 읽기
  useEffect(() => {
    if (propCourses && propCourses.length > 0) {
      setCourses(propCourses);
      return;
    }

    try {
      const raw = localStorage.getItem("registeredCourses");
      if (raw) {
        const parsed = JSON.parse(raw) as Course[];
        setCourses(parsed);
      }
    } catch (e) {
      console.error("failed to load registeredCourses:", e);
    }
  }, [propCourses]);

  const days = ["월", "화", "수", "목", "금"];

  // 기준 시간 슬롯 (1시간 단위)
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

  // [day_timeSlot] → 그 칸에 들어갈 과목들
  // ※ 이제는 "범위 전체" 칸에 넣도록 수정
  const timetableMap = useMemo(() => {
    const map: Record<string, Course[]> = {};

    courses.forEach((course) => {
      const timeText = (course as any).timeText ?? course.time;
      if (!timeText) return;

      // 예: "월 10:00-11:50, 수 13:00-14:50"
      const parts = timeText.split(",");
      parts.forEach((p) => {
        const token = p.trim();
        if (!token) return;

        const [day, range] = token.split(" ");
        if (!day || !range) return;

        const [startStr, endStr] = range.split("-");
        if (!startStr || !endStr) return;

        const startMin = timeToMinutes(startStr);
        const endMin = timeToMinutes(endStr);

        // 이 강의가 걸치는 모든 hour slot에 추가
        timeSlots.forEach((slot) => {
          const slotMin = timeToMinutes(slot);

          // slot 시작 시간이 강의 시간 범위 안에 있으면 포함
          // 예) 13:00~14:50 이면 13:00, 14:00 두 칸에 들어감
          if (slotMin >= startMin && slotMin < endMin) {
            const key = `${day}_${slot}`;
            if (!map[key]) map[key] = [];
            map[key].push(course);
          }
        });
      });
    });

    return map;
  }, [courses, timeSlots]);

  return (
    <div className="w-full overflow-x-auto">
      {courses.length === 0 && (
        <p className="text-sm text-gray-500 mb-4">
          이번 학기에 신청한 과목이 없습니다. 먼저 수강신청을 완료해 주세요.
        </p>
      )}

      <table className="min-w-full border border-gray-200 text-sm text-center bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-200 px-2 py-2 w-20">시간</th>
            {days.map((d) => (
              <th key={d} className="border border-gray-200 px-2 py-2 w-32">
                {d}
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
                const cellCourses = timetableMap[key] || [];
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
                            className="rounded-md bg-blue-50 border border-blue-200 px-2 py-1"
                          >
                            <div className="text-xs font-semibold text-blue-900">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-blue-800">
                              {(c as any).classroom ?? c.location}
                            </div>
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
