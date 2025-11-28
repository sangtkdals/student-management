// src/components/MyTimetable.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { Course } from "../types";

interface MyTimetableProps {
  // 수강신청 완료 화면에서는 props로 넘겨주고,
  // "시간표 조회" 페이지에서는 props 없이 호출하면 localStorage에서 자동으로 읽게 할 것
  courses?: Course[];
}

const MyTimetable: React.FC<MyTimetableProps> = ({ courses: propCourses }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  // 1) props.courses가 있으면 그걸 우선 사용
  // 2) 없으면 localStorage("registeredCourses")에서 읽어서 셋팅
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
        console.log("📥 loaded registeredCourses from localStorage:", parsed);
      }
    } catch (e) {
      console.error("❌ failed to load registeredCourses from localStorage:", e);
    }
  }, [propCourses]);

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

  // [day_startTime] → 그 칸에 들어갈 과목들
  const timetableMap = useMemo(() => {
    const map: Record<string, Course[]> = {};

    courses.forEach((course) => {
      const timeText = (course as any).timeText ?? course.time; // 둘 중 있는 거 사용
      if (!timeText) return;

      // 예: "월 10:00-11:50, 수 09:00-10:50"
      const parts = timeText.split(",");
      parts.forEach((p) => {
        const token = p.trim();
        if (!token) return;

        const [day, range] = token.split(" ");
        if (!day || !range) return;

        const [start] = range.split("-");
        const key = `${day}_${start}`;
        if (!map[key]) map[key] = [];
        map[key].push(course);
      });
    });

    return map;
  }, [courses]);

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
