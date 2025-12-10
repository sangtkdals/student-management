import React, { useState, useEffect } from "react";
import type { User, Course } from "../../types";
import { Card, Table, Button } from "../ui";

interface StudentGrade {
  gradeId: number;
  studentId: string;
  studentName: string;
  department: string;
  email: string;
  midtermScore: number;
  finalScore: number;
  assignmentScore: number;
  attendanceScore: number;
  totalScore: number;
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  enrollmentId: number;
  attendanceId: number | null;
  status: string;
  remark: string;
}

const AttendanceAndGradesView: React.FC<{ selectedCourse: Course; mode: "attendance" | "grades"; setMode: (m: "attendance" | "grades") => void }> = ({
  selectedCourse,
  mode,
  setMode,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const totalWeeks = 15;

  const [gradeStudents, setGradeStudents] = useState<StudentGrade[]>([]);

  const getGradeLetter = (score: number) => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A0";
    if (score >= 85) return "B+";
    if (score >= 80) return "B0";
    if (score >= 75) return "C+";
    if (score >= 70) return "C0";
    if (score >= 65) return "D+";
    if (score >= 60) return "D0";
    return "F";
  };

  useEffect(() => {
    if (!selectedCourse) return;
    const token = localStorage.getItem("token");

    if (mode === "attendance") {
      const fetchAttendance = async () => {
        try {
          const response = await fetch(`/api/attendance?courseCode=${selectedCourse.courseCode}&week=${selectedWeek}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            setAttendanceList(await response.json());
          }
        } catch (error) {
          console.error("Failed to fetch attendance", error);
        }
      };
      fetchAttendance();
    }
    
    else if (mode === "grades") {
      const fetchGrades = async () => {
        try {
          const response = await fetch(`/api/professor-new/courses/${selectedCourse.courseCode}/students`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();

            const mappedData = data.map((d: any) => ({
                ...d,

                studentName: d.name || d.studentName, 
                totalScore: (d.midtermScore || 0) * 0.3 + (d.finalScore || 0) * 0.4 + (d.assignmentScore || 0) * 0.2 + (d.attendanceScore || 0) * 0.1
            }));
            setGradeStudents(mappedData);
          } else {
            console.error("학생 목록 불러오기 실패");
          }
        } catch (error) {
          console.error("Failed to fetch grades", error);
        }
      };
      fetchGrades();
    }
  }, [selectedCourse, selectedWeek, mode]);


  const handleAttendanceChange = (enrollmentId: number, field: "status" | "remark", val: string) => {
    setAttendanceList((prev) => prev.map((item) => (item.enrollmentId === enrollmentId ? { ...item, [field]: val } : item)));
  };

  const handleSaveAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/attendance?week=${selectedWeek}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(attendanceList),
      });
      if (response.ok) alert("출결이 저장되었습니다.");
      else alert("저장 실패");
    } catch (error) {
      console.error("Save error", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleGradeChange = (studentId: string, field: keyof StudentGrade, val: number) => {
    setGradeStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          const updated = { ...s, [field]: val };
          updated.totalScore = 
            (updated.midtermScore || 0) * 0.3 + 
            (updated.finalScore || 0) * 0.4 + 
            (updated.assignmentScore || 0) * 0.2 + 
            (updated.attendanceScore || 0) * 0.1;
          return updated;
        }
        return s;
      })
    );
  };

  const handleSaveGrades = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/professor/grades", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gradeStudents),
      });

      if (response.ok) alert("성적이 저장되었습니다.");
      else alert("저장 실패");
    } catch (e) {
      console.error(e);
      alert("에러 발생");
    }
  };

  return (
    <div>
      {mode === "attendance" ? (
        <>
          <div className="mb-4 flex items-center space-x-3">
            <span className="font-bold text-slate-700">주차 선택:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
            >
              {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
                <option key={week} value={week}>
                  {week}주차
                </option>
              ))}
            </select>
          </div>
          <Table headers={["학번", "이름", "출결 상태", "비고"]}>
            {attendanceList.length > 0 ? (
              attendanceList.map((student) => (
                <tr key={student.enrollmentId}>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.studentId}</td>
                  <td className="px-6 py-4 text-sm font-medium">{student.studentName}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={student.status || ""}
                      onChange={(e) => handleAttendanceChange(student.enrollmentId, "status", e.target.value)}
                      className="px-2 py-1 rounded text-xs font-bold border border-slate-300"
                    >
                      <option value="">선택</option>
                      <option value="PRESENT">출석</option>
                      <option value="LATE">지각</option>
                      <option value="ABSENT">결석</option>
                      <option value="EXCUSED">공결</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="text"
                      value={student.remark || ""}
                      onChange={(e) => handleAttendanceChange(student.enrollmentId, "remark", e.target.value)}
                      className="w-full border border-slate-300 rounded-md text-sm px-2 py-1"
                      placeholder="비고 입력"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr key="no-attendance">
                <td colSpan={4} className="text-center py-4 text-slate-500">
                  수강생이 없습니다.
                </td>
              </tr>
            )}
          </Table>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveAttendance}>출결 저장</Button>
          </div>
        </>
      ) : (
        <>
          <div className="overflow-x-auto border border-brand-gray rounded-lg">
            <table className="min-w-full divide-y divide-brand-gray">
              <thead className="bg-brand-gray-light">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold">학번</th>
                  <th className="px-4 py-3 text-left text-xs font-bold">이름</th>
                  <th className="px-2 py-3 text-center text-xs font-bold">중간(30)</th>
                  <th className="px-2 py-3 text-center text-xs font-bold">기말(40)</th>
                  <th className="px-2 py-3 text-center text-xs font-bold">과제(20)</th>
                  <th className="px-2 py-3 text-center text-xs font-bold">출석(10)</th>
                  <th className="px-4 py-3 text-center text-xs font-bold bg-blue-50">총점</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray">
                {gradeStudents.length === 0 ? (
                   <tr key="no-grade-students"><td colSpan={7} className="text-center py-8 text-slate-500">수강생이 없습니다.</td></tr>
                ) : (
                  gradeStudents.map((s) => (
                    <tr key={s.studentId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-500">{s.studentId}</td>
                      <td className="px-4 py-3 text-sm font-medium">{s.studentName}</td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number" min="0" max="100"
                          className="w-14 text-center border rounded text-sm"
                          value={s.midtermScore || 0}
                          onChange={(e) => handleGradeChange(s.studentId, "midtermScore", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number" min="0" max="100"
                          className="w-14 text-center border rounded text-sm"
                          value={s.finalScore || 0}
                          onChange={(e) => handleGradeChange(s.studentId, "finalScore", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number" min="0" max="100"
                          className="w-14 text-center border rounded text-sm"
                          value={s.assignmentScore || 0}
                          onChange={(e) => handleGradeChange(s.studentId, "assignmentScore", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number" min="0" max="100"
                          className="w-14 text-center border rounded text-sm"
                          value={s.attendanceScore || 0}
                          onChange={(e) => handleGradeChange(s.studentId, "attendanceScore", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50">
                        <div className="flex flex-col items-center justify-center">
                            {/* 1. 총점 표시 */}
                            <span>{s.totalScore ? s.totalScore.toFixed(1) : "0.0"}</span>
                            
                            {/* 2. 등급 표시 (총점이 있을 때만 계산해서 보여줌) */}
                            {s.totalScore > 0 && (
                              <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                                getGradeLetter(s.totalScore) === 'F' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {getGradeLetter(s.totalScore)}
                              </span>
                            )}
                          </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex justify-end border-t border-brand-gray bg-slate-50">
            <Button onClick={handleSaveGrades}>성적 저장</Button>
          </div>
        </>
      )}
    </div>
  );
};

export const ProfessorStudentManagement: React.FC<{ user: User; viewType?: "attendance" | "grades" }> = ({ user, viewType }) => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<"management" | "list">("management");
  const [managementMode, setManagementMode] = useState<"attendance" | "grades">(viewType || "attendance");
  const [studentList, setStudentList] = useState<any[]>([]); // 수강생 명단용 상태

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.memberNo) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/professor-new/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();

          console.log("[디버깅] 서버에서 온 강의 데이터:", data); 

          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.subjectName || c.subject?.sname || c.courseName || c.courseCode,
          }));
          setMyCourses(mappedCourses);
          if (mappedCourses.length > 0) setSelectedCourse(mappedCourses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, [user.memberNo]);

  useEffect(() => {
    if (activeTab === "list" && selectedCourse) {
       const token = localStorage.getItem("token");
       fetch(`/api/professor-new/courses/${selectedCourse.courseCode}/students`, {
            headers: { Authorization: `Bearer ${token}` },
       })
       .then(res => res.json())
       .then(data => setStudentList(data))
       .catch(err => console.error(err));
    }
  }, [activeTab, selectedCourse]);

  useEffect(() => {
    if (viewType) setManagementMode(viewType);
  }, [viewType]);

  const SelectedCourseStudentList = () => {
    if (!selectedCourse) return null;
    return (
      <>
        <p className="text-slate-600 mb-4">{selectedCourse.subjectName} 수강생 목록입니다.</p>
        <Table headers={["학번", "이름", "소속", "이메일"]}>
          {studentList.length > 0 ? (
              studentList.map((s) => (
                <tr key={s.studentId}>
                  <td className="px-6 py-4 text-sm">{s.studentId}</td>
                  <td className="px-6 py-4 text-sm font-medium">{s.name || s.studentName}</td>
                  <td className="px-6 py-4 text-sm">{s.department?.deptName || "컴퓨터공학과"}</td>
                  <td className="px-6 py-4 text-sm">{s.email || "-"}</td>
                </tr>
              ))
          ) : (
             <tr key="no-students"><td colSpan={4} className="text-center py-4">수강생이 없습니다.</td></tr>
          )}
        </Table>
      </>
    );
  };

  return (
    <Card title="학생 관리 대시보드">
      <div className="mb-6 pb-4 border-b border-slate-200 flex items-center space-x-4">
        <label htmlFor="course-select" className="font-semibold text-slate-700 shrink-0">
          강의 선택:
        </label>
        <select
          id="course-select"
          value={selectedCourse?.courseCode || ""}
          onChange={(e) => setSelectedCourse(myCourses.find((c) => c.courseCode === e.target.value) || null)}
          className="block w-full max-w-sm px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
        >
          {myCourses.map((course) => (
            <option key={course.courseCode} value={course.courseCode}>
              {course.subjectName}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse ? (
        <div>
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("management")}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors ${
                  activeTab === "management"
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {managementMode === "attendance" ? "출결 관리" : "성적 관리"}
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors ${
                  activeTab === "list"
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                수강생 명단
              </button>
            </nav>
          </div>
          <div className="pt-6">
            {activeTab === "management" && (
              <AttendanceAndGradesView selectedCourse={selectedCourse} mode={managementMode} setMode={setManagementMode} />
            )}
            {activeTab === "list" && <SelectedCourseStudentList />}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">관리할 강의가 없습니다.</p>
        </div>
      )}
    </Card>
  );
};
