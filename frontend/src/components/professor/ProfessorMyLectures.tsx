import React, { useState, useEffect } from "react";
import type { User, Course, Department } from "../../types";
import { Card, Button, Modal, Input } from "../ui";
import { useNavigate } from "react-router-dom";
import { ProfessorVisualTimetable } from "./ProfessorVisualTimetable";

export const ProfessorMyLectures: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newCourse, setNewCourse] = useState({
    courseName: "소프트웨어공학",
    subjectName: "소프트웨어공학", // Keep for compatibility or remove if not needed
    deptCode: "", // Selected Department
    courseCode: "", // Auto-generated
    courseTime: "월 10:00-12:00",
    classroom: "공학관 305호",
    subjectCode: "", // Auto-generated
    courseClass: "01",
    maxStudents: 50,
    credit: 0,
    academicYear: new Date().getFullYear(),
    semester: new Date().getMonth() + 1 >= 7 ? 2 : 1,
  });
  const [addedCourses, setAddedCourses] = useState<Set<string>>(new Set());
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  // Time Slot State
  const [timeSlots, setTimeSlots] = useState<{ day: string; start: string; end: string }[]>([{ day: "월", start: "10:00", end: "12:00" }]);
  const [currentSlot, setCurrentSlot] = useState({ day: "월", start: "09:00", end: "10:00" });

  useEffect(() => {
    // Fetch departments
    fetch("http://localhost:8080/api/departments")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
          if (Array.isArray(data)) setDepartments(data);
      })
      .catch((err) => console.error("Failed to fetch departments", err));
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Map backend response to Course type
        const mappedCourses = data.map((c: any) => {
          // Construct courseTime from courseSchedules if available
          let timeStr = c.courseTime || "";
          const schedules = c.schedules || c.courseSchedules;
          if (!timeStr && schedules && schedules.length > 0) {
             const dayMap: { [key: number]: string } = { 1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토", 7: "일" };
             timeStr = schedules.map((s: any) => {
                 const day = dayMap[s.dayOfWeek] || "";
                 const start = s.startTime ? s.startTime.substring(0, 5) : "";
                 const end = s.endTime ? s.endTime.substring(0, 5) : "";
                 return `${day} ${start}-${end}`;
             }).join(", ");
          }

          return {
            ...c,
            subjectName: c.subjectName || c.courseName || c.subject?.sName || c.courseCode, 
            subjectCode: c.subject?.sCode,
            deptCode: c.deptCode || c.subject?.department?.deptCode, // Ensure deptCode is mapped
            courseSchedules: c.schedules || [], // Map backend 'schedules' to frontend 'courseSchedules'
            courseTime: timeStr
          };
        });
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
    // Validate overlapping
    const newStart = parseInt(currentSlot.start.replace(":", ""));
    const newEnd = parseInt(currentSlot.end.replace(":", ""));

    if (newStart >= newEnd) {
        alert("종료 시간은 시작 시간보다 늦어야 합니다.");
        return;
    }

    const hasOverlap = timeSlots.some(slot => {
        if (slot.day !== currentSlot.day) return false;
        const oldStart = parseInt(slot.start.replace(":", ""));
        const oldEnd = parseInt(slot.end.replace(":", ""));
        // Overlap condition: (StartA < EndB) and (EndA > StartB)
        return (newStart < oldEnd && newEnd > oldStart);
    });

    if (hasOverlap) {
        alert("시간대가 겹치는 강의가 이미 존재합니다.");
        return;
    }

    setTimeSlots([...timeSlots, currentSlot]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Sync timeSlots to newCourse.courseTime string and calculate credits
    const timeString = timeSlots.map((slot) => `${slot.day} ${slot.start}-${slot.end}`).join(", ");
    
    // Calculate credits (1 hour = 1 credit)
    let totalHours = 0;
    timeSlots.forEach((slot) => {
      const [startH, startM] = slot.start.split(":").map(Number);
      const [endH, endM] = slot.end.split(":").map(Number);
      const duration = (endH - startH) + (endM - startM) / 60;
      totalHours += duration;
    });
    
    // If no slots, credit 0. Otherwise round.
    const calculatedCredit = timeSlots.length > 0 ? Math.round(totalHours) : 0;

    setNewCourse((prev) => ({ ...prev, courseTime: timeString, credit: calculatedCredit }));
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
            headers: { Authorization: `Bearer ${token}` },
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
    
    // Transform timeSlots to backend courseSchedules format
    const dayMap: { [key: string]: number } = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6, "일": 7 };
    const courseSchedules = timeSlots.map(slot => ({
        dayOfWeek: dayMap[slot.day],
        startTime: slot.start + ":00", // "HH:mm" -> "HH:mm:00"
        endTime: slot.end + ":00"
    }));

    const courseToAdd = {
      ...newCourse,
      professorNo: user.memberNo,
      courseSchedules: courseSchedules
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseToAdd),
      });

      if (response.ok) {
        setIsRegisterModalOpen(false);
        // Reset to dummy data for next entry (debugging convenience)
        // Recalculate year/semester for reset
        const now = new Date();
        setNewCourse({
          courseName: "데이터베이스",
          subjectName: "데이터베이스",
          deptCode: "", // Add deptCode to reset state
          courseCode: "",
          courseTime: "",
          classroom: "정보관 202호",
          subjectCode: "",
          courseClass: "002",
          maxStudents: 45,
          credit: 0,
          academicYear: now.getFullYear(),
          semester: now.getMonth() + 1 >= 7 ? 2 : 1,
        });
        setTimeSlots([]);
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
                          {course.deptCode} | <span className="font-semibold">{course.currentStudents || 0}</span>명
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
                          <Button size="sm" variant="secondary" onClick={() => navigate("/professor/syllabus", { state: { course } })}>
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
                  hasChanges ? "text-brand-blue font-bold hover:underline cursor-pointer" : "text-slate-400 font-normal cursor-not-allowed"
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
            onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value, subjectName: e.target.value })}
            required
            className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
          />
          
          {/* Department Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">학과</label>
            <select
                className="block w-full px-3 py-2 bg-white border border-slate-400 text-sm shadow-sm focus:outline-none focus:border-slate-900 focus:ring-slate-900 rounded-none"
                value={newCourse.deptCode}
                onChange={(e) => setNewCourse({ ...newCourse, deptCode: e.target.value })}
                required
            >
                <option value="">학과 선택</option>
                {departments.map((dept) => (
                    <option key={dept.deptCode} value={dept.deptCode}>
                        {dept.deptName}
                    </option>
                ))}
            </select>
          </div>

          {/* 강의 코드, 과목 코드는 자동 생성이므로 입력란 제거됨 */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="학년도"
              type="text"
              value={String(newCourse.academicYear)}
              readOnly
              className="rounded-none border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed focus:ring-0"
            />
            <Input
              label="학기"
              type="text"
              value={String(newCourse.semester)}
              readOnly
              className="rounded-none border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed focus:ring-0"
            />
            <Input
              label="분반"
              value={newCourse.courseClass}
              onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setNewCourse({ ...newCourse, courseClass: val });
              }}
              onBlur={(e) => {
                  const val = e.target.value;
                  if (val) {
                      const padded = val.padStart(3, '0');
                      setNewCourse({ ...newCourse, courseClass: padded });
                  }
              }}
              required
              className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="수강정원"
              type="number"
              step="10"
              value={String(newCourse.maxStudents)}
              onChange={(e) => setNewCourse({ ...newCourse, maxStudents: parseInt(e.target.value) })}
              required
              className="rounded-none border-slate-400 focus:border-slate-900 focus:ring-slate-900"
            />
            <Input
              label="학점"
              type="number"
              value={String(newCourse.credit)}
              readOnly
              className="rounded-none border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed focus:ring-0"
            />
          </div>
          <Input
            label="강의실"
            value={newCourse.classroom}
            onChange={(e) => setNewCourse({ ...newCourse, classroom: e.target.value })}
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
                  {["월", "화", "수", "목", "금"].map((d) => (
                    <option key={d} value={d}>
                      {d}요일
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">시작 시간</label>
                <select
                  className="w-full border border-slate-400 rounded-none p-2 text-sm focus:border-slate-900 focus:ring-slate-900"
                  value={currentSlot.start}
                  onChange={(e) => setCurrentSlot({ ...currentSlot, start: e.target.value })}
                >
                  {Array.from({ length: 9 }, (_, i) => i + 9).map((h) => (
                    <option key={h} value={`${h < 10 ? "0" + h : h}:00`}>{`${h < 10 ? "0" + h : h}:00`}</option>
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
                  {Array.from({ length: 9 }, (_, i) => i + 10).map((h) => (
                    <option key={h} value={`${h < 10 ? "0" + h : h}:00`}>{`${h < 10 ? "0" + h : h}:00`}</option>
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
                      <button type="button" onClick={() => removeTimeSlot(index)} className="text-slate-500 hover:text-red-700 text-xs font-bold">
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
            <Button type="submit" className="rounded-none bg-slate-900 text-white hover:bg-slate-800 border border-slate-900">
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
                <p className="text-sm font-medium text-slate-800">
                  {selectedCourseDetail.academicYear}년 {selectedCourseDetail.semester}학기
                </p>
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
                <p className="text-sm font-medium text-slate-800">
                  {selectedCourseDetail.maxStudents}명 (현재 {selectedCourseDetail.currentStudents}명)
                </p>
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
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    selectedCourseDetail.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedCourseDetail.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setSelectedCourseDetail(null)}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
