import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { User } from "../../types";
import { Card, Table } from "../ui";

interface GradeData {
  gradeId: number;
  year: number;
  semester: number;
  courseCode: string;
  courseName: string;
  credit: number;
  gradeLetter: string;
  gradePoint: number;
}

const CurrentSemesterGrades: React.FC<{ grades: GradeData[] }> = ({ grades }) => {

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  
  let currentYear = today.getFullYear();
  let currentSemester = 1;

  if (currentMonth >= 3 && currentMonth <= 8) {
    currentSemester = 1;
  } else {
    currentSemester = 2;
    if (currentMonth === 1 || currentMonth === 2) {
      currentYear -= 1;
    }
  }

  const currentGrades = grades.filter((g) => g.year === currentYear && g.semester === currentSemester);

  return (
    <Card title={`금학기(${currentYear}-${currentSemester}) 성적 상세 조회`}>
      {currentGrades.length === 0 ? (
        <p className="text-center py-8 text-slate-500">
          등록된 성적이 없습니다.<br/>
          <span className="text-xs text-slate-400">(현재 기준: {currentYear}년 {currentSemester}학기)</span>
        </p>
      ) : (
        <Table headers={["과목코드", "과목명", "학점", "성적", "평점"]}>
          {currentGrades.map((grade) => (
            <tr key={grade.gradeId}>
              <td className="px-6 py-4 text-sm text-slate-500 w-24 text-center whitespace-nowrap">{grade.courseCode}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-800">{grade.courseName}</td>
              <td className="px-6 py-4 text-sm text-center w-24 whitespace-nowrap">{grade.credit}</td>
              
              <td className="px-6 py-4 text-sm font-bold text-center w-24 whitespace-nowrap">
                {grade.gradeLetter ? (
                  <span className="text-brand-blue">{grade.gradeLetter}</span>
                ) : (
                  <span className="text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded-full">수강중</span>
                )}
              </td>
              
              <td className="px-6 py-4 text-sm text-center w-24 whitespace-nowrap">
                {grade.gradePoint !== null ? grade.gradePoint : "-"}
              </td>
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
    const studentId = user?.memberNo;

    const token = localStorage.getItem('token'); 

    if (studentId && token) {
      fetch(`http://localhost:8080/api/grades?studentId=${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error("성적 조회 실패");
          return res.json();
        })
        .then((data) => {
          const mappedData = data.map((item: any) => ({
            ...item,
            year: item.academicYear || item.year 
          }));
          setGrades(mappedData);
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

export const StudentAllGrades: React.FC<{ user: User }> = ({ user }) => <StudentGradeCenter user={user} />;
