import React, { useState, useEffect } from "react";
import type { User, Course } from "../types";
import { Card, Table, Button, Modal, Input } from "./ui";
import { MOCK_COURSES, MOCK_STUDENT_RECORDS, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from "../constants";
import { useNavigate } from "react-router-dom";

// --- Helper Components & Interfaces ---

interface ProfessorHomeProps {
  user: User;
}

// feature/main-ui의 최신 타입 필드명(courseTime 등) 적용
const ProfessorVisualTimetable: React.FC<{ courses: Course[] }> = ({ courses }) => {
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

// --- Main Components ---

export const ProfessorHome: React.FC<ProfessorHomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const myCourses = MOCK_COURSES.filter((c) => c.professorName === user.name);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Row 1 */}
        <div className="lg:col-span-2">
          <Card
            title="이번 학기 강의"
            className="h-full"
            titleAction={
              <Button size="sm" onClick={() => navigate("/professor/my-lectures")}>
                강의 관리 이동 &rarr;
              </Button>
            }
          >
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div
                  key={course.courseCode}
                  className="p-4 bg-slate-50 rounded-lg flex justify-between items-center transition-shadow hover:shadow-md cursor-pointer"
                  onClick={() => navigate("/professor/my-lectures")}
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {course.subjectName} <span className="text-sm font-normal text-slate-500">({course.courseCode})</span>
                    </p>
                    <p className="text-sm text-slate-500">
                      {course.courseTime} / {course.classroom}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-blue">{course.currentStudents}명</p>
                    <p className="text-xs text-slate-400">수강중</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="flex flex-col h-full">
              <div className="text-center mb-6">
                <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-full mx-auto border-4 border-white shadow-md object-cover" />
                <div className="mt-4">
                  <div className="font-bold text-xl text-slate-800">{user.name}</div>
                  <div className="text-sm text-slate-500">Professor</div>
                </div>
              </div>
              <div className="space-y-4 flex-grow">
                <div className="flex justify-between border-b border-brand-gray-light pb-2">
                  <span className="text-slate-500 text-sm font-medium">소속</span>
                  <span className="text-slate-700 text-sm">{user.departmentName ?? ""}</span>
                </div>
                <div className="flex justify-between border-b border-brand-gray-light pb-2">
                  <span className="text-slate-500 text-sm font-medium">사번</span>
                  <span className="text-slate-700 text-sm">{user.memberNo}</span>
                </div>
                <div className="flex justify-between border-b border-brand-gray-light pb-2">
                  <span className="text-slate-500 text-sm font-medium">이메일</span>
                  <span className="text-slate-700 text-sm truncate max-w-[150px]" title={user.email}>
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => navigate("/profile")} className="w-full" variant="secondary">
                  내 정보 수정
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-2">
          <Card
            title="공지사항"
            className="h-full"
            titleAction={
              <button onClick={() => navigate("/announcements")} className="text-sm font-medium text-brand-blue hover:underline">
                더보기 &rarr;
              </button>
            }
          >
            <ul className="divide-y divide-brand-gray -mx-6 -my-6">
              {MOCK_ANNOUNCEMENTS.slice(0, 3).map((ann) => (
                <li key={ann.postId} className="py-4 px-6 hover:bg-slate-50 cursor-pointer" onClick={() => navigate("/announcements")}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-semibold text-slate-800 truncate">{ann.title}</h3>
                    <span className="text-sm text-slate-500 flex-shrink-0 ml-4">{ann.createdAt.substring(0, 10)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card
            title="학사 일정"
            className="h-full"
            titleAction={
              <button onClick={() => navigate("/calendar")} className="text-sm font-medium text-brand-blue hover:underline">
                전체 보기 &rarr;
              </button>
            }
          >
            <div className="flex flex-col h-full">
              <ul className="space-y-4 flex-grow">
                {MOCK_CALENDAR_EVENTS.slice(0, 4).map((event) => (
                  <li key={event.scheduleId} className="flex flex-col pb-3 border-b border-brand-gray-light last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          event.category === "academic" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.category === "academic" ? "학사" : "휴일"}
                      </span>
                      <span className="text-xs text-slate-400">{event.startDate}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 mt-1">{event.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const ProfessorMyLectures: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const initialCourses = MOCK_COURSES.filter((c) => c.professorName === user.name);
  const [localCourses, setLocalCourses] = useState<Course[]>(initialCourses);
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    subjectName: "",
    courseCode: "",
    courseTime: "",
    classroom: "",
    subjectCode: "CS101" // Default
  });

  const hasChanges = markedForDeletion.size > 0;

  const getCourseType = (subjectCode: string) => {
    if (subjectCode.startsWith("CS")) return { label: "전공필수", color: "bg-red-100 text-red-800" };
    if (subjectCode.startsWith("MA")) return { label: "전공선택", color: "bg-blue-100 text-blue-800" };
    return { label: "교양", color: "bg-gray-100 text-gray-800" };
  };

  const handleToggleDelete = (courseId: string) => {
    const newMarked = new Set(markedForDeletion);
    if (newMarked.has(courseId)) {
      newMarked.delete(courseId);
    } else {
      newMarked.add(courseId);
    }
    setMarkedForDeletion(newMarked);
  };

  const handleSave = () => {
    setLocalCourses((prev) => prev.filter((c) => !markedForDeletion.has(c.courseCode)));
    setMarkedForDeletion(new Set());
    alert("변경사항이 저장되었습니다.");
  };

  const handleRegisterCourse = (e: React.FormEvent) => {
      e.preventDefault();
      const courseToAdd: Course = {
          ...newCourse,
          academicYear: 2024,
          semester: 1,
          professorNo: user.memberNo,
          courseClass: "01",
          professorName: user.name,
          // department: user.departmentName || "Computer Science", // Course 타입에 department 없음
          credit: 3, 
          currentStudents: 0,
          maxStudents: 40,
          status: "OPEN",
          objectives: "",
          content: "",
          textbookInfo: "",
          evaluationMethod: ""
      };
      setLocalCourses([...localCourses, courseToAdd]);
      setIsRegisterModalOpen(false);
      setNewCourse({ subjectName: "", courseCode: "", courseTime: "", classroom: "", subjectCode: "CS101" });
  };

  const activeCourses = localCourses.filter((c) => !markedForDeletion.has(c.courseCode));

  return (
    <div className="space-y-8">
      <Card title="강의 관리 대시보드" className="!p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-3 p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">주간 시간표</h3>
              <Button variant="secondary" size="sm" onClick={() => navigate("/professor/timetable")}>
                크게 보기
              </Button>
            </div>
            <ProfessorVisualTimetable courses={activeCourses} />
          </div>
          <div className="lg:col-span-2 p-6 bg-brand-gray-light border-l border-brand-gray flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">강의 목록 (2024년 1학기)</h3>
              <Button size="sm" onClick={() => setIsRegisterModalOpen(true)}>
                + 강의 등록
              </Button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 flex-grow" style={{ maxHeight: "600px" }}>
              {localCourses.length > 0 ? (
                localCourses.map((course) => {
                  const typeInfo = getCourseType(course.subjectCode);
                  const isMarked = markedForDeletion.has(course.courseCode);

                  return (
                    <div
                      key={course.courseCode}
                      className={`p-4 bg-white rounded-lg border relative group transition-all duration-200 ${
                        isMarked ? "border-red-300 bg-red-50" : "border-brand-gray hover:shadow-lg hover:border-brand-blue"
                      }`}
                    >
                      <div className={`transition-opacity ${isMarked ? "opacity-50" : "opacity-100"}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeInfo.color}`}>{typeInfo.label}</span>
                        </div>
                        <h4 className={`font-bold ${isMarked ? "text-slate-500 line-through" : "text-brand-blue"}`}>{course.subjectName}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {course.courseCode} | <span className="font-semibold">{course.currentStudents}</span>명
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{course.courseTime}</p>
                      </div>

                      {!isMarked && (
                        <div className="mt-4 border-t pt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="secondary" onClick={() => navigate("/professor/student-management")}>
                            학생 관리
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => navigate("/professor/syllabus")}>
                            계획서 관리
                          </Button>
                        </div>
                      )}

                      <button
                        onClick={() => handleToggleDelete(course.courseCode)}
                        className={`absolute bottom-4 right-4 transition-colors p-1 ${
                          isMarked ? "text-brand-blue hover:text-brand-blue-dark" : "text-slate-400 hover:text-red-500"
                        }`}
                        title={isMarked ? "삭제 취소" : "강의 목록에서 제거 (저장 필요)"}
                      >
                         {isMarked ? <span className="text-xs font-bold">복구</span> : <span className="text-xs font-bold">삭제</span>}
                      </button>

                      {isMarked && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">삭제 예정</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">등록된 강의가 없습니다.</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-300 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`text-sm transition-all ${
                  hasChanges 
                    ? "text-brand-blue font-bold hover:underline cursor-pointer" 
                    : "text-slate-400 font-normal cursor-not-allowed"
                }`}
              >
                {hasChanges ? `${markedForDeletion.size}개 변경사항 저장` : "변경사항 저장"}
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="새 강의 등록">
          <form onSubmit={handleRegisterCourse} className="space-y-4">
              <Input 
                label="과목명" 
                value={newCourse.subjectName} 
                onChange={e => setNewCourse({...newCourse, subjectName: e.target.value})} 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="과목코드" 
                    value={newCourse.courseCode} 
                    onChange={e => setNewCourse({...newCourse, courseCode: e.target.value})} 
                    required 
                    placeholder="예: CS101"
                />
                <Input 
                    label="강의실" 
                    value={newCourse.classroom} 
                    onChange={e => setNewCourse({...newCourse, classroom: e.target.value})} 
                    required 
                />
              </div>
              <Input 
                label="강의 시간" 
                value={newCourse.courseTime} 
                onChange={e => setNewCourse({...newCourse, courseTime: e.target.value})} 
                required 
                placeholder="예: 월 10:00-12:00, 수 10:00-11:00"
              />
              
              <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="secondary" onClick={() => setIsRegisterModalOpen(false)} type="button">취소</Button>
                  <Button type="submit">등록</Button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

// --- Student Management Logic (Imported from feature/professor, adapted for main-ui types) ---
// DTO와 맞는 타입 정의
interface StudentGrade {
    enrollmentId: number;
    studentNo: string;
    studentName: string;
    deptName: string;
    midtermScore: number;
    finalScore: number;
    assignmentScore: number;
    attendanceScore: number;
    totalScore: number;
    gradeLetter: string;
}

const AttendanceAndGradesView: React.FC<{ selectedCourse: Course, mode: 'attendance' | 'grades', setMode: any }> = ({ selectedCourse }) => {
    const [students, setStudents] = useState<StudentGrade[]>([]);

    useEffect(() => {
        if (selectedCourse) {
            fetch(`http://localhost:8080/api/professor/grades?courseCode=${selectedCourse.courseCode}`)
                .then(res => res.json())
                .then(data => setStudents(data))
                .catch(err => console.error("성적 로딩 실패:", err));
        }
    }, [selectedCourse]);
    
    const handleInputChange = (index: number, field: string, value: string) => {
        const newStudents = [...students];
        // @ts-ignore
        newStudents[index][field] = Number(value); 
        setStudents(newStudents);
    };

    const handleSave = async () => {
        try {
            for (const student of students) {
                await fetch("http://localhost:8080/api/professor/grades", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        enrollmentId: student.enrollmentId,
                        midtermScore: student.midtermScore,
                        finalScore: student.finalScore,
                        assignmentScore: student.assignmentScore,
                        attendanceScore: student.attendanceScore
                    })
                });
            }
            alert("성적이 성공적으로 저장되었습니다!");
            const res = await fetch(`http://localhost:8080/api/professor/grades?courseCode=${selectedCourse.courseCode}`);
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <div className="overflow-x-auto border border-brand-gray rounded-lg">
                <table className="min-w-full divide-y divide-brand-gray">
                    <thead className="bg-brand-gray-light">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold">학번</th>
                            <th className="px-4 py-3 text-left text-xs font-bold">이름</th>
                            <th className="px-2 py-3 text-center text-xs font-bold">중간</th>
                            <th className="px-2 py-3 text-center text-xs font-bold">기말</th>
                            <th className="px-2 py-3 text-center text-xs font-bold">과제</th>
                            <th className="px-2 py-3 text-center text-xs font-bold">출석</th>
                            <th className="px-4 py-3 text-center text-xs font-bold bg-blue-50">총점/등급</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-brand-gray">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-slate-500">
                                    수강 신청한 학생이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            students.map((s, idx) => (
                                <tr key={s.enrollmentId} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-500">{s.studentNo}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{s.studentName}</td>
                                    
                                    {/* 입력 칸들 */}
                                    <td className="px-2 py-3 text-center"><input type="number" className="w-16 text-center border rounded p-1" value={s.midtermScore || 0} onChange={e => handleInputChange(idx, 'midtermScore', e.target.value)} /></td>
                                    <td className="px-2 py-3 text-center"><input type="number" className="w-16 text-center border rounded p-1" value={s.finalScore || 0} onChange={e => handleInputChange(idx, 'finalScore', e.target.value)} /></td>
                                    <td className="px-2 py-3 text-center"><input type="number" className="w-16 text-center border rounded p-1" value={s.assignmentScore || 0} onChange={e => handleInputChange(idx, 'assignmentScore', e.target.value)} /></td>
                                    <td className="px-2 py-3 text-center"><input type="number" className="w-16 text-center border rounded p-1" value={s.attendanceScore || 0} onChange={e => handleInputChange(idx, 'attendanceScore', e.target.value)} /></td>
                                    
                                    {/* 총점/등급 */}
                                    <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50">
                                        {s.totalScore ? `${s.totalScore} (${s.gradeLetter})` : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 flex justify-end border-t border-brand-gray bg-slate-50">
                <Button onClick={handleSave}>성적 저장</Button>
            </div>
        </div>
    );
};

export const ProfessorStudentManagement: React.FC<{ user: User; viewType?: "attendance" | "grades" }> = ({ user, viewType }) => {
  
  // -------------------------------------------------------------------------
  // 1. [원상복구] 수강생 출결 관리 (원래 코드 방식 - Placeholder)
  // -------------------------------------------------------------------------
  // 동료분이 작업하실 영역이므로, 원래 있던 디자인(안내 문구)만 남겨둡니다.
  if (viewType === 'attendance') {
    return (
      <Card title="수강생 출결 관리">
        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300 py-16">
            <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-700 mb-2">출결 관리 기능 준비 중</h3>
            <p className="text-slate-500">
                이 기능은 추후 업데이트될 예정입니다.<br/>
                (현재 성적 관리 기능만 이용 가능합니다)
            </p>
        </div>
      </Card>
    );
  }

  // -------------------------------------------------------------------------
  // 2. [사용자님 작업] 성적 관리 (DB 연동 버전)
  // -------------------------------------------------------------------------
  // 강의 목록 상태
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // 모드 설정 (성적 관리로 고정)
  const [managementMode, setManagementMode] = useState<'attendance'|'grades'>('grades');

  // 화면이 켜지면 백엔드에서 강의 목록 가져오기
  useEffect(() => {
    if (user.id) {
      fetch(`http://localhost:8080/api/professor/courses?professorId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          const courses = data.map((d: any) => ({
            courseCode: d.courseCode,
            subjectName: d.subjectName,
            courseClass: d.courseClass,
            professorName: user.name,
            credit: 3,
            currentStudents: d.currentStudents || 0,
            courseTime: d.courseTime || "",
            classroom: d.classroom || "",
          }));
          
          setMyCourses(courses);
          
          if (courses.length > 0) {
            setSelectedCourse(courses[0]);
          }
        })
        .catch((err) => console.error("강의 목록 불러오기 실패:", err));
    }
  }, [user.id]);

  return (
    <Card title="학생 성적 관리">
      {/* 강의 선택 드롭다운 */}
      <div className="mb-6 pb-4 border-b border-slate-200 flex items-center space-x-4">
        <label className="font-semibold text-slate-700 shrink-0">강의 선택:</label>
        <select
          value={selectedCourse?.courseCode || ""}
          onChange={(e) => setSelectedCourse(myCourses.find((c) => c.courseCode === e.target.value) || null)}
          className="block w-full max-w-sm px-3 py-2 border border-slate-300 rounded-md"
        >
          {myCourses.length === 0 && <option>담당 강의가 없습니다.</option>}
          {myCourses.map((course) => (
            <option key={course.courseCode} value={course.courseCode}>
              {course.subjectName} ({course.courseCode})
            </option>
          ))}
        </select>
      </div>

      {/* 선택된 강의가 있을 때만 표 표시 */}
      {selectedCourse ? (
        <div className="pt-2">
            <AttendanceAndGradesView 
                selectedCourse={selectedCourse} 
                mode={managementMode} 
                setMode={setManagementMode} 
            />
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
            {myCourses.length === 0 ? "담당하는 강의가 없습니다." : "강의를 선택해주세요."}
        </div>
      )}
    </Card>
  );
};

// --- Other Views (Merged Logic) ---

export const ProfessorSyllabus: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [syllabus, setSyllabus] = useState({ 
        overview: '이 강의는 React와 TypeScript를 활용한 웹 개발 기초를 다룹니다.', 
        objectives: '최신 웹 기술 습득', 
        textbook: '모던 리액트 Deep Dive', 
        evaluation: '중간 30%, 기말 30%, 과제 20%, 출석 20%',
        credits: '3',
        classTime: '월 10:00-12:00, 수 10:00-11:00'
    });

    return (
        <Card title="강의계획서 관리" titleAction={<Button size="sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? '저장' : '수정'}</Button>}>
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">취득 학점</label>
                        <input type="text" className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue" disabled={!isEditing} value={syllabus.credits} onChange={e => setSyllabus({...syllabus, credits: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">강의 요일/시간</label>
                        <input type="text" className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue" disabled={!isEditing} value={syllabus.classTime} onChange={e => setSyllabus({...syllabus, classTime: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">강의 개요</label>
                    <textarea className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue" rows={3} disabled={!isEditing} value={syllabus.overview} onChange={e => setSyllabus({...syllabus, overview: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">강의 목표</label>
                    <textarea className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue" rows={2} disabled={!isEditing} value={syllabus.objectives} onChange={e => setSyllabus({...syllabus, objectives: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">교재</label>
                        <input type="text" className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue" disabled={!isEditing} value={syllabus.textbook} onChange={e => setSyllabus({...syllabus, textbook: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">평가 방법</label>
                        <input type="text" className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue" disabled={!isEditing} value={syllabus.evaluation} onChange={e => setSyllabus({...syllabus, evaluation: e.target.value})} />
                    </div>
                </div>
             </div>
        </Card>
    );
};

export const ProfessorCourseMaterials: React.FC = () => {
    const [materials, setMaterials] = useState([
        { id: 1, title: '1주차 강의자료.pdf', date: '2024-03-04', size: '2.4MB' },
        { id: 2, title: '2주차 강의자료.pdf', date: '2024-03-11', size: '3.1MB' }
    ]);

    const handleUpload = () => {
        const title = prompt('자료 제목을 입력하세요:');
        if (title) {
            setMaterials([...materials, { id: Date.now(), title: `${title}.pdf`, date: new Date().toISOString().split('T')[0], size: '1.5MB' }]);
        }
    };

    return (
        <Card title="강의 자료 관리" titleAction={<Button size="sm" onClick={handleUpload}>+ 자료 업로드</Button>}>
            {materials.length > 0 ? (
                <Table headers={['제목', '등록일', '크기', '관리']}>
                    {materials.map(m => (
                        <tr key={m.id}>
                            <td className="px-6 py-4 text-sm font-medium text-slate-800">{m.title}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{m.date}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{m.size}</td>
                            <td className="px-6 py-4 text-sm">
                                <button className="text-red-600 hover:text-red-800" onClick={() => setMaterials(materials.filter(item => item.id !== m.id))}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </Table>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                    <p className="text-slate-500 mb-4">등록된 강의 자료가 없습니다.</p>
                </div>
            )}
        </Card>
    );
};

export const ProfessorAssignments: React.FC = () => {
    const [assignments, setAssignments] = useState([
        { id: 1, title: '중간고사 대체 과제', deadline: '2024-04-20', submitted: 25, total: 30 }
    ]);

    const handleCreate = () => {
        const title = prompt('과제 제목을 입력하세요:');
        if (title) {
            setAssignments([...assignments, { id: Date.now(), title, deadline: '2024-05-01', submitted: 0, total: 30 }]);
        }
    };

    return (
        <Card title="과제 관리" titleAction={<Button size="sm" onClick={handleCreate}>+ 과제 등록</Button>}>
            {assignments.length > 0 ? (
                <Table headers={['과제명', '마감일', '제출 현황', '관리']}>
                    {assignments.map(a => (
                        <tr key={a.id}>
                            <td className="px-6 py-4 text-sm font-medium text-slate-800">{a.title}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{a.deadline}</td>
                            <td className="px-6 py-4 text-sm text-brand-blue font-bold">{a.submitted} / {a.total}</td>
                            <td className="px-6 py-4 text-sm">
                                <button className="text-brand-blue hover:underline mr-3">채점하기</button>
                                <button className="text-red-600 hover:text-red-800" onClick={() => setAssignments(assignments.filter(item => item.id !== a.id))}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </Table>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                    <p className="text-slate-500 mb-4">진행 중인 과제가 없습니다.</p>
                </div>
            )}
        </Card>
    );
};

export const ProfessorLectureTimetable: React.FC<{ user: User }> = ({ user }) => {
  const myCourses = MOCK_COURSES.filter((c) => c.professorName === user.name);
  return (
    <Card title="전체 강의 시간표 (2024년 1학기)">
      <div className="pt-8 px-4">
        <ProfessorVisualTimetable courses={myCourses} />
      </div>
    </Card>
  );
};
