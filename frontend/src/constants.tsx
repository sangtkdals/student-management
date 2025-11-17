import React from "react";
import type { User, Course, Grade, Announcement, CalendarEvent, StudentRecord } from "./types";

// Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
export const ICONS: { [key: string]: React.ReactElement } = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  profile: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  grades: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path
        fillRule="evenodd"
        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z"
        clipRule="evenodd"
      />
    </svg>
  ),
  courses: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L9 9.61v5.063l-4.63-2.315a1 1 0 00-1.11 1.664l5.5 2.75a1 1 0 001.11 0l5.5-2.75a1 1 0 00-1.11-1.664L11 14.673V9.61l6.606-2.69a1 1 0 000-1.84l-7-3zM9 16.423v-5.063l-6.606-2.69 6.606 2.69v5.063z" />
    </svg>
  ),
  tuition: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0V7.418zM12.5 8.866V7.168c.22.07.408.164.567.267v1.431a2.5 2.5 0 00-1.134 0zM11.5 6.866V5.168a2.502 2.502 0 00-1.134 0v1.698c.22-.07.408-.164.567-.267zM10 4.5a.5.5 0 01.5.5v1.431c0 .276-.224.5-.5.5s-.5-.224-.5-.5V5a.5.5 0 01.5-.5zM9 4.5a.5.5 0 00-.5.5v1.698a2.5 2.5 0 000 4.604v1.698a.5.5 0 00.5.5c.276 0 .5-.224.5-.5v-1.698a2.5 2.5 0 000-4.604V5a.5.5 0 00-.5-.5z" />
      <path
        fillRule="evenodd"
        d="M3.5 3a.5.5 0 01.5-.5h12a.5.5 0 01.5.5v14a.5.5 0 01-.5.5h-12a.5.5 0 01-.5-.5v-14zM4 4v3.252a4.5 4.5 0 017.39-3.111A.5.5 0 0112 4.5v2.866a4.5 4.5 0 010 5.268V15.5a.5.5 0 01-1 .043 4.5 4.5 0 01-7.39 3.111A.5.5 0 014 15.5V4zm12 0v12h-1.5V4h1.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  leave: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
        clipRule="evenodd"
      />
    </svg>
  ),
  graduation: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L9 9.61v5.063l-4.63-2.315a1 1 0 00-1.11 1.664l5.5 2.75a1 1 0 001.11 0l5.5-2.75a1 1 0 00-1.11-1.664L11 14.673V9.61l6.606-2.69a1 1 0 000-1.84l-7-3zM9 16.423v-5.063l-6.606-2.69 6.606 2.69v5.063z" />
      <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  ),
  announcement: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.75 6a4.5 4.5 0 01-5.5 0V11a3.5 3.5 0 013.5-3.5h1A3.5 3.5 0 019 11v1zM16 6a3 3 0 11-6 0 3 3 0 016 0zm-1.75 6a4.5 4.5 0 01-5.5 0V11a3.5 3.5 0 013.5-3.5h1A3.5 3.5 0 0116 11v1z" />
    </svg>
  ),
  system: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L8.21 5.15c-.5.42-1.12.75-1.78.93L4.39 6.63c-1.56.38-2.22 2.22-1.07 3.37L4.9 11.02c.42.5.75 1.12.93 1.78l.55 2.04c.38 1.56 2.22 2.22 3.37 1.07l1.02-1.58c.5-.42 1.12-.75 1.78-.93l2.04-.55c1.56-.38 2.22-2.22 1.07-3.37l-1.58-1.02c-.42-.5-.75-1.12-.93-1.78l-.55-2.04zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export const MOCK_USERS: { [key: string]: User } = {
  student1: {
    id: "aaa",
    name: "김민준",
    role: "student",
    email: "minjun.kim@university.ac.kr",
    department: "컴퓨터공학과",
    avatarUrl: "https://picsum.photos/seed/student1/100/100",
  },
  professor1: {
    id: "bbb",
    name: "이서연",
    role: "professor",
    email: "s.lee@university.ac.kr",
    department: "컴퓨터공학과",
    avatarUrl: "https://picsum.photos/seed/prof1/100/100",
  },
  admin1: {
    id: "admin001",
    name: "박도윤",
    role: "admin",
    email: "doyoon.park@university.ac.kr",
    department: "행정팀",
    avatarUrl: "https://picsum.photos/seed/admin1/100/100",
  },
};

