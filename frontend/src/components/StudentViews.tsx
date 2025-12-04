import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DEUCourseRegistrationApp from "../DEUCourseRegistrationApp";
import type { User, Tuition } from "../types";
import MyTimetable from "../ai-course-registration/components/MyTimetable";
import { Card, Button, Table, Modal } from "./ui";
import { MOCK_COURSES, MOCK_GRADES, ICONS, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from "../constants";
import axios from 'axios';

// --- StudentHome Component (Modified) ---
export const StudentHome: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

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

interface GradeData {
  gradeId: number;
  year: number; // 백엔드 DTO의 getYear() -> year
  semester: number; // 백엔드 DTO의 getSemester() -> semester
  courseCode: string;
  courseName: string;
  credit: number;
  gradeLetter: string;
  gradePoint: number;
}

const CurrentSemesterGrades: React.FC<{ grades: GradeData[] }> = ({ grades }) => {
  const currentYear = 2025;
  const currentSemester = 2;

  const currentGrades = grades.filter((g) => g.year === currentYear && g.semester === currentSemester);

  return (
    <Card title={`금학기(${currentYear}-${currentSemester}) 성적 상세 조회`}>
      {currentGrades.length === 0 ? (
        <p className="text-center py-8 text-slate-500">등록된 성적이 없습니다.</p>
      ) : (
        // 테이블 헤더도 정렬에 맞게 조정될 것입니다.
        <Table headers={["과목코드", "과목명", "학점", "성적", "평점"]}>
          {currentGrades.map((grade) => (
            <tr key={grade.gradeId}>
              <td className="px-6 py-4 text-sm text-slate-500 w-24 text-center whitespace-nowrap">{grade.courseCode}</td>
              {/* 과목명은 넓게 쓰도록 너비 제한 없음 */}
              <td className="px-6 py-4 text-sm font-medium text-slate-800">{grade.courseName}</td>
              {/* 아래 3개는 너비 고정 (w-24) */}
              <td className="px-6 py-4 text-sm text-center w-24 whitespace-nowrap">{grade.credit}</td>
              <td className="px-6 py-4 text-sm font-bold text-brand-blue text-center w-24 whitespace-nowrap">{grade.gradeLetter}</td>
              <td className="px-6 py-4 text-sm text-center w-24 whitespace-nowrap">{grade.gradePoint}</td>
            </tr>
          ))}
        </Table>
      )}
    </Card>
  );
};

const AllSemesterGrades: React.FC<{ grades: GradeData[] }> = ({ grades }) => {
  const completedGrades = grades.filter((g) => g.gradePoint !== null);
  const totalCredits = completedGrades.reduce((sum, g) => sum + (g.credit || 0), 0);
  const totalWeightedPoints = completedGrades.reduce((sum, g) => sum + (g.gradePoint || 0) * (g.credit || 0), 0);
  const overallGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;

  const gradesBySemester = grades.reduce((acc, grade) => {
    const key = `${grade.year}-${grade.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(grade);
    return acc;
  }, {} as { [key: string]: GradeData[] });

  return (
    <div className="space-y-6">
      <Card title="전체 성적 요약">
        <div className="grid grid-cols-2 gap-4 p-2">
          <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-sm font-bold text-slate-500 mb-2">총 평점 평균 (GPA)</span>
            <div className="flex items-end">
              <span className="text-4xl font-extrabold text-brand-blue">{overallGPA.toFixed(2)}</span>
              <span className="text-lg text-slate-400 mb-1 ml-1">/ 4.5</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">* 수강 중인 과목 제외</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-sm font-bold text-slate-500 mb-2">총 이수 학점</span>
            <div className="flex items-end">
              <span className="text-4xl font-extrabold text-slate-700">{totalCredits}</span>
              <span className="text-lg text-slate-400 mb-1 ml-1">학점</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="border-t border-slate-200 my-4"></div>

      {Object.entries(gradesBySemester)
        .sort()
        .reverse()
        .map(([semesterKey, semesterGrades]) => {
          const [year, sem] = semesterKey.split("-");

          const semCompleted = semesterGrades.filter((g) => g.gradePoint !== null);
          const semCredits = semCompleted.reduce((sum, g) => sum + (g.credit || 0), 0);
          const semWeighted = semCompleted.reduce((sum, g) => sum + (g.gradePoint || 0) * (g.credit || 0), 0);
          const semGPA = semCredits > 0 ? semWeighted / semCredits : 0;
          const isInProgress = semesterGrades.some((g) => g.gradePoint === null);

          return (
            <Card key={semesterKey} title={`${year}년 ${sem}학기`}>
              <div className="mb-4 p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center shadow-sm">
                <span className="font-bold text-slate-700 text-sm">
                  학기 평점:
                  {isInProgress ? (
                    <span className="text-slate-400 text-lg ml-2">-</span>
                  ) : (
                    <span className="text-brand-blue text-lg ml-2">{semGPA.toFixed(2)}</span>
                  )}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  {isInProgress ? "수강 신청: " : "이수 학점: "}
                  {semesterGrades.reduce((sum, g) => sum + g.credit, 0)}학점
                </span>
              </div>

              <Table headers={["과목명", "학점", "성적", "평점"]}>
                {semesterGrades.map((grade) => (
                  <tr key={grade.gradeId}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{grade.courseName}</td>
                    <td className="px-6 py-4 text-sm text-center w-24 whitespace-nowrap">{grade.credit}</td>

                    <td className="px-6 py-4 text-sm font-bold text-center w-24 whitespace-nowrap">
                      {grade.gradeLetter ? (
                        <span className="text-brand-blue">{grade.gradeLetter}</span>
                      ) : (
                        <span className="text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded-full">수강중</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-center w-24 whitespace-nowrap">{grade.gradePoint !== null ? grade.gradePoint : "-"}</td>
                  </tr>
                ))}
              </Table>
            </Card>
          );
        })}
    </div>
  );
};

export const StudentGradeCenter: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"current" | "all">("current");
  const [grades, setGrades] = useState<GradeData[]>([]);

  useEffect(() => {
    if (location.pathname.includes("all-grades")) {
      setActiveTab("all");
    } else {
      setActiveTab("current");
    }
  }, [location.pathname]);

  useEffect(() => {
    const studentId = user?.id;

    if (studentId) {
      fetch(`http://localhost:8080/api/grades?studentId=${studentId}`)
        .then((res) => {
          if (!res.ok) throw new Error("성적 조회 실패");
          return res.json();
        })
        .then((data) => {
          setGrades(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("current")}
          className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all ${
            activeTab === "current" ? "bg-white text-brand-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          금학기 성적
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all ${
            activeTab === "all" ? "bg-white text-brand-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          전체 성적
        </button>
      </div>

      <div className="animate-fade-in">
        {activeTab === "current" ? <CurrentSemesterGrades grades={grades} /> : <AllSemesterGrades grades={grades} />}
      </div>
    </div>
  );
};

// 라우터에서 기존에 StudentAllGrades를 사용하고 있을 수 있으니
// StudentGradeCenter를 그대로 래핑해서 export
export const StudentAllGrades: React.FC<{ user: User }> = ({ user }) => <StudentGradeCenter user={user} />;

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

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
};

// 납부 상태에 따른 스타일
const getStatusClasses = (status: Tuition['paymentStatus']) => {
    switch (status) {
        case 'PAID':
            return 'bg-green-100 text-green-800';
        case 'UNPAID':
            return 'bg-red-100 text-red-800';
        case 'OVERDUE':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-slate-100 text-slate-800';
    }
};

export const StudentTuitionHistory: React.FC<{ user: User }> = ({ user }) => {
    const [tuitionHistory, setTuitionHistory] = useState<Tuition[]>([]);
    // user.memberNo가 유효하면 로딩 상태로 시작, 아니면 로딩을 시작하지 않음 (false)
    const [isLoading, setIsLoading] = useState(!!user?.memberNo);
    // 초기 에러는 null로 설정
    const [error, setError] = useState<string | null>(null);

    // 컴포넌트 마운트 시 등록금 내역을 불러오는 useEffect
    useEffect(() => {
        const fetchTuitionHistory = async () => {
            // 1. user.memberNo가 유효하지 않으면 로딩 상태를 false로 설정하고 함수 종료.
            if (!user?.memberNo) {
                // 에러 상태가 아직 설정되지 않았다면 에러 메시지 설정
                if (!error) {
                    setError("오류: 사용자 정보(memberNo/학번)가 불완전합니다. 로그인을 확인해주세요.");
                }
                setIsLoading(false);
                return;
            }

            try {
                // 2. user.memberNo가 유효하게 들어왔을 때만 로딩 시작
                setIsLoading(true);
                setError(null);

                // API 호출: `/student/tuition-history` 경로 유지
                const response = await axios.get<Tuition[]>(`/api/student/tuition-history`, {
                    params: { studentNo: user.memberNo }
                });

                // A-1. 응답 데이터가 있는지 확인 (null/undefined/빈 문자열 방지)
                const rawData = response.data;

                // A-2. 데이터가 배열인지 확인하고, 배열이 아니면 빈 배열로 처리하여 TypeError와 "내역 없음" 오류 방지
                const tuitionArray: Tuition[] = Array.isArray(rawData) ? rawData : [];

                // 데이터가 유효한 배열일 때만 정렬을 시도
                const sortedHistory = tuitionArray.sort((a, b) => {
                    if (a.academicYear !== b.academicYear) {
                        return b.academicYear - a.academicYear;
                    }
                    return b.semester - a.semester;
                });

                setTuitionHistory(sortedHistory);
            } catch (err: any) {
                console.error("Failed to fetch tuition history:", err);
                // HTTP 오류에 대한 사용자 친화적 메시지 출력
                if (err.response?.status === 404) {
                    setError("등록금 내역 조회 API 경로를 찾을 수 없습니다 (404). 서버 구성을 확인해주세요.");
                } else if (err.response?.status === 403) {
                    setError("권한이 없습니다 (403). 로그인이 만료되었거나 이 서비스에 접근할 권한이 부족합니다. 로그인을 다시 시도해주세요.");
                } else {
                    setError("등록금 내역을 불러오는 중 오류가 발생했습니다. 서버 연결을 확인해주세요.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTuitionHistory();
        // user?.memberNo가 null/undefined에서 유효한 학번으로 바뀔 때만 다시 호출됨
    }, [user?.memberNo]);

    // --- 로딩 및 에러 상태 처리 ---
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card title="등록금 납부 내역 조회">
                    <div className="text-center py-16 text-red-500">
                        <p className="font-bold mb-2">데이터 로딩 오류</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card title="등록금 납부 내역 조회">
                    <div className="text-center py-16 text-slate-500">
                        <svg className="animate-spin mx-auto h-8 w-8 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4">등록금 납부 내역을 불러오는 중입니다...</p>
                    </div>
                </Card>
            </div>
        );
    }
    // ------------------------------

    // 정상 데이터 표시
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <Card title="등록금 납부 내역 조회">
                {tuitionHistory.length === 0 ? (
                    <p className="text-center py-8 text-slate-500">조회된 등록금 납부 내역이 없습니다.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table
                            headers={[
                                "학년도/학기",
                                "고지금액",
                                "장학금",
                                "실 납부액",
                                "납부기한",
                                "납부일",
                                "상태",
                                "영수증 번호"
                            ]}
                        >
                            {tuitionHistory.map((item) => {
                                // 실 납부액 계산 (고지금액 - 장학금)
                                const netTuition = item.tuitionAmount - item.scholarshipAmount;

                                return (
                                    <tr key={item.tuitionId}>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                            {item.academicYear}년 {item.semester}학기
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.tuitionAmount)}</td>
                                        <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                                            - {formatCurrency(item.scholarshipAmount)}
                                        </td>
                                        <td className="px-4 py-3 text-base font-bold text-right text-brand-blue">
                                            {formatCurrency(netTuition)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600 text-center">{item.dueDate || '미정'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500 text-center">{item.paidDate || '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold ${getStatusClasses(item.paymentStatus)}`}>
                                                {item.paymentStatus === 'PAID' ? '납부 완료' : item.paymentStatus === 'UNPAID' ? '미납' : '기한 초과'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400 font-mono">{item.receiptNo || '-'}</td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>
                )}
            </Card>

            {/* 추가 설명 섹션 */}
            <Card title="참고 사항" className="bg-slate-50 border-slate-200">
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    <li>'실 납부액'은 등록금(수업료)에서 장학금 감면액을 제외한, 학생이 최종적으로 납부해야 할 금액입니다.</li>
                    <li>미납(UNPAID) 또는 기한 초과(OVERDUE) 상태의 등록금은 '등록금 납부' 메뉴에서 고지서를 확인하고 납부할 수 있습니다.</li>
                    <li>기타 등록금 관련 문의는 학사지원팀으로 연락해 주시기 바랍니다.</li>
                </ul>
            </Card>
        </div>
    );
};

export const StudentLeaveApplication: React.FC = () => <PlaceholderView title="휴학 신청" desc="일반 휴학 및 군 휴학을 신청할 수 있습니다." />;

export const StudentGraduationCheck: React.FC = () => (
  <PlaceholderView title="졸업 요건 조회" desc="졸업에 필요한 학점 및 필수 이수 과목 충족 여부를 확인합니다." />
);

const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
});


export const StudentTuitionPayment: React.FC<{ user: User }> = ({ user }) => {
    // 등록금 청구 내역 리스트 상태
    const [tuitionBills, setTuitionBills] = useState<Tuition[]>([]);
    // 데이터 로딩 상태
    const [isLoading, setIsLoading] = useState(true);
    // API 에러 상태
    const [error, setError] = useState<string | null>(null);
    // 납부 확인 모달 상태
    const [showModal, setShowModal] = useState(false);
    // 납부 처리 중 상태 (로딩 스피너용)
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    // 선택된 등록금 ID 리스트 (복수 선택 지원)
    // Tuition 인터페이스에 따라 id 대신 tuitionId 사용
    const [selectedBillIds, setSelectedBillIds] = useState<number[]>([]);
    // 납부 방식 (백엔드에 전달)
    const [paymentMethod, setPaymentMethod] = useState<'TRANSFER' | 'CARD' | 'OTHER'>('TRANSFER');

    // 학번 정보
    const studentNo = user?.memberNo;

    // 1. 등록금 고지서 데이터 불러오기 (미납 내역만)
    const fetchPayableTuitionBills = async () => {
        if (!studentNo) {
            setError("학생 학번 정보가 누락되었습니다.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // GET /api/student/tuition-history?studentNo={학번} (전체 내역을 가져온 후 필터링)
            const response = await axios.get<Tuition[]>(`/api/student/tuition-history`, {
                params: { studentNo },
            });

            // 미납(UNPAID) 또는 기한 초과(OVERDUE) 상태의 내역만 필터링
            const payableBills = response.data.filter(b =>
                b.paymentStatus === "UNPAID" || b.paymentStatus === "OVERDUE"
            );

            // billAmount는 서버에서 계산되는 것이 이상적이지만,
            // 프론트엔드에서 계산해야 하는 경우, 이 단계에서 각 항목의 billAmount를 미리 계산하여 사용합니다.
            // 다만, 현재 Tuition 인터페이스에 billAmount 필드가 명시되지 않았으므로
            // useMemo에서 직접 계산하는 방식을 유지하고, 필터링 시 bill.tuitionId를 사용합니다.

            setTuitionBills(payableBills);
        } catch (err) {
            console.error("등록금 고지서 조회 실패:", err);
            setError("등록금 고지서 정보를 불러오는 데 실패했습니다. 서버 상태를 확인하거나 잠시 후 다시 시도해주세요.");
            setTuitionBills([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 데이터 로드
        fetchPayableTuitionBills();
    }, [studentNo]);

    // 체크박스 선택/해제 핸들러
    const handleCheckChange = (tuitionId: number, isChecked: boolean) => {
        setSelectedBillIds(prev =>
            isChecked ? [...prev, tuitionId] : prev.filter(id => id !== tuitionId)
        );
    };

    // 전체 선택/해제 핸들러
    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            // 미납 내역의 tuitionId만 모두 선택
            setSelectedBillIds(tuitionBills.map(b => b.tuitionId));
        } else {
            setSelectedBillIds([]);
        }
    };

    const isAllSelected = tuitionBills.length > 0 && selectedBillIds.length === tuitionBills.length;

    // 2. 선택된 항목의 총 납부 금액 계산 (수업료 - 장학금 감면액)
    const totalSelectedAmount = useMemo(() => {
        return tuitionBills
            .filter(bill => selectedBillIds.includes(bill.tuitionId)) // bill.id -> bill.tuitionId로 수정
            .reduce((sum, bill) => sum + (bill.tuitionAmount - bill.scholarshipAmount), 0); // 계산 방식 수정
    }, [selectedBillIds, tuitionBills]);

    // 3. 납부 시작 (모달 열기)
    const handlePaymentStart = () => {
        if (selectedBillIds.length > 0) {
            setShowModal(true);
        } else {
            alert("납부할 등록금 항목을 1개 이상 선택해주세요.");
        }
    };

    // 4. 납부 완료 확인 (API 연동 - 일괄 납부)
    const handleConfirmPayment = async () => {
        if (selectedBillIds.length === 0 || isPaymentProcessing) return;

        setIsPaymentProcessing(true);
        setError(null);

        try {
            // POST /api/student/tuition-payment (복수 ID 배열 전송)
            const payload = {
                tuitionIds: selectedBillIds, // 선택된 등록금 ID 배열 (tuitionId)
                paymentMethod: paymentMethod, // 납부 방식
                // finalAmount는 서버에서 재검증 및 최종 처리됨. 필요하다면 totalSelectedAmount를 함께 전송
            };

            const response = await axios.post(`/api/student/tuition-payment`, payload);

            // 성공 처리 후 상태 업데이트 및 모달 닫기
            alert(response.data.message || "등록금 납부가 성공적으로 처리되었습니다.");

            // 납부 완료 후 최신 상태를 반영하기 위해 재조회
            await fetchPayableTuitionBills();

            setSelectedBillIds([]); // 선택 초기화
            setShowModal(false);

        } catch (err) {
            console.error("납부 확인 처리 실패:", err);
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || "납부 처리 중 오류가 발생했습니다. 입금 내역을 확인해주세요."
                : "알 수 없는 오류가 발생했습니다.";
            setError(errorMessage);
        } finally {
            setIsPaymentProcessing(false);
        }
    };


    // --- Render Logic: Loading, Empty, Unpaid List 순서로 처리 ---

    // 로딩 상태
    if (isLoading) {
        return (
            <Card title="등록금 고지서 조회">
                <div className="flex justify-center items-center h-40">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-slate-600">등록금 내역을 불러오는 중...</span>
                </div>
            </Card>
        );
    }

    // 미납 고지서가 없는 상태
    if (tuitionBills.length === 0) {
        return (
            <Card title="등록금 납부">
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-600">
                    <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">현재 미납된 등록금이 없습니다.</h3>
                    <p>납부할 고지서가 없거나, 납부 기간이 아닙니다. 이전 납부 내역은 '등록금 내역 조회' 메뉴를 이용해주세요.</p>
                    {error && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-800 font-medium rounded-lg text-sm max-w-lg">
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </Card>
        );
    }

    // 미납 내역 표시
    const firstBill = tuitionBills[0];
    const isOverdue = firstBill.paymentStatus === "OVERDUE";

    return (
        <div className="space-y-8">
            <Card title="등록금 고지서 조회 및 납부">
                <div className="space-y-6">
                    {/* 에러 메시지 표시 영역 */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-800 font-medium rounded-lg">
                            <p className='text-sm'>{error}</p>
                        </div>
                    )}

                    {/* Warning Alert */}
                    <div className={`bg-${isOverdue ? 'yellow-50' : 'red-50'} border-l-4 border-${isOverdue ? 'yellow-500' : 'red-500'} p-4 rounded-lg`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className={`h-5 w-5 text-${isOverdue ? 'yellow-500' : 'red-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className={`text-sm font-bold text-${isOverdue ? 'yellow-800' : 'red-800'}`}>
                                    {isOverdue ? '납부 기한이 초과되었습니다. (OVERDUE)' : '미납 등록금이 있습니다. (UNPAID)'}
                                </h3>
                                <p className={`text-sm text-${isOverdue ? 'yellow-700' : 'red-700'} mt-1`}>
                                    현재 총 {tuitionBills.length} 건의 미납 등록금 내역이 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
                            <span className="w-1.5 h-6 bg-blue-600 mr-2 rounded-sm"></span>
                            납부 대상 내역 (선택 가능)
                        </h4>

                        {/* 납부 리스트 테이블 (순수 HTML 태그로 변경) */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {/* Table.HeaderCell -> th */}
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-12">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-brand-blue rounded border-gray-300"
                                                checked={isAllSelected}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                            />
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">학기</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">수업료 (청구액)</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">장학금 (감면액)</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">납부 금액</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-24">납부 기한</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-20">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {tuitionBills.map((bill) => {
                                        // 최종 납부 금액 계산
                                        const netAmount = bill.tuitionAmount - bill.scholarshipAmount;

                                        return (
                                            <tr key={bill.tuitionId} className={selectedBillIds.includes(bill.tuitionId) ? 'bg-blue-50/50' : ''}>
                                                {/* Table.Cell -> td */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                                                        checked={selectedBillIds.includes(bill.tuitionId)} // bill.id -> bill.tuitionId로 수정
                                                        onChange={(e) => handleCheckChange(bill.tuitionId, e.target.checked)} // bill.id -> bill.tuitionId로 수정
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{bill.academicYear}학년도 {bill.semester}학기</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-slate-800">
                                                    {formatter.format(bill.tuitionAmount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                                                    - {formatter.format(bill.scholarshipAmount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-right text-blue-600">
                                                    {formatter.format(netAmount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {bill.dueDate || '미정'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.paymentStatus === 'OVERDUE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {bill.paymentStatus === 'OVERDUE' ? '기한 초과' : '미납'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-base font-bold text-slate-800 text-left">
                                            선택 항목 총 납부 금액
                                        </td>
                                        <td colSpan={3} className="px-6 py-4 text-2xl font-extrabold text-right text-blue-600">
                                            {formatter.format(totalSelectedAmount)}
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
                            disabled={isPaymentProcessing || selectedBillIds.length === 0} // 납부 처리 중이거나 선택 항목이 없으면 비활성화
                        >
                            선택 항목 일괄 납부하기
                        </Button>
                    </div>
                </div>
            </Card>

            {/* 납부 확인 모달 (내용은 이전과 동일) */}
            <Modal isOpen={showModal} onClose={() => !isPaymentProcessing && setShowModal(false)} title="등록금 일괄 납부 확인">
                <div className="space-y-6">
                    <div className="text-center space-y-2 mb-6">
                        <h4 className="font-bold text-xl text-slate-800">납부하실 최종 금액</h4>
                        <p className="text-3xl font-extrabold text-blue-600 tracking-tight">{formatter.format(totalSelectedAmount)}</p>
                        <p className="text-slate-600">선택하신 **{selectedBillIds.length}** 건에 대한 금액입니다.</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">납부 방식 선택:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as 'TRANSFER' | 'CARD' | 'OTHER')}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md"
                        >
                            <option value="TRANSFER">가상 계좌 이체</option>
                            <option value="CARD">신용카드</option>
                            <option value="OTHER">기타</option>
                        </select>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-yellow-800">
                            <span className="font-bold">납부 처리 안내:</span>
                            <br />
                            확인 버튼을 누르면 DB에 **납부 완료**로 처리됩니다. 실제 금액 이체는 별도의 금융 시스템을 이용해야 합니다.
                            <span className="font-bold"> 최종 금액({formatter.format(totalSelectedAmount)})</span>을 확인해주세요.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isPaymentProcessing}>
                            취소
                        </Button>
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={isPaymentProcessing || totalSelectedAmount <= 0}
                            className="min-w-[140px] px-4 py-2"
                        >
                            {isPaymentProcessing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    처리중...
                                </span>
                            ) : (
                                "DB 납부 완료 확인"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export const StudentLeaveHistory: React.FC = () => <PlaceholderView title="휴학 내역 조회" desc="신청한 휴학 처리 현황 및 과거 내역을 확인합니다." />;

export const StudentReturnApplication: React.FC = () => <PlaceholderView title="복학 신청" desc="휴학 후 복학을 신청합니다." />;

export const StudentReturnHistory: React.FC = () => <PlaceholderView title="복학 내역 조회" desc="복학 신청 처리 현황을 확인합니다." />;

export const StudentCertificateIssuance: React.FC = () => (
  <PlaceholderView title="증명서 발급" desc="재학증명서, 성적증명서 등 각종 증명서를 발급받을 수 있습니다." />
);

export const StudentMyTimetable: React.FC = () => (
  <main className="flex-grow container mx-auto p-4 lg:p-6">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 lg:p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">시간표 조회</h2>
      <p className="text-sm text-gray-500 mb-6">이번 학기 수강 신청한 과목의 시간표를 확인합니다.</p>

      {/* 실제 시간표 */}
      <MyTimetable />
    </div>
  </main>
);
