import React, { useState, useEffect } from "react";
import type { User, Course } from "../types";
import { Card, Table, Button, Modal, Input } from "./ui";
import { MOCK_COURSES, MOCK_STUDENT_RECORDS, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from "../constants";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        // API Endpoint: /api/courses/professor/{memberNo}
        const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
           headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
           const data = await response.json();
           const mappedCourses = data.map((c: any) => ({
             ...c,
             subjectName: c.courseName || c.subject?.sName || c.courseCode // Prioritize courseName
           }));
           setMyCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch professor courses", error);
      }
    };
    if (user.memberNo) {
      fetchCourses();
    }
  }, [user.memberNo]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
              {myCourses.length > 0 ? (
                myCourses.map((course) => (
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
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">강의가 없습니다.</p>
              )}
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
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseName: "소프트웨어공학",
    subjectName: "소프트웨어공학", // Keep for compatibility or remove if not needed
    courseCode: "CS303",
    courseTime: "월 10:00-12:00",
    classroom: "공학관 305호",
    subjectCode: "CS303",
    courseClass: "01",
    maxStudents: 50,
    credit: 3,
    academicYear: 2024,
    semester: 1
  });
  const [addedCourses, setAddedCourses] = useState<Set<string>>(new Set());
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  // Time Slot State
  const [timeSlots, setTimeSlots] = useState<{ day: string; start: string; end: string }[]>([
    { day: "월", start: "10:00", end: "12:00" }
  ]);
  const [currentSlot, setCurrentSlot] = useState({ day: "월", start: "09:00", end: "10:00" });

  const fetchCourses = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            // Map backend response to Course type if needed, or assuming it matches
            // Need to ensure subjectName is present (join in backend or provided)
            // The backend Course entity has 'subject' object. Frontend Course has 'subjectName'.
            const mappedCourses = data.map((c: any) => ({
                ...c,
                subjectName: c.courseName || c.subject?.sName || c.courseCode, // Prioritize courseName
                subjectCode: c.subject?.sCode
            }));
            setLocalCourses(mappedCourses);
        } else {
            console.error("Failed to fetch courses");
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
      fetchCourses();
  }, [user.memberNo]);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, currentSlot]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Sync timeSlots to newCourse.courseTime string
    // Format: "월 10:00-12:00, 수 10:00-11:00"
    const timeString = timeSlots
      .map((slot) => `${slot.day} ${slot.start}-${slot.end}`)
      .join(", ");
    setNewCourse((prev) => ({ ...prev, courseTime: timeString }));
  }, [timeSlots]);

  const hasChanges = markedForDeletion.size > 0; // Only delete is batched in this UI logic, or we can make delete immediate

  const getCourseType = (subjectCode: string) => {
    if (subjectCode && subjectCode.startsWith("CS")) return { label: "전공필수", color: "bg-red-100 text-red-800" };
    if (subjectCode && subjectCode.startsWith("MA")) return { label: "전공선택", color: "bg-blue-100 text-blue-800" };
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

  const handleSave = async () => {
    // Process deletions
    if (markedForDeletion.size > 0) {
        const token = localStorage.getItem("token");
        for (const courseCode of markedForDeletion) {
            try {
                await fetch(`http://localhost:8080/api/courses/${courseCode}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            } catch (e) {
                console.error("Failed to delete course", courseCode, e);
            }
        }
        setMarkedForDeletion(new Set());
        await fetchCourses(); // Refresh list
        alert("변경사항이 저장되었습니다.");
    }
  };

  const handleRegisterCourse = async (e: React.FormEvent) => {
      e.preventDefault();
      const courseToAdd = {
          ...newCourse,
          professorNo: user.memberNo,
      };

      try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:8080/api/courses", {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(courseToAdd)
          });

          if (response.ok) {
              setIsRegisterModalOpen(false);
              // Reset to dummy data for next entry (debugging convenience)
              setNewCourse({ 
                courseName: "데이터베이스",
                subjectName: "데이터베이스", 
                courseCode: "CS304", 
                courseTime: "수 13:00-15:00", 
                classroom: "정보관 202호", 
                subjectCode: "CS304",
                courseClass: "02",
                maxStudents: 45,
                credit: 3,
                academicYear: 2024,
                semester: 1
              });
              setTimeSlots([
                { day: "수", start: "13:00", end: "15:00" }
              ]);
              await fetchCourses(); // Refresh list
              alert("강의가 등록되었습니다.");
          } else {
              const msg = await response.text();
              alert("등록 실패: " + msg);
          }
      } catch (error) {
          console.error("Error registering course:", error);
          alert("오류가 발생했습니다.");
      }
  };

  const activeCourses = localCourses.filter((c) => !markedForDeletion.has(c.courseCode));

  return (
    <div className="space-y-8">
      <Card title="강의 관리 대시보드" className="!p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-3 p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">주간 시간표</h3>
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
                          <Button size="sm" variant="secondary" onClick={() => setSelectedCourseDetail(course)}>
                            자세히 보기
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => navigate("/professor/student-management")}>
                            학생 관리
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => navigate("/professor/syllabus", { state: { course } })}
                          >
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

      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        title="새 강의 등록"
        className="rounded-none border-2 border-slate-900 shadow-none"
      >
          <form onSubmit={handleRegisterCourse} className="space-y-4">
              <Input 
                label="강의명" 
                value={newCourse.courseName} 
                onChange={e => setNewCourse({...newCourse, courseName: e.target.value, subjectName: e.target.value})} 
                required 
                className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="강의 코드" 
                    value={newCourse.courseCode} 
                    onChange={e => setNewCourse({...newCourse, courseCode: e.target.value})} 
                    required 
                    className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
                />
                <Input 
                    label="과목 코드" 
                    value={newCourse.subjectCode} 
                    onChange={e => setNewCourse({...newCourse, subjectCode: e.target.value})} 
                    required 
                    className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input 
                    label="학년도" 
                    type="number"
                    value={String(newCourse.academicYear)} 
                    onChange={e => setNewCourse({...newCourse, academicYear: parseInt(e.target.value)})} 
                    required 
                    className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
                />
                <Input 
                    label="학기" 
                    type="number"
                    value={String(newCourse.semester)} 
                    onChange={e => setNewCourse({...newCourse, semester: parseInt(e.target.value)})} 
                    required 
                    className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
                />
                <Input 
                    label="분반" 
                    value={newCourse.courseClass} 
                    onChange={e => setNewCourse({...newCourse, courseClass: e.target.value})} 
                    required 
                    className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="수강정원" 
                    type="number"
                    value={String(newCourse.maxStudents)} 
                    onChange={e => setNewCourse({...newCourse, maxStudents: parseInt(e.target.value)})} 
                    required 
                    className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
                />
                <Input 
                    label="학점" 
                    type="number"
                    value={String(newCourse.credit)} 
                    onChange={e => setNewCourse({...newCourse, credit: parseInt(e.target.value)})} 
                    required 
                    className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <Input 
                  label="강의실" 
                  value={newCourse.classroom} 
                  onChange={e => setNewCourse({...newCourse, classroom: e.target.value})} 
                  required 
                  className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
              />
              
              {/* 강의 시간 선택 UI */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">강의 시간</label>
                <div className="flex space-x-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 block mb-1">요일</label>
                    <select 
                      className="w-full border border-slate-400 rounded-none p-2 text-sm focus:border-slate-900 focus:ring-slate-900"
                      value={currentSlot.day}
                      onChange={(e) => setCurrentSlot({ ...currentSlot, day: e.target.value })}
                    >
                      {["월", "화", "수", "목", "금"].map(d => <option key={d} value={d}>{d}요일</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 block mb-1">시작 시간</label>
                    <select 
                      className="w-full border border-slate-400 rounded-none p-2 text-sm focus:border-slate-900 focus:ring-slate-900"
                      value={currentSlot.start}
                      onChange={(e) => setCurrentSlot({ ...currentSlot, start: e.target.value })}
                    >
                      {Array.from({ length: 9 }, (_, i) => i + 9).map(h => (
                        <option key={h} value={`${h < 10 ? '0' + h : h}:00`}>{`${h < 10 ? '0' + h : h}:00`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 block mb-1">종료 시간</label>
                    <select 
                      className="w-full border border-slate-400 rounded-none p-2 text-sm focus:border-slate-900 focus:ring-slate-900"
                      value={currentSlot.end}
                      onChange={(e) => setCurrentSlot({ ...currentSlot, end: e.target.value })}
                    >
                      {Array.from({ length: 9 }, (_, i) => i + 10).map(h => (
                        <option key={h} value={`${h < 10 ? '0' + h : h}:00`}>{`${h < 10 ? '0' + h : h}:00`}</option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addTimeSlot} 
                    size="sm" 
                    variant="secondary"
                    className="rounded-none border border-slate-400 hover:border-slate-900 hover:bg-slate-100"
                  >
                    추가
                  </Button>
                </div>

                {/* 추가된 시간 슬롯 목록 */}
                {timeSlots.length > 0 && (
                  <div className="mt-2 bg-white p-2 border border-slate-300 rounded-none">
                    <ul className="space-y-1">
                      {timeSlots.map((slot, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span>
                            <span className="font-bold text-slate-900">{slot.day}요일</span> {slot.start} - {slot.end}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => removeTimeSlot(index)}
                            className="text-slate-500 hover:text-red-700 text-xs font-bold"
                          >
                            삭제
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* 실제 저장되는 문자열 값 (Hidden or Readonly for check) */}
                <input type="hidden" value={newCourse.courseTime} required />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsRegisterModalOpen(false)} 
                    type="button"
                    className="rounded-none border border-slate-300 hover:bg-slate-100"
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit"
                    className="rounded-none bg-slate-900 text-white hover:bg-slate-800 border border-slate-900"
                  >
                    등록
                  </Button>
              </div>
          </form>
      </Modal>

      {/* 강의 상세 정보 모달 */}
      <Modal isOpen={!!selectedCourseDetail} onClose={() => setSelectedCourseDetail(null)} title="강의 상세 정보">
        {selectedCourseDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 font-bold uppercase">과목명</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.subjectName}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-bold uppercase">학년도/학기</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.academicYear}년 {selectedCourseDetail.semester}학기</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-bold uppercase">분반</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.courseClass}분반</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-bold uppercase">강의 코드</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.courseCode}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-bold uppercase">과목 코드</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.subjectCode}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-bold uppercase">학점</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.credit}학점</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-bold uppercase">수강정원</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.maxStudents}명 (현재 {selectedCourseDetail.currentStudents}명)</p>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 font-bold uppercase">강의실</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.classroom}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 font-bold uppercase">강의 시간</label>
                <p className="text-sm font-medium text-slate-800">{selectedCourseDetail.courseTime}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 font-bold uppercase">상태</label>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${selectedCourseDetail.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedCourseDetail.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setSelectedCourseDetail(null)}>닫기</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- Student Management Logic (Imported from feature/professor, adapted for main-ui types) ---

interface WeeklyRecord { attendance: string; score: number; note: string; }

const AttendanceAndGradesView: React.FC<{ selectedCourse: Course, mode: 'attendance' | 'grades', setMode: (m: 'attendance' | 'grades') => void }> = ({ selectedCourse, mode, setMode }) => {
    // Mock Logic for Attendance
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [weeklyData, setWeeklyData] = useState<{ [studentId: string]: { [week: number]: WeeklyRecord } }>({});
    const totalWeeks = 15;

    // Mock Logic for Grades
    const [studentGrades, setStudentGrades] = useState<{ [studentId: string]: { mid: number, final: number, assign: number, attend: number } }>({});

    useEffect(() => {
        // Initialize Attendance Data
        const initialAttendance: { [studentId: string]: { [week: number]: WeeklyRecord } } = {};
        MOCK_STUDENT_RECORDS.forEach(student => {
            initialAttendance[student.id] = {};
            for (let i = 1; i <= totalWeeks; i++) {
                initialAttendance[student.id][i] = { attendance: Math.random() > 0.9 ? '결석' : '출석', score: 10, note: '' };
            }
        });
        setWeeklyData(initialAttendance);

        // Initialize Grades Data
        const initialGrades: any = {};
        MOCK_STUDENT_RECORDS.forEach(s => { initialGrades[s.id] = { mid: 0, final: 0, assign: 0, attend: 0 }; });
        setStudentGrades(initialGrades);
    }, []);

    // Handlers
    const handleAttendanceChange = (studentId: string, field: keyof WeeklyRecord, val: string | number) => {
        setWeeklyData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [selectedWeek]: { ...prev[studentId][selectedWeek], [field]: val } }
        }));
    };

    const handleGradeChange = (sid: string, field: string, val: number) => {
        setStudentGrades(prev => ({ ...prev, [sid]: { ...prev[sid], [field]: val } }));
    };

    return (
        <div>
             <div className="mb-4 flex space-x-2">
                <Button size="sm" variant={mode === 'attendance' ? 'primary' : 'secondary'} onClick={() => setMode('attendance')}>출석 관리</Button>
                <Button size="sm" variant={mode === 'grades' ? 'primary' : 'secondary'} onClick={() => setMode('grades')}>성적 입력</Button>
            </div>

            {mode === 'attendance' ? (
                 <>
                    <div className="mb-4 flex items-center space-x-3">
                        <span className="font-bold text-slate-700">주차 선택:</span>
                        <select value={selectedWeek} onChange={(e) => setSelectedWeek(parseInt(e.target.value))} className="px-3 py-1.5 border border-slate-300 rounded-md text-sm">
                            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => <option key={week} value={week}>{week}주차</option>)}
                        </select>
                    </div>
                    <Table headers={["학번", "이름", "출결 상태", "비고"]}>
                        {MOCK_STUDENT_RECORDS.map(student => {
                            const record = weeklyData[student.id]?.[selectedWeek] || { attendance: '출석', score: 0, note: '' };
                            return (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 text-sm text-slate-500">{student.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <select value={record.attendance} onChange={(e) => handleAttendanceChange(student.id, 'attendance', e.target.value)} className="px-2 py-1 rounded text-xs font-bold border border-slate-300">
                                            <option value="출석">출석</option>
                                            <option value="지각">지각</option>
                                            <option value="결석">결석</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <input type="text" value={record.note} onChange={(e) => handleAttendanceChange(student.id, 'note', e.target.value)} className="w-full border border-slate-300 rounded-md text-sm px-2 py-1" placeholder="비고 입력" />
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                    <div className="mt-6 flex justify-end"><Button onClick={() => alert('출결이 저장되었습니다.')}>출결 저장</Button></div>
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
                                {MOCK_STUDENT_RECORDS.map(s => {
                                    const g = studentGrades[s.id] || { mid: 0, final: 0, assign: 0, attend: 0 };
                                    const total = (g.mid * 0.3) + (g.final * 0.3) + (g.assign * 0.2) + (g.attend * 0.2);
                                    return (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-sm text-slate-500">{s.id}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                                            <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.mid} onChange={e => handleGradeChange(s.id, 'mid', parseInt(e.target.value)||0)} /></td>
                                            <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.final} onChange={e => handleGradeChange(s.id, 'final', parseInt(e.target.value)||0)} /></td>
                                            <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.assign} onChange={e => handleGradeChange(s.id, 'assign', parseInt(e.target.value)||0)} /></td>
                                            <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.attend} onChange={e => handleGradeChange(s.id, 'attend', parseInt(e.target.value)||0)} /></td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50">{total.toFixed(1)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 flex justify-end border-t border-brand-gray bg-slate-50"><Button onClick={() => alert("성적이 저장되었습니다.")}>성적 저장</Button></div>
                </>
            )}
        </div>
    );
}

export const ProfessorStudentManagement: React.FC<{ user: User; viewType?: "attendance" | "grades" }> = ({ user, viewType }) => {
  const myCourses = MOCK_COURSES.filter((c) => c.professorName === user.name);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(myCourses.length > 0 ? myCourses[0] : null);
  const [activeTab, setActiveTab] = useState<"management" | "list">("management");
  const [managementMode, setManagementMode] = useState<'attendance'|'grades'>(viewType || 'attendance');

  useEffect(() => {
      if(viewType) setManagementMode(viewType);
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
            {activeTab === "management" && <AttendanceAndGradesView selectedCourse={selectedCourse} mode={managementMode} setMode={setManagementMode} />}
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

// --- Other Views (Merged Logic) ---

export const ProfessorSyllabus: React.FC = () => {
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    
    const [syllabus, setSyllabus] = useState({ 
        overview: '', 
        objectives: '', 
        textbook: '', 
        evaluation: '',
        credits: '',
        classTime: ''
    });

    useEffect(() => {
      if (location.state?.course) {
        const c = location.state.course as Course;
        setCourse(c);
        setSyllabus({
          classTime: c.courseTime || '',
          credits: c.credit ? String(c.credit) : '',
          overview: c.content || '',
          objectives: c.objectives || '',
          textbook: c.textbookInfo || '',
          evaluation: c.evaluationMethod || ''
        });
      }
    }, [location.state]);

    const handleSave = async () => {
        if (!course) return;
        
        const updatedData = {
            courseObjectives: syllabus.objectives,
            courseContent: syllabus.overview,
            evaluationMethod: syllabus.evaluation,
            textbookInfo: syllabus.textbook
            // We don't update credits/time here usually as they are admin fields, but for this flow let's stick to content
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/courses/${course.courseCode}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                alert("강의계획서가 저장되었습니다.");
                setIsEditing(false);
            } else {
                alert("저장 실패");
            }
        } catch (e) {
            console.error("Error saving syllabus", e);
            alert("오류가 발생했습니다.");
        }
    };

    if (!course && !location.state?.course) {
        return <div className="p-8 text-center text-slate-500">강의 관리 페이지에서 강의를 선택해주세요.</div>;
    }

    const title = course ? `${course.subjectName} 강의계획서` : "강의계획서 관리";

    return (
        <Card title={title} titleAction={
            <Button size="sm" onClick={() => {
                if (isEditing) {
                    handleSave();
                } else {
                    setIsEditing(true);
                }
            }}>
                {isEditing ? '저장' : '수정'}
            </Button>
        }>
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
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
           headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
           const data = await response.json();
           const mappedCourses = data.map((c: any) => ({
             ...c,
             subjectName: c.courseName || c.subject?.sName || c.courseCode
           }));
           setMyCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch professor courses", error);
      }
    };
    if (user.memberNo) {
      fetchCourses();
    }
  }, [user.memberNo]);

  return (
    <Card title="전체 강의 시간표 (2024년 1학기)">
      <div className="pt-8 px-4">
        <ProfessorVisualTimetable courses={myCourses} />
      </div>
    </Card>
  );
};