export const MOCK_COURSES: Course[] = [
  {
    id: "CS101",
    name: "프로그래밍 입문",
    professor: "이서연",
    credits: 3,
    time: "월 10:00-12:00, 수 10:00-11:00",
    room: "공학관-101",
    department: "컴퓨터공학과",
    year: 2024,
    semester: 1,
  },
  {
    id: "CS201",
    name: "자료구조",
    professor: "박지훈",
    credits: 3,
    time: "화 13:00-15:00, 목 13:00-14:00",
    room: "공학관-203",
    department: "컴퓨터공학과",
    year: 2024,
    semester: 1,
  },
  {
    id: "MA212",
    name: "선형대수학",
    professor: "최유진",
    credits: 3,
    time: "월 15:00-17:00",
    room: "과학관-301",
    department: "수학과",
    year: 2024,
    semester: 1,
  },
  {
    id: "PH101",
    name: "일반물리학",
    professor: "정하윤",
    credits: 3,
    time: "수 13:00-15:00",
    room: "과학관-105",
    department: "물리학과",
    year: 2024,
    semester: 1,
  },
];

export const MOCK_GRADES: Grade[] = [
  { courseId: "CS101", courseName: "프로그래밍 입문", credits: 3, letterGrade: "A+", gpa: 4.5, year: 2023, semester: 1 },
  { courseId: "GE100", courseName: "학술적 글쓰기", credits: 2, letterGrade: "A0", gpa: 4.0, year: 2023, semester: 1 },
  { courseId: "CS201", courseName: "자료구조", credits: 3, letterGrade: "B+", gpa: 3.5, year: 2023, semester: 2 },
  { courseId: "MA212", courseName: "선형대수학", credits: 3, letterGrade: "A0", gpa: 4.0, year: 2023, semester: 2 },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "2024년 1학기 수강신청 안내",
    content: "2024년 1학기 수강신청 기간은 2월 15일부터 2월 20일까지입니다. 자세한 내용은 학사 공지 게시판을 확인해주세요.",
    author: "학사지원팀",
    date: "2024-02-01",
  },
  {
    id: "2",
    title: "도서관 이용 시간 변경 안내",
    content: "기말고사 기간 도서관 이용 시간이 24시간으로 연장됩니다.",
    author: "도서관",
    date: "2024-05-20",
  },
  {
    id: "3",
    title: "총장님과의 대화 행사 안내",
    content: "학생 여러분의 의견을 듣기 위한 총장님과의 대화 행사가 개최됩니다.",
    author: "학생처",
    date: "2024-05-15",
  },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "1", title: "1학기 개강", startDate: "2024-03-04", endDate: "2024-03-04", category: "academic" },
  { id: "2", title: "중간고사", startDate: "2024-04-22", endDate: "2024-04-26", category: "academic" },
  { id: "3", title: "어린이날", startDate: "2024-05-05", endDate: "2024-05-05", category: "holiday" },
  { id: "4", title: "기말고사", startDate: "2024-06-10", endDate: "2024-06-14", category: "academic" },
  { id: "5", title: "여름방학 시작", startDate: "2024-06-22", endDate: "2024-06-22", category: "academic" },
  { id: "6", title: "2학기 개강", startDate: "2024-09-02", endDate: "2024-09-02", category: "academic" },
];

export const MOCK_STUDENT_RECORDS: StudentRecord[] = [
  { id: "20210001", name: "김민준", department: "Computer Science", attendance: "Present", grade: null },
  { id: "20210002", name: "이하은", department: "Computer Science", attendance: "Present", grade: null },
  { id: "20210003", name: "박서준", department: "Computer Science", attendance: "Absent", grade: null },
  { id: "20210004", name: "최지우", department: "Computer Science", attendance: "Late", grade: null },
];
