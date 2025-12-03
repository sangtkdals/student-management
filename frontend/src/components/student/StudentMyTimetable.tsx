import React, { useState, useEffect } from "react";
import MyTimetable from "../../ai-course-registration/components/MyTimetable";
import { Course, User } from "../../types";

interface StudentMyTimetableProps {
  user: User;
}

export const StudentMyTimetable: React.FC<StudentMyTimetableProps> = ({ user }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (user?.memberNo) {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`/api/enrollments/${user.memberNo}`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            const fetchedCourses: Course[] = data.map((enrollmentDTO: any) => {
              const courseDTO = enrollmentDTO.course;
              return {
                courseCode: courseDTO.courseCode,
                academicYear: courseDTO.academicYear,
                semester: courseDTO.semester,
                subjectCode: courseDTO.sCode,
                courseClass: courseDTO.courseClass,
                professorNo: courseDTO.professorNo,
                maxStudents: courseDTO.maxStu,
                classroom: courseDTO.classroom,
                courseSchedules: courseDTO.schedules || [],
                status: courseDTO.courseStatus,
                currentStudents: courseDTO.currentStu,
                subjectName: courseDTO.subjectName,
                professorName: courseDTO.professorName,
                credit: courseDTO.credit,
                subject: {
                  sCode: courseDTO.sCode,
                  sName: courseDTO.subjectName,
                  credit: courseDTO.credit,
                  subjectType: "Unknown",
                  dept_code: "Unknown",
                },
              };
            });
            setCourses(fetchedCourses);
          } else {
            console.error("Failed to fetch enrollments");
            setCourses([]);
          }
        } catch (error) {
          console.error("Error fetching enrollments:", error);
          setCourses([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEnrollments();
  }, [user]);

  return (
    <main className="flex-grow container mx-auto p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 lg:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">시간표 조회</h2>
        <p className="text-sm text-gray-500 mb-6">이번 학기 수강 신청한 과목의 시간표를 확인합니다.</p>
        {loading ? <p>시간표를 불러오는 중입니다...</p> : <MyTimetable courses={courses} />}
      </div>
    </main>
  );
};
