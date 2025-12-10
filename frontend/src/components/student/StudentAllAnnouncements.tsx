import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, CourseAnnouncement } from '../../types';
import { Card } from '../ui';
import { FiArrowLeft } from 'react-icons/fi';

const StudentAllAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<CourseAnnouncement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('인증 토큰이 없습니다.');

        const [announcementsRes, coursesRes] = await Promise.all([
          fetch('/api/course-notices/my', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/courses/my', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!announcementsRes.ok) throw new Error('공지사항 로딩 실패');
        if (!coursesRes.ok) throw new Error('강의 목록 로딩 실패');

        const announcementsData = await announcementsRes.json();
        const coursesData = await coursesRes.json();

        setAnnouncements(announcementsData);
        setCourses(coursesData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    if (selectedCourse === 'all') {
      return announcements;
    }
    return announcements.filter(ann => ann.courseCode === selectedCourse);
  }, [selectedCourse, announcements]);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">오류: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-200">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">전체 공지사항</h1>
      </div>

      <div className="mb-6">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="all">모든 강의</option>
          {courses.map(course => (
            <option key={course.courseCode} value={course.courseCode}>
              {course.subjectName}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map(ann => (
              <div
                key={ann.noticeId}
                className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/student/my-classroom/${ann.courseCode}/announcements/${ann.noticeId}`)}
              >
                <p className="text-sm font-semibold text-blue-600">
                    {courses.find(c => c.courseCode === ann.courseCode)?.subjectName || ann.courseCode}
                </p>
                <p className="font-bold text-lg">{ann.title}</p>
                <div className="text-xs text-gray-500 mt-1">
                  <span>{ann.writerName}</span> | <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-8 text-gray-500">표시할 공지사항이 없습니다.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentAllAnnouncements;
