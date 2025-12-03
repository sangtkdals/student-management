import React, { useState, useEffect } from "react";
import type { User, Course } from "../../types";
import { Card, Button } from "../ui";
import { useLocation } from "react-router-dom";

export const ProfessorSyllabus: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  // Evaluation parts
  const [evalBreakdown, setEvalBreakdown] = useState({ mid: 0, final: 0, assign: 0, attend: 0 });
  const [evalDesc, setEvalDesc] = useState("");

  const [syllabus, setSyllabus] = useState({
    overview: "",
    objectives: "",
    textbook: "",
    credits: "",
    classTime: "",
  });

  // Fetch courses for the selector
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
            subjectName: c.subjectName || c.courseName || c.subject?.sName || c.courseCode,
          }));
          setMyCourses(mappedCourses);

          // If navigated with state, use that course, otherwise default to first if available
          if (location.state?.course) {
            // Find updated info from fetched list to be sure
            const found = mappedCourses.find((mc: any) => mc.courseCode === location.state.course.courseCode);
            setCourse(found || location.state.course);
          } else if (mappedCourses.length > 0 && !course) {
            // Select first by default if not set
            setCourse(mappedCourses[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, [user.memberNo, location.state]);

  // Update syllabus state when course changes
  useEffect(() => {
    if (course) {
      setSyllabus({
        classTime: course.courseTime || "",
        credits: String(course.credit || 0), // Use course.credit directly
        overview: course.content || "",
        objectives: course.objectives || "",
        textbook: course.textbookInfo || "",
      });

      // Parse evaluation method
      try {
        if (course.evaluationMethod && course.evaluationMethod.startsWith("{")) {
          const parsed = JSON.parse(course.evaluationMethod);
          setEvalBreakdown({
            mid: parsed.mid || 0,
            final: parsed.final || 0,
            assign: parsed.assign || 0,
            attend: parsed.attend || 0,
          });
          setEvalDesc(parsed.desc || "");
        } else {
          // Legacy plain text
          setEvalBreakdown({ mid: 0, final: 0, assign: 0, attend: 0 });
          setEvalDesc(course.evaluationMethod || "");
        }
      } catch (e) {
        setEvalBreakdown({ mid: 0, final: 0, assign: 0, attend: 0 });
        setEvalDesc(course.evaluationMethod || "");
      }
    }
  }, [course]);

  const handleSave = async () => {
    if (!course) return;

    // Serialize evaluation method
    const evalJson = JSON.stringify({
      ...evalBreakdown,
      desc: evalDesc,
    });

    const updatedData = {
      courseObjectives: syllabus.objectives,
      courseContent: syllabus.overview,
      evaluationMethod: evalJson,
      textbookInfo: syllabus.textbook,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/courses/${course.courseCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("강의계획서가 저장되었습니다.");
        setIsEditing(false);
        // Refresh local course data logic could go here or re-fetch
      } else {
        alert("저장 실패");
      }
    } catch (e) {
      console.error("Error saving syllabus", e);
      alert("오류가 발생했습니다.");
    }
  };

  if (myCourses.length === 0) {
    return (
      <Card title="강의계획서 관리">
        <div className="p-8 text-center text-slate-500">등록된 강의가 없습니다. 강의를 먼저 등록해주세요.</div>
      </Card>
    );
  }

  const title = course ? `${course.subjectName} 강의계획서` : "강의계획서 관리";

  return (
    <Card
      title={title}
      titleAction={
        <Button
          size="sm"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "저장" : "수정"}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Course Selector */}
        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <label className="font-bold text-slate-700">강의 선택:</label>
          <select
            className="p-2 border border-slate-300 rounded-md text-sm"
            value={course?.courseCode || ""}
            onChange={(e) => {
              const selected = myCourses.find((c) => c.courseCode === e.target.value);
              if (selected) setCourse(selected);
            }}
          >
            {myCourses.map((c) => (
              <option key={c.courseCode} value={c.courseCode}>
                {c.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">취득 학점</label>
            <input
              type="text"
              className="w-full border border-slate-300 p-3 rounded-md text-sm bg-gray-100"
              disabled
              value={syllabus.credits}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">강의 요일/시간</label>
            <input
              type="text"
              className="w-full border border-slate-300 p-3 rounded-md text-sm bg-gray-100"
              disabled
              value={syllabus.classTime}
              readOnly
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">강의 개요 (Course Content)</label>
          <textarea
            className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue"
            rows={3}
            disabled={!isEditing}
            value={syllabus.overview}
            onChange={(e) => setSyllabus({ ...syllabus, overview: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">강의 목표 (Course Objectives)</label>
          <textarea
            className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue"
            rows={2}
            disabled={!isEditing}
            value={syllabus.objectives}
            onChange={(e) => setSyllabus({ ...syllabus, objectives: e.target.value })}
          />
        </div>

        {/* Evaluation Method Section */}
        <div className="border p-4 rounded-md border-slate-200">
          <label className="block text-sm font-bold text-slate-700 mb-4">평가 방법 (Evaluation Method)</label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">중간고사 (%)</label>
              <input
                type="number"
                step="5"
                className="w-full border border-slate-300 p-2 rounded-md text-sm text-right"
                disabled={!isEditing}
                value={evalBreakdown.mid}
                onChange={(e) => setEvalBreakdown({ ...evalBreakdown, mid: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">기말고사 (%)</label>
              <input
                type="number"
                step="5"
                className="w-full border border-slate-300 p-2 rounded-md text-sm text-right"
                disabled={!isEditing}
                value={evalBreakdown.final}
                onChange={(e) => setEvalBreakdown({ ...evalBreakdown, final: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">과제 (%)</label>
              <input
                type="number"
                step="5"
                className="w-full border border-slate-300 p-2 rounded-md text-sm text-right"
                disabled={!isEditing}
                value={evalBreakdown.assign}
                onChange={(e) => setEvalBreakdown({ ...evalBreakdown, assign: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">출석 (%)</label>
              <input
                type="number"
                step="5"
                className="w-full border border-slate-300 p-2 rounded-md text-sm text-right"
                disabled={!isEditing}
                value={evalBreakdown.attend}
                onChange={(e) => setEvalBreakdown({ ...evalBreakdown, attend: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 mb-4">
            합계:{" "}
            <span
              className={`font-bold ${
                evalBreakdown.mid + evalBreakdown.final + evalBreakdown.assign + evalBreakdown.attend === 100 ? "text-green-600" : "text-red-500"
              }`}
            >
              {evalBreakdown.mid + evalBreakdown.final + evalBreakdown.assign + evalBreakdown.attend}%
            </span>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">평가 상세 설명</label>
            <textarea
              className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue"
              rows={3}
              disabled={!isEditing}
              value={evalDesc}
              onChange={(e) => setEvalDesc(e.target.value)}
              placeholder="평가 방법에 대한 상세 설명을 입력하세요."
            />
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">교재 정보 (Textbook)</label>
            <input
              type="text"
              className="w-full border border-slate-300 p-3 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue"
              disabled={!isEditing}
              value={syllabus.textbook}
              onChange={(e) => setSyllabus({ ...syllabus, textbook: e.target.value })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
