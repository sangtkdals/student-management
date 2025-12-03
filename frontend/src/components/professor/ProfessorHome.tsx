import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, Course } from "../../types";
import { MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS, ICONS } from "../../constants";

const TodaySchedule: React.FC<{ user: User }> = ({ user }) => {
  const [todayCourses, setTodayCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayCourses = async () => {
      if (!user?.memberNo) return;

      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/courses/professor/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const allCourses: Course[] = data.map((course: any) => ({
            ...course,
            courseSchedules: course.schedules,
          }));

          const today = new Date().getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
          const dbToday = today === 0 ? 7 : today;

          const filteredCourses = allCourses.filter((course) => course.courseSchedules?.some((schedule) => Number(schedule.dayOfWeek) === dbToday));

          // Sort by start time
          const sortedCourses = filteredCourses.sort((a, b) => {
            const timeA = a.courseSchedules?.[0]?.startTime || "23:59:59";
            const timeB = b.courseSchedules?.[0]?.startTime || "23:59:59";
            return timeA.localeCompare(timeB);
          });

          setTodayCourses(sortedCourses);
        } else {
          console.error("Failed to fetch courses for today's schedule");
          setTodayCourses([]);
        }
      } catch (error) {
        console.error("Error fetching today's schedule:", error);
        setTodayCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayCourses();
  }, [user]);

  const formatDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = new Date().toLocaleString("ko-KR", { weekday: "short" });
    return `${year}.${month}.${day} (${dayOfWeek})`;
  };

  const getCourseStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes, 0, 0);

    const [endHours, endMinutes] = endTime.split(":").map(Number);
    end.setHours(endHours, endMinutes, 0, 0);

    if (now < start) {
      return { text: "예정", style: "bg-slate-100 text-slate-600" };
    } else if (now >= start && now <= end) {
      return { text: "진행중", style: "bg-green-100 text-green-800 animate-pulse" };
    } else {
      return { text: "종료", style: "bg-red-100 text-red-600 opacity-70" };
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg h-full border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          오늘의 강의
        </h3>
        <span className="text-xs text-slate-500">{formatDate()}</span>
      </div>
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">강의 목록을 불러오는 중입니다...</p>
        ) : todayCourses.length > 0 ? (
          todayCourses.map((course, idx) => {
            const schedule = course.courseSchedules?.[0];
            if (!schedule) return null;
            const status = getCourseStatus(schedule.startTime, schedule.endTime);
            return (
              <div key={idx} className="flex items-start border-l-2 border-brand-blue pl-3 py-1">
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{course.subjectName}</p>
                  <p className="text-xs text-slate-500">
                    {course.classroom} | {schedule.startTime}-{schedule.endTime}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded bg-slate-100 text-slate-600`}>{course.currentStudents}명 수강</span>
                  <span className={`text-xs px-2 py-1 rounded ${status.style}`}>{status.text}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">오늘은 강의가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

const DashboardHero: React.FC<{ user: User; navigate: ReturnType<typeof useNavigate> }> = ({ user, navigate }) => {
  return (
    <div className="bg-brand-blue w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-2 border-white/50 object-cover" />
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-blue-100 text-sm">{user.departmentName ?? ""}</p>
                    <p className="text-blue-200 text-xs mt-1">
                      {user.role === "student" ? "학부생" : "교수"} | {user.id}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {user.role.toLowerCase() === "student" ? (
                    <>
                      <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                        <span className="text-blue-100 text-sm">학번</span>
                        <span className="font-medium text-sm">{user.memberNo}</span>
                      </div>
                      <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                        <span className="text-blue-100 text-sm">학년</span>
                        <span className="font-medium text-sm">{user.gradeLevel}학년</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                        <span className="text-blue-100 text-sm">이메일</span>
                        <span className="font-medium text-sm truncate max-w-[150px]">{user.email}</span>
                      </div>
                      <div className="bg-black/20 rounded p-3 flex justify-between items-center">
                        <span className="text-blue-100 text-sm">연구실</span>
                        <span className="font-medium text-sm">{user.officeRoom || "미배정"}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full py-2 bg-white text-brand-blue font-bold rounded hover:bg-blue-50 transition-colors text-sm"
                >
                  내 정보 관리
                </button>
              </div>
            </div>
          </div>

          {/* Right: Timetable & Tasks */}
          <div className="lg:col-span-2">
            <TodaySchedule user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardContent: React.FC<{ navigate: ReturnType<typeof useNavigate>; user: User }> = ({ navigate, user }) => {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/schedules");
        if (response.ok) {
          const data = await response.json();
          setSchedules(data);
        } else {
          console.error("Failed to fetch academic schedules");
        }
      } catch (error) {
        console.error("Error fetching academic schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notices */}
        <div className="bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-brand-blue">
              {ICONS.announcement}
              <h3 className="ml-2 text-lg font-bold text-slate-800">공지사항</h3>
            </div>
            <button onClick={() => navigate("/announcements")} className="text-xs text-slate-500 hover:text-brand-blue">
              더보기 +
            </button>
          </div>
          <ul className="space-y-3">
            {MOCK_ANNOUNCEMENTS.slice(0, 3).map((ann) => (
              <li key={ann.postId} onClick={() => navigate("/announcements")} className="cursor-pointer group">
                <p className="text-sm text-slate-700 group-hover:text-brand-blue font-medium truncate">{ann.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{ann.createdAt.slice(0, 10)}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-brand-blue">
              {ICONS.calendar}
              <h3 className="ml-2 text-lg font-bold text-slate-800">주요 학사일정</h3>
            </div>
            <button onClick={() => navigate("/calendar")} className="text-xs text-slate-500 hover:text-brand-blue">
              전체보기 +
            </button>
          </div>
          <ul className="space-y-3">
            {schedules.slice(0, 3).map((evt) => (
              <li key={evt.scheduleId} className="flex items-start">
                <div className="flex-shrink-0 w-12 text-center bg-slate-100 rounded p-1 mr-3">
                  <p className="text-xs text-slate-500">{evt.startDate.split("-")[1]}월</p>
                  <p className="text-sm font-bold text-slate-800">{evt.startDate.split("-")[2]}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{evt.scheduleTitle}</p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      evt.category === "academic"
                        ? "bg-blue-50 text-blue-600"
                        : evt.category === "holiday"
                        ? "bg-red-50 text-red-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {evt.category === "academic" ? "학사" : evt.category === "holiday" ? "휴일" : "기타"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md border border-brand-gray p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4 text-brand-blue">
            {ICONS.system}
            <h3 className="ml-2 text-lg font-bold text-slate-800">바로가기</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/professor/my-lectures")}
              className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
            >
              <div className="mx-auto mb-1 w-6 h-6">{ICONS.courses}</div>
              <span className="text-xs font-bold">내 강의</span>
            </button>
            <button
              onClick={() => navigate("/professor/student-attendance")}
              className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
            >
              <div className="mx-auto mb-1 w-6 h-6">{ICONS.users}</div>
              <span className="text-xs font-bold">출결 관리</span>
            </button>
            <button
              onClick={() => navigate("/professor/grade-management")}
              className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
            >
              <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
              <span className="text-xs font-bold">성적 관리</span>
            </button>
            <button
              onClick={() => navigate("/professor/syllabus")}
              className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-colors text-center"
            >
              <div className="mx-auto mb-1 w-6 h-6">{ICONS.grades}</div>
              <span className="text-xs font-bold">강의계획서</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfessorHome: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <>
      <DashboardHero user={user} navigate={navigate} />
      <DashboardContent user={user} navigate={navigate} />
    </>
  );
};
