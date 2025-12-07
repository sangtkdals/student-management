import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CourseAnnouncement } from '../../types';
import { Card } from '../ui';

const StudentCourseAnnouncementDetail = () => {
  const { courseCode, noticeId } = useParams();
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card title={announcement.title}>
            <div className="text-sm text-gray-500 mb-4 border-b pb-4">
              <span>작성자: {announcement.writerName}</span> | <span>작성일: {new Date(announcement.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="prose max-w-none">
                <p>{announcement.content}</p>
            </div>
        </Card>
    </div>
  );
};

export default StudentCourseAnnouncementDetail;
