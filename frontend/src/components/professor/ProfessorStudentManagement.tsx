import React, { useState, useEffect } from "react";
import type { User, Course } from "../../types";
import { Card, Table, Button } from "../ui";
import { MOCK_STUDENT_RECORDS } from "../../constants";

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
  // Attendance Logic
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const totalWeeks = 15;

  // Mock Logic for Grades (unchanged for now)
  const [studentGrades, setStudentGrades] = useState<{ [studentId: string]: { mid: number; final: number; assign: number; attend: number } }>({});

  useEffect(() => {
    const fetchAttendance = async () => {
      if (mode === "attendance" && selectedCourse) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:8080/api/attendance?courseCode=${selectedCourse.courseCode}&week=${selectedWeek}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setAttendanceList(data);
          }
        } catch (error) {
          console.error("Failed to fetch attendance", error);
        }
      }
    };
    fetchAttendance();
  }, [selectedCourse, selectedWeek, mode]);

  useEffect(() => {
    // Initialize Grades Data (Mock)
    const initialGrades: any = {};
    MOCK_STUDENT_RECORDS.forEach((s) => {
      initialGrades[s.id] = { mid: 0, final: 0, assign: 0, attend: 0 };
    });
    setStudentGrades(initialGrades);
  }, []);

  const handleAttendanceChange = (enrollmentId: number, field: "status" | "remark", val: string) => {
    setAttendanceList((prev) => prev.map((item) => (item.enrollmentId === enrollmentId ? { ...item, [field]: val } : item)));
  };

  const handleSaveAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/attendance?week=${selectedWeek}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(attendanceList),
      });
      if (response.ok) {
        alert("출결이 저장되었습니다.");
      } else {
        alert("저장 실패");
      }
    } catch (error) {
      console.error("Save error", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleGradeChange = (sid: string, field: string, val: number) => {
    setStudentGrades((prev) => ({ ...prev, [sid]: { ...prev[sid], [field]: val } }));
  };

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <Button size="sm" variant={mode === "attendance" ? "primary" : "secondary"} onClick={() => setMode("attendance")}>
          출석 관리
        </Button>
        <Button size="sm" variant={mode === "grades" ? "primary" : "secondary"} onClick={() => setMode("grades")}>
          성적 입력
        </Button>
      </div>

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
                      <option value="출석">출석</option>
                      <option value="지각">지각</option>
                      <option value="결석">결석</option>
                      <option value="공결">공결</option>
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
              <tr>
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
                  <th className="px-2 py-3 text-center text-xs font-bold">기말(30)</th>
                  <th className="px-2 py-3 text-center text-xs font-bold">과제(20)</th>
                  <th className="px-2 py-3 text-center text-xs font-bold">출석(20)</th>
                  <th className="px-4 py-3 text-center text-xs font-bold bg-blue-50">총점</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray">
                {MOCK_STUDENT_RECORDS.map((s) => {
                  const g = studentGrades[s.id] || { mid: 0, final: 0, assign: 0, attend: 0 };
                  const total = g.mid * 0.3 + g.final * 0.3 + g.assign * 0.2 + g.attend * 0.2;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-500">{s.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number"
                          className="w-14 text-center border rounded text-sm"
                          value={g.mid}
                          onChange={(e) => handleGradeChange(s.id, "mid", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number"
                          className="w-14 text-center border rounded text-sm"
                          value={g.final}
                          onChange={(e) => handleGradeChange(s.id, "final", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number"
                          className="w-14 text-center border rounded text-sm"
                          value={g.assign}
                          onChange={(e) => handleGradeChange(s.id, "assign", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number"
                          className="w-14 text-center border rounded text-sm"
                          value={g.attend}
                          onChange={(e) => handleGradeChange(s.id, "attend", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50">{total.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex justify-end border-t border-brand-gray bg-slate-50">
            <Button onClick={() => alert("성적이 저장되었습니다.")}>성적 저장</Button>
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

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.memberNo) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.courseName || c.subject?.sName || c.courseCode,
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
    if (viewType) setManagementMode(viewType);
  }, [viewType]);

  const SelectedCourseStudentList = () => {
    if (!selectedCourse) return null;
    return (
      <>
        <p className="text-slate-600 mb-4">{selectedCourse.subjectName} 수강생 목록입니다.</p>
        <Table headers={["학번", "이름", "소속", "이메일"]}>
          {MOCK_STUDENT_RECORDS.map((s) => (
            <tr key={s.id}>
              <td className="px-6 py-4 text-sm">{s.id}</td>
              <td className="px-6 py-4 text-sm font-medium">{s.name}</td>
              <td className="px-6 py-4 text-sm">{s.department}</td>
              <td className="px-6 py-4 text-sm">{s.id.toLowerCase()}@university.ac.kr</td>
            </tr>
          ))}
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
              {course.subjectName} ({course.courseCode})
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
                성적/출결 관리
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
