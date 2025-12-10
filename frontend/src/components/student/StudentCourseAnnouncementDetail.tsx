import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseAnnouncement } from '../../types';
import { Card } from '../ui';
import { FaArrowLeft } from 'react-icons/fa';

const StudentCourseAnnouncementDetail = () => {
  const { courseCode, noticeId } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<CourseAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/course-notices/${courseCode}`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const announcements: CourseAnnouncement[] = await response.json();
        const selected = announcements.find(a => a.noticeId.toString() === noticeId);
        setAnnouncement(selected || null);
         if (selected) {
          // Increment view count
          await fetch(`/api/course-notices/${selected.noticeId}/view`, { 
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [courseCode, noticeId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!announcement) return <div className="p-8 text-center">Announcement not found.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold">{announcement.title}</h1>
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
                <FaArrowLeft className="mr-2" />
                목록으로
            </button>
        </div>
        <div className="text-sm text-gray-500 mb-4">
            <span>작성자: {announcement.writerName}</span> | <span>작성일: {new Date(announcement.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{announcement.content}</p>
        </div>
    </div>
  );
};

export default StudentCourseAnnouncementDetail;
