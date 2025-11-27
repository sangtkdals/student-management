import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DEUCourseRegistrationApp from "../DEUCourseRegistrationApp";
import type { User } from "../types";
import { Card, Button, Table, Modal } from "./ui";
import {
  MOCK_COURSES,
  MOCK_GRADES,
  ICONS,
  MOCK_ANNOUNCEMENTS,
  MOCK_CALENDAR_EVENTS,
} from "../constants";
import axios from "axios";

// --- Mock Data & Types for Leave/Return (여기에 붙여넣기) ---

type LeaveRequest = {
  id: number;
  type: "일반휴학" | "군휴학" | "질병휴학" | "창업휴학";
  applyDate: string;
  startSemester: string;
  endSemester: string;
  reason: string;
  status: "신청완료" | "승인완료" | "반려";
};

type ReturnRequest = {
  id: number;
  applyDate: string;
  returnSemester: string;
  type: "일반복학" | "제대복학";
  status: "신청완료" | "승인완료" | "반려";
};

// 초기 더미 데이터
const MOCK_LEAVE_HISTORY: LeaveRequest[] = [
  {
    id: 1,
    type: "일반휴학",
    applyDate: "2023-08-15",
    startSemester: "2023-2",
    endSemester: "2024-1",
    reason: "개인 사정 및 자기계발",
    status: "승인완료",
  },
];

