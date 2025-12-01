import React from "react";
import type { Course } from "../../types";

export const ProfessorVisualTimetable: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const days = ["월", "화", "수", "목", "금"];
  const timeLabels = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`);
  const dayMap: { [key: string]: number } = { 월: 0, 화: 1, 수: 2, 목: 3, 금: 4 };
  const courseColors = [
    "bg-blue-100 border-blue-300 text-blue-800",
    "bg-green-100 border-green-300 text-green-800",
    "bg-purple-100 border-purple-300 text-purple-800",
    "bg-yellow-100 border-yellow-300 text-yellow-800",
    "bg-pink-100 border-pink-300 text-pink-800",
    "bg-indigo-100 border-indigo-300 text-indigo-800",
  ];
  const hourHeight = 48;

  const parseTime = (timeStr: string) => {
    if (!timeStr) return [];
    const parts = timeStr.split(",").map((s) => s.trim());
    const parsedSlots: { day: string; startTime: string; endTime: string }[] = [];
    parts.forEach((part) => {
      const match = part.match(/([월화수목금])\s*(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (match) {
        const [, day, startTime, endTime] = match;
        parsedSlots.push({ day, startTime, endTime });
      }
    });
    return parsedSlots;
  };

  const getCourseBlocks = () => {
    const blocks: React.ReactNode[] = [];
    courses.forEach((course, index) => {
      const timeSlots = parseTime(course.courseTime ?? "");
      timeSlots.forEach((slot, slotIndex) => {
        const startHour = parseInt(slot.startTime.split(":")[0]);
        const startMinute = parseInt(slot.startTime.split(":")[1]);
        const endHour = parseInt(slot.endTime.split(":")[0]);
        const endMinute = parseInt(slot.endTime.split(":")[1]);

        const top = (startHour - 9 + startMinute / 60) * hourHeight;
        const height = ((endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60) * hourHeight;
        const left = dayMap[slot.day] * 20;

        blocks.push(
          <div
            key={`${course.courseCode}-${slotIndex}`}
            className={`absolute rounded-lg p-1.5 text-[10px] flex flex-col overflow-hidden border ${courseColors[index % courseColors.length]}`}
            style={{
              top: `${top}px`,
              height: `${height - 2}px`,
              left: `calc(${left}% + 1px)`,
              width: "calc(20% - 2px)",
            }}
          >
            <p className="font-bold truncate">{course.subjectName}</p>
            <p className="truncate">{course.classroom}</p>
          </div>
        );
      });
    });
    return blocks;
  };

  return (
    <div className="flex select-none">
      <div className="w-12 text-right text-xs text-slate-400 flex flex-col shrink-0">
        {timeLabels.map((time) => (
          <div key={time} style={{ height: `${hourHeight}px` }} className="relative -top-2 pr-2 shrink-0">
            {time}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-5 relative" style={{ minHeight: `${10 * hourHeight}px` }}>
        <div className="col-span-5 grid grid-cols-5 absolute top-0 left-0 w-full h-8 -translate-y-full">
          {days.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-slate-600 py-1">
              {day}
            </div>
          ))}
        </div>
        {days.map((day, index) => (
          <div key={index} className="border-r border-slate-200 h-full"></div>
        ))}
        {timeLabels.map((_, index) => (
          <div
            key={index}
            className="absolute w-full border-t border-dashed border-slate-200"
            style={{ top: `${index * hourHeight}px`, zIndex: -1 }}
          ></div>
        ))}
        {getCourseBlocks()}
      </div>
    </div>
  );
};
