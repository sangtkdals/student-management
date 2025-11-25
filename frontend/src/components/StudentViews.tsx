import DEUCourseRegistrationApp from "../DEUCourseRegistrationApp";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User, Course } from "../types";
import { Card, Button, Table } from "./ui";
import { MOCK_COURSES, MOCK_GRADES, ICONS, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from "../constants";

// --- StudentHome Component (Modified) ---
export const StudentHome: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

  return (
    // -mt-6: 상단 파란색 배너(DashboardHero)와 살짝 겹치게 하여 일체감 있는 디자인 연출
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6 relative z-10">
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
                onClick={() => navigate("/student/timetable")}
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
            {MOCK_ANNOUNCEMENTS.slice(0, 4).map((ann) => (
              <li
                key={ann.postId}
                onClick={() => navigate("/announcements")}
                className="cursor-pointer group flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-center min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-brand-blue mr-2 flex-shrink-0"></span>
                  <p className="text-sm text-slate-700 group-hover:text-brand-blue font-medium truncate">{ann.title}</p>
                </div>
                <span className="text-xs text-slate-400 ml-4 whitespace-nowrap">{ann.createdAt.slice(0, 10)}</span>
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
            {MOCK_CALENDAR_EVENTS.slice(0, 3).map((evt) => (
              <li key={evt.scheduleId} className="flex items-start group">
                <div
                  className={`flex-shrink-0 w-10 h-10 flex flex-col items-center justify-center rounded-lg border ${
                    evt.category === "academic" ? "bg-blue-50 border-blue-100 text-brand-blue" : "bg-red-50 border-red-100 text-red-500"
                  } mr-3`}
                >
                  <span className="text-[10px] font-bold leading-none uppercase opacity-70">{evt.startDate.split("-")[1]}월</span>
                  <span className="text-sm font-extrabold leading-none mt-0.5">{evt.startDate.split("-")[2]}</span>
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-blue transition-colors">{evt.title}</p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded inline-block mt-1 ${
                      evt.category === "academic" ? "bg-slate-100 text-slate-500" : "bg-red-50 text-red-500"
                    }`}
                  >
                    {evt.category === "academic" ? "학사 일정" : "휴일"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Other Components (Course Registration, Grades, etc.) ---

export const StudentCourseRegistration: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DEUCourseRegistrationApp />
    </div>
  );
};


export const StudentAllGrades: React.FC = () => {
  // MOCK_GRADES has updated field names in main-ui feature
  const gradesBySemester = MOCK_GRADES.reduce((acc, grade) => {
    const key = `${grade.year}-${grade.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(grade);
    return acc;
  }, {} as { [key: string]: typeof MOCK_GRADES });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {Object.entries(gradesBySemester)
        .sort()
        .reverse()
        .map(([semester, grades]) => {
          const totalCredits = grades.reduce((sum, g) => sum + g.credit, 0);
          const semesterGPA = grades.reduce((sum, g) => sum + g.gradePoint * g.credit, 0) / totalCredits;

          return (
            <Card key={semester} title={`${semester.split("-")[0]}년 ${semester.split("-")[1]}학기 성적`}>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                <span className="font-bold text-slate-700">
                  학기 평점: <span className="text-brand-blue text-lg ml-2">{isNaN(semesterGPA) ? "0.00" : semesterGPA.toFixed(2)}</span>
                </span>
                <span className="text-sm text-slate-500">이수 학점: {totalCredits}</span>
              </div>
              <Table headers={["과목코드", "과목명", "학점", "성적", "평점"]}>
                {grades.map((grade) => (
                  <tr key={grade.gradeId}>
                    <td className="px-6 py-4 text-sm text-slate-500">{grade.courseCode}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{grade.courseName}</td>
                    <td className="px-6 py-4 text-sm text-center">{grade.credit}</td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-blue text-center">{grade.gradeLetter}</td>
                    <td className="px-6 py-4 text-sm text-center">{grade.gradePoint}</td>
                  </tr>
                ))}
              </Table>
            </Card>
          );
        })}
    </div>
  );
};

// Simple Placeholder Components for other views with standard padding
const PlaceholderView: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Card title={title}>
      <div className="text-center py-16">
        <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => alert("준비 중인 기능입니다.")}>
            자세히 보기
          </Button>
        </div>
      </div>
    </Card>
  </div>
);

export const StudentTuitionHistory: React.FC = () => <PlaceholderView title="등록금 납부 내역" desc="지난 학기 등록금 납부 내역을 조회합니다." />;
export const StudentLeaveApplication: React.FC = () => <PlaceholderView title="휴학 신청" desc="일반 휴학 및 군 휴학을 신청할 수 있습니다." />;
export const StudentGraduationCheck: React.FC = () => (
  <PlaceholderView title="졸업 요건 조회" desc="졸업에 필요한 학점 및 필수 이수 과목 충족 여부를 확인합니다." />
);
export const StudentTuitionPayment: React.FC = () => (
  <PlaceholderView title="등록금 납부" desc="이번 학기 등록금 고지서를 확인하고 납부할 수 있습니다." />
);
export const StudentLeaveHistory: React.FC = () => <PlaceholderView title="휴학 내역 조회" desc="신청한 휴학 처리 현황 및 과거 내역을 확인합니다." />;
export const StudentReturnApplication: React.FC = () => <PlaceholderView title="복학 신청" desc="휴학 후 복학을 신청합니다." />;
export const StudentReturnHistory: React.FC = () => <PlaceholderView title="복학 내역 조회" desc="복학 신청 처리 현황을 확인합니다." />;
export const StudentCertificateIssuance: React.FC = () => (
  <PlaceholderView title="증명서 발급" desc="재학증명서, 성적증명서 등 각종 증명서를 발급받을 수 있습니다." />
);
export const StudentTimetable: React.FC = () => <PlaceholderView title="시간표 조회" desc="이번 학기 수강 신청한 과목의 시간표를 확인합니다." />;
export const StudentCurrentGrades: React.FC = () => (
  <PlaceholderView title="금학기 성적 조회" desc="이번 학기 중간/기말 고사 성적 및 과제 점수를 확인합니다." />
);
