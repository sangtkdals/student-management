import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, Post, AcademicSchedule } from "../../types";
import { ICONS } from "../../constants";
import axios from "axios";

export const StudentHome: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Post[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<AcademicSchedule[]>([]);

  useEffect(() => {
    // Fetch announcements
    axios
      .get("/api/announcements?sort=createdAt,desc&size=4")
      .then((response) => {
        setAnnouncements(response.data.content);
      })
      .catch((error) => console.error("Error fetching announcements:", error));

    // Fetch calendar events
    axios
      .get("/api/schedules?sort=startDate,asc&size=3")
      .then((response) => {
        setCalendarEvents(response.data);
      })
      .catch((error) => console.error("Error fetching calendar events:", error));
  }, []);

  return (
    // -mt-6 제거: 상단/하단 마진 균형 맞춤
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. 주요 서비스 바로가기 (Quick Links) */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-md border border-brand-gray p-6">
            <div className="flex items-center mb-4 text-brand-blue">
              {ICONS.system}
              <h3 className="ml-2 text-lg font-bold text-slate-800">주요 서비스 바로가기</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/student/course-registration")}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                  {React.cloneElement(ICONS.courses, { className: "h-6 w-6 text-brand-blue" })}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">수강신청</span>
              </button>
              <button
                onClick={() => navigate("/student/MyTimetable")}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                  {React.cloneElement(ICONS.calendar, { className: "h-6 w-6 text-brand-blue" })}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">시간표 조회</span>
              </button>
              <button
                onClick={() => navigate("/student/all-grades")}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                  {React.cloneElement(ICONS.grades, { className: "h-6 w-6 text-brand-blue" })}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">성적 조회</span>
              </button>
              <button
                onClick={() => navigate("/student/certificate-issuance")}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                  {React.cloneElement(ICONS.profile, { className: "h-6 w-6 text-brand-blue" })}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">증명서 발급</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. 공지사항 (Notices) */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-brand-blue">
              {ICONS.announcement}
              <h3 className="ml-2 text-lg font-bold text-slate-800">공지사항</h3>
            </div>
            <button onClick={() => navigate("/announcements")} className="text-xs text-slate-500 hover:text-brand-blue font-bold">
              더보기 +
            </button>
          </div>
          <ul className="space-y-3">
            {announcements.map((ann) => (
              <li
                key={ann.postId}
                onClick={() => navigate(`/announcements/${ann.postId}`)}
                className="cursor-pointer group flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-center min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-brand-blue mr-2 flex-shrink-0"></span>
                  <p className="text-sm text-slate-700 group-hover:text-brand-blue font-medium truncate">{ann.postTitle}</p>
                </div>
                <span className="text-xs text-slate-400 ml-4 whitespace-nowrap">{new Date(ann.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. 학사일정 (Calendar) */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-brand-blue">
              {ICONS.calendar}
              <h3 className="ml-2 text-lg font-bold text-slate-800">학사일정</h3>
            </div>
            <button onClick={() => navigate("/calendar")} className="text-xs text-slate-500 hover:text-brand-blue font-bold">
              전체보기 +
            </button>
          </div>
          <ul className="space-y-4">
            {calendarEvents.map((evt) => {
              const date = new Date(evt.startDate);
              const month = date.toLocaleString("ko-KR", { month: "long" });
              const day = date.getDate();

              return (
                <li key={evt.scheduleId} className="flex items-start group">
                  <div
                    className={`flex-shrink-0 w-10 h-10 flex flex-col items-center justify-center rounded-lg border ${
                      evt.category === "academic" ? "bg-blue-50 border-blue-100 text-brand-blue" : "bg-red-50 border-red-100 text-red-500"
                    } mr-3`}
                  >
                    <span className="text-[10px] font-bold leading-none uppercase opacity-70">{month}</span>
                    <span className="text-sm font-extrabold leading-none mt-0.5">{day}</span>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-blue transition-colors">{evt.scheduleTitle}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded inline-block mt-1 ${
                        evt.category === "academic" ? "bg-slate-100 text-slate-500" : "bg-red-50 text-red-500"
                      }`}
                    >
                      {evt.category === "academic" ? "학사 일정" : "휴일"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