const MOCK_RETURN_HISTORY: ReturnRequest[] = [
  {
    id: 2,
    applyDate: "2024-02-10",
    returnSemester: "2024-1",
    type: "일반복학",
    status: "승인완료",
  },
];

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
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">
                  수강신청
                </span>
              </button>
              <button
                onClick={() => navigate("/student/timetable")}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                  {React.cloneElement(ICONS.calendar, { className: "h-6 w-6 text-brand-blue" })}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">
                  시간표 조회
                </span>
              </button>
              <button
                onClick={() => navigate("/student/all-grades")}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                  {React.cloneElement(ICONS.grades, { className: "h-6 w-6 text-brand-blue" })}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">
                  성적 조회
                </span>
              </button>
              <button
                onClick={() => navigate("/student/certificate-issuance")}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                  {React.cloneElement(ICONS.profile, { className: "h-6 w-6 text-brand-blue" })}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">
                  증명서 발급
                </span>
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
            <button
              onClick={() => navigate("/announcements")}
              className="text-xs text-slate-500 hover:text-brand-blue font-bold"
            >
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
                  <p className="text-sm text-slate-700 group-hover:text-brand-blue font-medium truncate">
                    {ann.title}
                  </p>
                </div>
                <span className="text-xs text-slate-400 ml-4 whitespace-nowrap">
                  {ann.createdAt.slice(0, 10)}
                </span>
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
            <button
              onClick={() => navigate("/calendar")}
              className="text-xs text-slate-500 hover:text-brand-blue font-bold"
            >
              전체보기 +
            </button>
          </div>
          <ul className="space-y-4">
            {MOCK_CALENDAR_EVENTS.slice(0, 3).map((evt) => (
              <li key={evt.scheduleId} className="flex items-start group">
                <div
                  className={`flex-shrink-0 w-10 h-10 flex flex-col items-center justify-center rounded-lg border ${
                    evt.category === "academic"
                      ? "bg-blue-50 border-blue-100 text-brand-blue"
                      : "bg-red-50 border-red-100 text-red-500"
                  } mr-3`}
                >
                  <span className="text-[10px] font-bold leading-none uppercase opacity-70">
                    {evt.startDate.split("-")[1]}월
                  </span>
                  <span className="text-sm font-extrabold leading-none mt-0.5">
                    {evt.startDate.split("-")[2]}
                  </span>
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-blue transition-colors">
                    {evt.title}
                  </p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded inline-block mt-1 ${
                      evt.category === "academic"
                        ? "bg-slate-100 text-slate-500"
                        : "bg-red-50 text-red-500"
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

/* ======= 성적 조회 컴포넌트들 ======= */

const CurrentSemesterGrades: React.FC = () => {
  const currentSemester = "2023-2"; // TODO: 나중에 로그인 정보/DB 연동
  const currentGrades = MOCK_GRADES.filter(
    (g) => `${g.year}-${g.semester}` === currentSemester
  );

  return (
    <Card title={`금학기(${currentSemester}) 성적 상세 조회`}>
      {currentGrades.length === 0 ? (
        <p className="text-center py-8 text-slate-500">
          등록된 성적이 없습니다.
        </p>
      ) : (
        <Table headers={["과목코드", "과목명", "학점", "성적", "평점"]}>
          {currentGrades.map((grade) => (
            <tr key={grade.gradeId}>
              <td className="px-6 py-4 text-sm text-slate-500">
                {grade.courseCode}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-800">
                {grade.courseName}
              </td>
              <td className="px-6 py-4 text-sm text-center">{grade.credit}</td>
              <td className="px-6 py-4 text-sm font-bold text-brand-blue text-center">
                {grade.gradeLetter}
              </td>
              <td className="px-6 py-4 text-sm text-center">
                {grade.gradePoint}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </Card>
  );
};

const AllSemesterGrades: React.FC = () => {
  const gradesBySemester = MOCK_GRADES.reduce(
    (acc, grade) => {
      const key = `${grade.year}-${grade.semester}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(grade);
      return acc;
    },
    {} as { [key: string]: typeof MOCK_GRADES }
  );

  const totalCredits = MOCK_GRADES.reduce(
    (sum, g) => sum + (g.credit || 0),
    0
  );
  const totalWeightedPoints = MOCK_GRADES.reduce(
    (sum, g) => sum + (g.gradePoint || 0) * (g.credit || 0),
    0
  );
  const overallGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;

  return (
    <div className="space-y-6">
      <Card title="전체 성적 요약">
        <div className="grid grid-cols-2 gap-4 p-2">
          <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-sm font-bold text-slate-500 mb-2">
              총 평점 평균 (GPA)
            </span>
            <div className="flex items-end">
              <span className="text-4xl font-extrabold text-brand-blue">
                {overallGPA.toFixed(2)}
              </span>
              <span className="text-lg text-slate-400 mb-1 ml-1">/ 4.5</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-sm font-bold text-slate-500 mb-2">
              총 이수 학점
            </span>
            <div className="flex items-end">
              <span className="text-4xl font-extrabold text-slate-700">
                {totalCredits}
              </span>
              <span className="text-lg text-slate-400 mb-1 ml-1">학점</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="border-t border-slate-200 my-4" />

      {Object.entries(gradesBySemester)
        .sort()
        .reverse()
        .map(([semester, grades]) => {
          const semTotalCredits = grades.reduce(
            (sum, g) => sum + (g.credit || 0),
            0
          );
          const semWeightedPoints = grades.reduce(
            (sum, g) => sum + (g.gradePoint || 0) * (g.credit || 0),
            0
          );
          const semGPA =
            semTotalCredits > 0 ? semWeightedPoints / semTotalCredits : 0;

          const [yearStr, semStr] = semester.split("-");

          return (
            <Card key={semester} title={`${yearStr}년 ${semStr}학기`}>
              <div className="mb-4 p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center shadow-sm">
                <span className="font-bold text-slate-700 text-sm">
                  학기 평점:{" "}
                  <span className="text-brand-blue text-lg ml-2">
                    {isNaN(semGPA) ? "0.00" : semGPA.toFixed(2)}
                  </span>
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  이수: {semTotalCredits}학점
                </span>
              </div>
              <Table headers={["과목명", "학점", "성적", "평점"]}>
                {grades.map((grade) => (
                  <tr key={grade.gradeId}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {grade.courseName}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {grade.credit}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-blue text-center">
                      {grade.gradeLetter}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {grade.gradePoint}
                    </td>
                  </tr>
                ))}
              </Table>
            </Card>
          );
        })}
    </div>
  );
};

export const StudentGradeCenter: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"current" | "all">("current");

  useEffect(() => {
    if (location.pathname.includes("all-grades")) {
      setActiveTab("all");
    } else {
      setActiveTab("current");
    }
  }, [location.pathname]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("current")}
          className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all ${
            activeTab === "current"
              ? "bg-white text-brand-blue shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          금학기 성적
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all ${
            activeTab === "all"
              ? "bg-white text-brand-blue shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          전체 성적
        </button>
      </div>

      <div className="animate-fade-in">
        {activeTab === "current" ? (
          <CurrentSemesterGrades />
        ) : (
          <AllSemesterGrades />
        )}
      </div>
    </div>
  );
};

// 라우터에서 기존에 StudentAllGrades를 사용하고 있을 수 있으니
// StudentGradeCenter를 그대로 래핑해서 export
export const StudentAllGrades: React.FC = () => <StudentGradeCenter />;

// Simple Placeholder Components for other views with standard padding
const PlaceholderView: React.FC<{ title: string; desc: string }> = ({
  title,
  desc,
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Card title={title}>
      <div className="text-center py-16">
        <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
          <svg
            className="w-12 h-12 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
          <Button
            variant="secondary"
            onClick={() => alert("준비 중인 기능입니다.")}
          >
            자세히 보기
          </Button>
        </div>
      </div>
    </Card>
  </div>
);

export const StudentTuitionHistory: React.FC = () => {
  const navigate = useNavigate();

  const tuitionData = [
    {
      year: 2024,
      semester: "1학기",
      amount: "3,500,000원",
      status: "납부 완료",
      date: "2024-02-28",
    },
    {
      year: 2023,
      semester: "2학기",
      amount: "3,300,000원",
      status: "납부 완료",
      date: "2023-08-25",
    },
  ];

  const hasUnpaidTuition = false;

  return (
    <Card title="등록금 납부 내역 조회">
      <p className="mb-6 text-slate-600">
        등록금 납부 내역 및 상세 영수증을 확인합니다.
      </p>

      <div className="space-y-6">
        {tuitionData.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white"
          >
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {item.year}년 {item.semester}
              </p>
              <p className="text-sm text-slate-600">
                금액:{" "}
                <span className="font-semibold">{item.amount}</span>
              </p>
              <p
                className={`text-sm font-medium ${
                  item.status === "납부 완료"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                상태: {item.status}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/student/tuition-payment")}
            >
              자세히 보기
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          미납 내역 (예시)
        </h3>

        {hasUnpaidTuition ? (
          <div className="text-red-600 p-4 border border-red-300 bg-red-50 rounded-lg">
            <p>2025년 1학기 등록금 미납 상태입니다.</p>
            <Button
              className="mt-3"
              onClick={() => navigate("/student/tuition-payment")}
            >
              등록금 납부하기
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center p-4 border border-blue-300 bg-blue-50 rounded-lg">
            <p className="text-slate-700">
              현재 <span className="font-semibold">미납된 등록금 내역은 없습니다.</span>{" "}
              다음 학기 등록금 납부를 미리 확인하시려면 버튼을 클릭해주세요.
            </p>
            <Button
              variant="primary"
              className="ml-4 flex-shrink-0"
              onClick={() => navigate("/student/tuition-payment")}
            >
              등록금 납부 페이지로 이동
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export const StudentLeaveApplication: React.FC = () => {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState("일반휴학");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 휴학 기간 상태 추가
const [startYear, setStartYear] = useState(2025);
const [startSemester, setStartSemester] = useState(1);
const [endYear, setEndYear] = useState(2025);
const [endSemester, setEndSemester] = useState(2);

  const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    // 한글 휴학 타입을 영문 코드로 변환
    const leaveTypeMap: Record<string, string> = {
      "일반휴학": "GENERAL",
      "군휴학": "MILITARY",
      "질병휴학": "ILLNESS",
      "창업휴학": "PREGNANCY"  // DB에 PREGNANCY 타입이 있으므로 매핑
    };
    
    // 백엔드 API 호출
    await axios.post("/api/leave-applications", {
      leaveType: leaveTypeMap[leaveType],
      startYear,
      startSemester,
      endYear,
      endSemester,
      reason
    });
    
    alert("휴학 신청이 완료되었습니다.");
    navigate("/student/leave-history");
  } catch (error) {
    console.error("Error submitting leave application:", error);
    alert("휴학 신청 실패");
  } finally {
    setIsSubmitting(false);
    setShowConfirm(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Card title="휴학 신청">
        {/* 안내문 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h4 className="font-bold text-blue-700 mb-2">📌 휴학 신청 유의사항</h4>
          <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
            <li>일반휴학은 1회에 1년(2학기) 이내로 신청 가능합니다.</li>
            <li>도서관 대출 도서가 있을 경우 반납 후 신청 가능합니다.</li>
            <li>등록금 납부 후 휴학할 경우, 복학 시 등록금은 이월됩니다.</li>
          </ul>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* 신청 정보 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                신청 연도/학기
              </label>
              <input
                type="text"
                value="2025학년도 1학기"
                disabled
                className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                휴학 구분
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full border border-slate-300 rounded-md py-2 px-3 focus:ring-brand-blue focus:border-brand-blue"
              >
                <option value="일반휴학">일반휴학</option>
                <option value="군휴학">군휴학 (입영통지서 첨부 필수)</option>
                <option value="질병휴학">질병휴학 (진단서 첨부 필수)</option>
                <option value="창업휴학">창업휴학</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              휴학 기간 (예정)
            </label>
            <div className="flex items-center space-x-2">
              <select 
                value={`${startYear}-${startSemester}`}
                onChange={(e) => {
                  const [year, semester] = e.target.value.split('-');
                  setStartYear(parseInt(year));
                  setStartSemester(parseInt(semester));
                }}
                className="flex-1 border border-slate-300 rounded-md py-2 px-3"
              >
                <option value="2025-1">2025-1학기 부터</option>
                <option value="2025-2">2025-2학기 부터</option>
              </select>
              <span className="text-slate-500">~</span>
              <select 
                value={`${endYear}-${endSemester}`}
                onChange={(e) => {
                  const [year, semester] = e.target.value.split('-');
                  setEndYear(parseInt(year));
                  setEndSemester(parseInt(semester));
                }}
                className="flex-1 border border-slate-300 rounded-md py-2 px-3"
              >
                <option value="2025-2">2025-2학기 까지 (1년)</option>
                <option value="2025-1">2025-1학기 까지 (6개월)</option>
                <option value="2026-1">2026-1학기 까지 (1.5년)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              신청 사유
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="구체적인 사유를 입력해주세요."
              className="w-full border border-slate-300 rounded-md py-2 px-3 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>

          {/* 파일 업로드 (군휴학/질병휴학 시 활성화 가정) */}
          {(leaveType === "군휴학" || leaveType === "질병휴학") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                증빙 서류 첨부
              </label>
              <input
                type="file"
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-brand-blue
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-slate-500">
                * PDF, JPG 파일만 업로드 가능 (최대 5MB)
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button onClick={() => setShowConfirm(true)} disabled={!reason}>
              휴학 신청하기
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="휴학 신청 확인"
      >
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>{leaveType}</strong>을 신청하시겠습니까?
            <br />
            제출 후에는 수정이 불가능하며, 취소는 행정실 문의가 필요할 수 있습니다.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "처리중..." : "확인 및 신청"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const StudentGraduationCheck: React.FC = () => (
  <PlaceholderView
    title="졸업 요건 조회"
    desc="졸업에 필요한 학점 및 필수 이수 과목 충족 여부를 확인합니다."
  />
);

type StudentTuitionPaymentProps = {
  setActiveView?: (viewName: string) => void;
};

export const StudentTuitionPayment: React.FC<StudentTuitionPaymentProps> = () => {
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid">(
    "unpaid"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeOptionalFee, setIncludeOptionalFee] = useState(true);

  const bill = {
    semester: "2024학년도 2학기",
    period: "2024.08.21 ~ 2024.08.27",
    tuition: 4500000,
    scholarship: 1500000,
    studentUnionFee: 20000,
    account: {
      bank: "우리은행",
      number: "1002-987-654321",
      holder: "대학교(김민준)",
    },
  };

  const finalAmount =
    bill.tuition -
    bill.scholarship +
    (includeOptionalFee ? bill.studentUnionFee : 0);
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  });

  const handlePaymentStart = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus("paid");
      setIsModalOpen(false);
    }, 2000);
  };

  if (paymentStatus === "paid") {
    return (
      <div className="space-y-8">
        <Card title="등록금 납부">
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">납부 완료</h3>
            <p className="text-slate-600 mb-4">
              2024학년도 2학기 등록금 납부가 정상적으로 처리되었습니다.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg text-left max-w-sm w-full mx-auto border border-slate-200">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 text-sm">납부 금액</span>
                <span className="font-bold text-brand-blue">
                  {formatter.format(finalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">납부 일시</span>
                <span className="text-slate-800 text-sm">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card title="등록금 고지서 조회 및 납부">
        <div className="space-y-6">
          {/* Warning Alert */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-red-800">
                  미납 등록금이 있습니다.
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  <span className="font-semibold">{bill.semester}</span> 납부
                  기간입니다. ({bill.period})
                  <br />
                  기한 내에 납부하지 않을 경우 수강신청 내역이 취소될 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
              <span className="w-1.5 h-6 bg-brand-blue mr-2 rounded-sm"></span>
              등록금 고지 내역
            </h4>
            <div className="border border-brand-gray rounded-lg overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-brand-gray-light">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      항목
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      수업료 (Tuition)
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-slate-800">
                      {formatter.format(bill.tuition)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      장학금 (성적우수)
                      <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        감면
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-red-600 font-medium">
                      - {formatter.format(bill.scholarship)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 flex items-center">
                      <input
                        id="union-fee"
                        type="checkbox"
                        checked={includeOptionalFee}
                        onChange={(e) =>
                          setIncludeOptionalFee(e.target.checked)
                        }
                        className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-slate-300 rounded mr-3 cursor-pointer"
                      />
                      <label
                        htmlFor="union-fee"
                        className="cursor-pointer select-none"
                      >
                        학생회비 (선택)
                      </label>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-slate-600">
                      {formatter.format(bill.studentUnionFee)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td className="px-6 py-4 text-base font-bold text-slate-800">
                      실 납부 금액
                    </td>
                    <td className="px-6 py-4 text-xl font-bold text-right text-brand-blue">
                      {formatter.format(finalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handlePaymentStart}
              className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transform transition-all active:scale-95"
            >
              납부하기 (가상계좌)
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
        title="가상계좌 납부 안내"
      >
        <div className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h4 className="font-bold text-xl text-slate-800">
              납부하실 금액
            </h4>
            <p className="text-3xl font-extrabold text-brand-blue tracking-tight">
              {formatter.format(finalAmount)}
            </p>
          </div>

          <div className="bg-slate-100 p-5 rounded-lg border border-slate-200 shadow-inner space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">
                입금 은행
              </span>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold mr-2">
                  W
                </span>
                <span className="font-bold text-slate-800">
                  {bill.account.bank}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
              <span className="text-slate-500 text-sm font-medium">
                계좌번호
              </span>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-800 text-lg tracking-wider block">
                  {bill.account.number}
                </span>
                <span className="text-xs text-slate-400">
                  예금주: {bill.account.holder}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-yellow-800">
              <span className="font-bold">주의사항:</span> 반드시 학생 본인
              명의 또는 지정된 가상계좌로 입금해야 처리가 완료됩니다. <br />
              이체 후 아래{" "}
              <span className="font-bold">'이체 완료 확인'</span> 버튼을
              눌러주세요.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="min-w-[140px]"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  처리중...
                </span>
              ) : (
                "이체 완료 확인"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const StudentLeaveHistory: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="휴학 내역 조회">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-slate-600">
            총 <span className="font-bold text-brand-blue">{MOCK_LEAVE_HISTORY.length}</span>건의 휴학 내역이 있습니다.
          </p>
        </div>

        {MOCK_LEAVE_HISTORY.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            휴학 내역이 존재하지 않습니다.
          </div>
        ) : (
          <Table headers={["신청일자", "휴학구분", "휴학기간", "사유", "상태"]}>
            {MOCK_LEAVE_HISTORY.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-center text-slate-600">
                  {item.applyDate}
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-slate-800">
                  {item.type}
                </td>
                <td className="px-6 py-4 text-sm text-center text-slate-600">
                  {item.startSemester} ~ {item.endSemester}
                </td>
                <td className="px-6 py-4 text-sm text-left text-slate-600 max-w-xs truncate">
                  {item.reason}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === "승인완료"
                        ? "bg-green-100 text-green-700"
                        : item.status === "반려"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export const StudentReturnApplication: React.FC = () => {
  const navigate = useNavigate();
  const [returnType, setReturnType] = useState("일반복학");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 현재 휴학 상태인지 체크하는 로직 (Mock)
  const isEligibleToReturn = true; 

  const handleReturnSubmit = () => {
    if (!window.confirm("복학을 신청하시겠습니까?")) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("복학 신청이 접수되었습니다.");
      navigate("/student/return-history");
    }, 1000);
  };

  if (!isEligibleToReturn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="복학 신청">
          <div className="text-center py-16">
            <div className="text-slate-400 mb-4">
               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">복학 신청 대상자가 아닙니다.</h3>
            <p className="mt-2 text-slate-500">현재 재학 중이거나, 휴학 기간이 종료되지 않았습니다.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="복학 신청">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 좌측: 현재 상태 정보 */}
          <div className="md:col-span-1 bg-slate-50 p-6 rounded-lg border border-slate-200 h-fit">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center">
              {ICONS.profile} <span className="ml-2">학생 정보</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">학번</span>
                <span className="font-medium text-slate-800">20211234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">성명</span>
                <span className="font-medium text-slate-800">김민준</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">현재 학적</span>
                <span className="font-bold text-orange-600">휴학 (일반)</span>
              </div>
              <hr className="border-slate-200 my-2" />
              <div className="flex justify-between">
                <span className="text-slate-500">복학 예정 학기</span>
                <span className="font-bold text-brand-blue">2025-1학기</span>
              </div>
            </div>
          </div>

          {/* 우측: 신청 폼 */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                복학 구분
              </label>
              <div className="flex space-x-4">
                {["일반복학", "제대복학"].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="returnType"
                      value={type}
                      checked={returnType === type}
                      onChange={(e) => setReturnType(e.target.value)}
                      className="h-4 w-4 text-brand-blue border-slate-300 focus:ring-brand-blue"
                    />
                    <span className="ml-2 text-slate-700">{type}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                * 군휴학 자는 반드시 '제대복학'을 선택하고 전역증 사본을 제출해야 합니다.
              </p>
            </div>

            {returnType === "제대복학" && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  전역증(병적증명서) 첨부
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500 border border-slate-300 rounded-md cursor-pointer bg-white focus:outline-none"
                />
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <p className="text-sm text-yellow-800 font-medium">
                [필독] 복학 신청 유의사항
              </p>
              <ul className="list-disc list-inside text-xs text-yellow-700 mt-2 space-y-1">
                <li>복학 신청 승인 후 정해진 기간 내에 등록금을 납부해야 합니다.</li>
                <li>수강신청 기간 이전에 복학 처리가 완료되어야 수강신청이 가능합니다.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleReturnSubmit} disabled={isSubmitting}>
                {isSubmitting ? "처리중..." : "복학 신청하기"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const StudentReturnHistory: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="복학 내역 조회">
        <p className="mb-4 text-sm text-slate-600">
          과거의 복학 신청 내역 및 처리 현황입니다.
        </p>

        {MOCK_RETURN_HISTORY.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            복학 신청 내역이 없습니다.
          </div>
        ) : (
          <Table headers={["신청일자", "복학구분", "복학학기", "상태"]}>
            {MOCK_RETURN_HISTORY.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-center text-slate-600">
                  {item.applyDate}
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-slate-800">
                  {item.type}
                </td>
                <td className="px-6 py-4 text-sm text-center text-slate-600">
                  {item.returnSemester}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === "승인완료"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export const StudentCertificateIssuance: React.FC = () => (
  <PlaceholderView
    title="증명서 발급"
    desc="재학증명서, 성적증명서 등 각종 증명서를 발급받을 수 있습니다."
  />
);

export const StudentTimetable: React.FC = () => (
  <PlaceholderView
    title="시간표 조회"
    desc="이번 학기 수강 신청한 과목의 시간표를 확인합니다."
  />
);
