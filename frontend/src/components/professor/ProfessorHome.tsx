import React, { useState, useEffect } from "react";
import type { User, Course } from "../../types";
import { Card, Button } from "../ui";
import { MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from "../../constants";
import { useNavigate } from "react-router-dom";

interface ProfessorHomeProps {
  user: User;
}

export const ProfessorHome: React.FC<ProfessorHomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        // API Endpoint: /api/courses/professor/{memberNo}
        const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.courseName || c.subject?.sName || c.courseCode, // Prioritize courseName
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
