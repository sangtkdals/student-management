import React, { useState, useEffect } from "react";
import { Course, CourseAnnouncement } from "../../types";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const StudentMyClassroom: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<CourseAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("인증 토큰이 없습니다.");
        }

        // Fetch courses and announcements in parallel
        const [coursesResponse, announcementsResponse] = await Promise.all([
          fetch("/api/courses/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/course-notices/my-latest", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!coursesResponse.ok) {
          throw new Error(`강의 목록 로딩 실패: ${coursesResponse.status}`);
        }
        if (!announcementsResponse.ok) {
          throw new Error(`공지사항 로딩 실패: ${announcementsResponse.status}`);
        }

        const coursesData = await coursesResponse.json();
        const announcementsData = await announcementsResponse.json();
        
        // Sort announcements by creation date, newest first
        announcementsData.sort((a: CourseAnnouncement, b: CourseAnnouncement) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setCourses(coursesData);
        setAnnouncements(announcementsData);

      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseClick = (courseCode: string) => {
    navigate(`/student/my-classroom/${courseCode}`);
  };

  const SectionHeader: React.FC<{ title: string; showMore?: boolean; onClick?: () => void }> = ({ title, showMore, onClick }) => (
    <div className="flex justify-between items-center pb-3 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3"></span>
        {title}
      </h2>
      {showMore && (
        <button onClick={onClick} className="flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
          MORE <FiChevronRight className="ml-1" />
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-lg font-semibold">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-red-500 font-semibold">오류: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 나의 강의 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SectionHeader title="나의 강의" showMore={true} />
          <div className="mt-4 space-y-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.courseCode}
                  onClick={() => handleCourseClick(course.courseCode)}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        {course.subjectName}({course.courseClass})
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{course.professorName} 교수님</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">정규</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      운영기간 : {course.academicYear}년 {course.semester}학기
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">수강 중인 강의가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 최근 공지사항 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SectionHeader title="최근 공지사항" showMore={true} onClick={() => navigate('/student/announcements')} />
          <div className="mt-4 space-y-3">
            {announcements.length > 0 ? (
              announcements.map((ann) => {
                const course = courses.find(c => c.courseCode === ann.courseCode);
                return (
                  <div key={ann.noticeId} className="border-b border-gray-100 pb-3 cursor-pointer hover:bg-gray-50"
                       onClick={() => navigate(`/student/my-classroom/${ann.courseCode}/announcements/${ann.noticeId}`)}>
                     <p className="text-sm font-semibold text-blue-600">{course?.subjectName || ann.courseCode}</p>
                    <p className="text-md font-bold text-gray-800 truncate hover:text-clip">{ann.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">{ann.writerName}</p>
                      <p className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>새로운 공지사항이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMyClassroom;
