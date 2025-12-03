import React, { useState, useEffect } from "react";
import type { AcademicSchedule } from "../../types";
import { Card, Button } from "../ui";

const MonthCalendar: React.FC<{ year: number; month: number; events: AcademicSchedule[] }> = ({ year, month, events }) => {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const categoryColor: { [key: string]: string } = {
    academic: "bg-blue-500 text-white",
    holiday: "bg-green-500 text-white",
    event: "bg-purple-500 text-white",
  };

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  let dayCounter = 1;

  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(new Date(0)); // Placeholder for blank days
  }

  while (dayCounter <= daysInMonth) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(year, month, dayCounter));
    dayCounter++;
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(new Date(0));
    weeks.push(currentWeek);
  }

  return (
    <div className="border-t border-l border-slate-200 bg-white">
      <div className="grid grid-cols-7">
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
      </div>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 relative h-28">
          {week.map((date, dayIndex) => (
            <div key={dayIndex} className="border-r border-b border-slate-200 p-1 relative">
              {date.getTime() !== 0 && (
                <span className={`font-semibold relative z-10 ${dayIndex === 0 ? "text-red-500" : "text-slate-700"}`}>{date.getDate()}</span>
              )}
            </div>
          ))}
          {events.map((event, eventIndex) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            let startDay = -1,
              endDay = -1;

            for (let i = 0; i < week.length; i++) {
              if (week[i].getTime() !== 0 && startDate.getTime() <= week[i].getTime() && endDate.getTime() >= week[i].getTime()) {
                if (startDay === -1) startDay = i;
                endDay = i;
              }
            }

            if (startDay !== -1) {
              return (
                <div
                  key={event.scheduleId}
                  className={`absolute top-8 left-0 right-0 mx-px my-px p-1 text-xs rounded truncate ${
                    categoryColor[event.category || "event"] || "bg-gray-400 text-white"
                  }`}
                  style={{ gridColumn: `${startDay + 1} / span ${endDay - startDay + 1}` }}
                >
                  {event.scheduleTitle}
                </div>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export const AcademicCalendar: React.FC = () => {
  const [events, setEvents] = useState<AcademicSchedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/schedules");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch academic schedules");
        }
      } catch (error) {
        console.error("Error fetching academic schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const eventsForMonth = events.filter((event) => {
    const eventYear = new Date(event.startDate).getFullYear();
    const eventMonth = new Date(event.startDate).getMonth();
    return eventYear === year && eventMonth === month;
  });

  return (
    <Card title="학사일정">
      <div className="flex items-center justify-center space-x-4 mb-6 border-b pb-4">
        <Button onClick={goToPreviousMonth}>&larr; 이전 달</Button>
        <h2 className="text-2xl font-bold text-slate-800">
          {year}년 {month + 1}월
        </h2>
        <Button onClick={goToNextMonth}>다음 달 &rarr;</Button>
      </div>
      <MonthCalendar year={year} month={month} events={eventsForMonth} />
    </Card>
  );
};
