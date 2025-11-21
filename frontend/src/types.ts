export type UserRole = 'student' | 'professor' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department: string;
  avatarUrl: string;
}

export interface Course {
  id: string;
  name: string;
  professor: string;
  credits: number;
  time: string;
  room: string;
  department: string;
  year: number;
  semester: number;
}

export interface Grade {
  courseId: string;
  courseName: string;
  credits: number;
  letterGrade: string;
  gpa: number;
  year: number;
  semester: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: 'academic' | 'holiday' | 'event';
}

export interface StudentRecord {
  id: string;
  name: string;
  department: string;
  attendance: 'Present' | 'Absent' | 'Late';
  grade: string | null;
}
