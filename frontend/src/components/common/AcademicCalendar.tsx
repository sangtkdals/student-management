import React, { useState } from "react";
import type { AcademicSchedule, CalendarEvent } from "../../types";
import { Card, Button } from "../ui";
import { MOCK_CALENDAR_EVENTS } from "../../constants";

// DB 타입(AcademicSchedule)과 Mock 타입(CalendarEvent) 호환 지원
type CalendarItem = AcademicSchedule | CalendarEvent;

const MonthCalendar: React.FC<{ year: number; month: number; events: CalendarItem[] }> = ({ year, month, events }) => {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  const categoryColor: { [key: string]: string } = {
    academic: "bg-blue-500 text-white",
    holiday: "bg-green-500 text-white",
    event: "bg-purple-500 text-white",
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="border-r border-b border-slate-200"></div>);

  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const currentDate = new Date(year, month, day);
    currentDate.setHours(0, 0, 0, 0);
    const dayOfWeek = currentDate.getDay();

    const isToday = isCurrentMonth && today.getDate() === day;

    const dayEvents = events.filter((e) => {
      const eventStartDate = new Date(e.startDate);
      eventStartDate.setHours(0, 0, 0, 0);
      const eventEndDate = new Date(e.endDate); // CalendarEvent, AcademicSchedule 모두 endDate 존재
      eventEndDate.setHours(0, 0, 0, 0);
      return currentDate >= eventStartDate && currentDate <= eventEndDate;
    });

    const isHoliday = dayEvents.some((event) => event.category === "holiday");
    const isSunday = dayOfWeek === 0;

    return (
      <div key={day} className="border-r border-b border-slate-200 p-2 min-h-[120px] flex flex-col relative">
        <span
          className={`font-semibold ${
            isToday
              ? "bg-brand-blue text-white rounded-full h-6 w-6 flex items-center justify-center"
              : isHoliday || isSunday
              ? "text-red-500"
              : "text-slate-700"
          }`}
        >
          {day}
        </span>
        <div className="flex-grow space-y-1 mt-1 overflow-y-auto">
          {dayEvents.map((event) => {
            // 타입 호환: scheduleId(DB) vs id(Mock)
            const id = "scheduleId" in event ? event.scheduleId : event.id;
            const colorClass = event.category && categoryColor[event.category] ? categoryColor[event.category] : "bg-gray-400 text-white";

            return (
              <div key={id} title={event.title} className={`text-xs p-1 rounded-md truncate ${colorClass}`}>
                {event.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
        {year}년 {month + 1}월
      </h3>
      <div className="grid grid-cols-7 border-t border-l border-slate-200 bg-white">
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className={`text-center font-bold text-sm py-2 border-r border-b border-slate-200 bg-slate-50 ${
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-slate-600"
            }`}
          >
            {day}
          </div>
        ))}
        {blanks}
        {dayCells}
      </div>
    </div>
  );
};

export const AcademicCalendar: React.FC = () => {
  // Mock 데이터 타입 캐스팅
  const events = MOCK_CALENDAR_EVENTS as CalendarItem[];

  const allYears = [...new Set(events.map((e) => new Date(e.startDate).getFullYear()))].sort();
  const [selectedYear, setSelectedYear] = useState(allYears.length > 0 ? allYears[allYears.length - 1] : new Date().getFullYear());

  const eventsForYear = events.filter((event) => new Date(event.startDate).getFullYear() === selectedYear);
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Card title="학사일정">
      <div className="flex items-center justify-center space-x-2 mb-6 border-b pb-6">
        {(allYears.length > 0 ? allYears : [new Date().getFullYear()]).map((year) => (
          <Button key={year} variant={selectedYear === year ? "primary" : "secondary"} onClick={() => setSelectedYear(year)}>
            {year}년
          </Button>
        ))}
      </div>
      <div className="space-y-12 max-h-[75vh] overflow-y-auto p-1">
        {months.map((month) => (
          <MonthCalendar key={month} year={selectedYear} month={month} events={eventsForYear} />
        ))}
      </div>
    </Card>
  );
};
