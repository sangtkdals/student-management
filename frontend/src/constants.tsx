import React from "react";
import type { User, Course, Grade, Post, AcademicSchedule, StudentRecord } from "./types";

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
    memberNo: "20210001",
    deptCode: "CS",
    name: "김민준",
    role: "student",
    email: "minjun.kim@university.ac.kr",
    department: "컴퓨터공학과",
    avatarUrl: "https://picsum.photos/seed/student1/100/100",
  },
  professor1: {
    id: "bbb",
    memberNo: "PROF001",
    deptCode: "CS",
    name: "이서연",
    role: "professor",
    email: "s.lee@university.ac.kr",
    department: "컴퓨터공학과",
    avatarUrl: "https://picsum.photos/seed/prof1/100/100",
  },
  admin1: {
    id: "admin001",
    memberNo: "ADMIN001",
    deptCode: "ADM",
    name: "박도윤",
    role: "admin",
    email: "doyoon.park@university.ac.kr",
    department: "행정팀",
    avatarUrl: "https://picsum.photos/seed/admin1/100/100",
  },
};

export const MOCK_COURSES: Course[] = [
  {
    courseCode: "CS101-01",
    academicYear: 2024,
    semester: 1,
    subjectCode: "CS101",
    courseClass: "01",
    professorNo: "bbb",
    maxStudents: 50,
    currentStudents: 45,
    classroom: "공학관-101",
    courseTime: "월 10:00-12:00, 수 10:00-11:00",
    status: "OPEN",
    subjectName: "프로그래밍 입문",
    professorName: "이서연",
    credit: 3,
  },
  {
    courseCode: "CS201-01",
    academicYear: 2024,
    semester: 1,
    subjectCode: "CS201",
    courseClass: "01",
    professorNo: "prof002",
    maxStudents: 40,
    currentStudents: 40,
    classroom: "공학관-203",
    courseTime: "화 13:00-15:00, 목 13:00-14:00",
    status: "OPEN",
    subjectName: "자료구조",
    professorName: "박지훈",
    credit: 3,
  },
  {
    courseCode: "MA212-01",
    academicYear: 2024,
    semester: 1,
    subjectCode: "MA212",
    courseClass: "01",
    professorNo: "prof003",
    maxStudents: 60,
    currentStudents: 58,
    classroom: "과학관-301",
    courseTime: "월 15:00-17:00",
    status: "OPEN",
    subjectName: "선형대수학",
    professorName: "최유진",
    credit: 3,
  },
  {
    courseCode: "PH101-01",
    academicYear: 2024,
    semester: 1,
    subjectCode: "PH101",
    courseClass: "01",
    professorNo: "prof004",
    maxStudents: 70,
    currentStudents: 65,
    classroom: "과학관-105",
    courseTime: "수 13:00-15:00",
    status: "OPEN",
    subjectName: "일반물리학",
    professorName: "정하윤",
    credit: 3,
  },
];

export const MOCK_GRADES: Grade[] = [
  {
    gradeId: 1,
    enrollmentId: 1,
    courseCode: "CS101",
    courseName: "프로그래밍 입문",
    credit: 3,
    gradeLetter: "A+",
    gradePoint: 4.5,
    year: 2023,
    semester: 1,
  },
  {
    gradeId: 2,
    enrollmentId: 2,
    courseCode: "GE100",
    courseName: "학술적 글쓰기",
    credit: 2,
    gradeLetter: "A0",
    gradePoint: 4.0,
    year: 2023,
    semester: 1,
  },
  {
    gradeId: 3,
    enrollmentId: 3,
    courseCode: "CS201",
    courseName: "자료구조",
    credit: 3,
    gradeLetter: "B+",
    gradePoint: 3.5,
    year: 2023,
    semester: 2,
  },
  {
    gradeId: 4,
    enrollmentId: 4,
    courseCode: "MA212",
    courseName: "선형대수학",
    credit: 3,
    gradeLetter: "A0",
    gradePoint: 4.0,
    year: 2023,
    semester: 2,
  },
];

export const MOCK_ANNOUNCEMENTS: Post[] = [
  {
    postId: 1,
    boardId: 1,
    title: "2024년 1학기 수강신청 안내",
    content: "2024년 1학기 수강신청 기간은 2월 15일부터 2월 20일까지입니다. 자세한 내용은 학사 공지 게시판을 확인해주세요.",
    writerId: "ADMIN001",
    writerName: "학사지원팀",
    viewCount: 120,
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    postId: 2,
    boardId: 1,
    title: "도서관 이용 시간 변경 안내",
    content: "기말고사 기간 도서관 이용 시간이 24시간으로 연장됩니다.",
    writerId: "ADMIN001",
    writerName: "도서관",
    viewCount: 250,
    createdAt: "2024-05-20T14:30:00Z",
  },
  {
    postId: 3,
    boardId: 1,
    title: "총장님과의 대화 행사 안내",
    content: "학생 여러분의 의견을 듣기 위한 총장님과의 대화 행사가 개최됩니다.",
    writerId: "ADMIN001",
    writerName: "학생처",
    viewCount: 98,
    createdAt: "2024-05-15T09:00:00Z",
  },
];

export const MOCK_CALENDAR_EVENTS: AcademicSchedule[] = [
  {
    scheduleId: 1,
    academicYear: 2024,
    semester: 1,
    title: "1학기 개강",
    startDate: "2024-03-04",
    endDate: "2024-03-04",
    category: "academic",
    recurrenceType: "NONE",
  },
  {
    scheduleId: 2,
    academicYear: 2024,
    semester: 1,
    title: "중간고사",
    startDate: "2024-04-22",
    endDate: "2024-04-26",
    category: "academic",
    recurrenceType: "NONE",
  },
  {
    scheduleId: 3,
    academicYear: 2024,
    semester: 0,
    title: "어린이날",
    startDate: "2024-05-05",
    endDate: "2024-05-05",
    category: "holiday",
    recurrenceType: "YEARLY",
  },
];

export const MOCK_STUDENT_RECORDS: StudentRecord[] = [
  { id: "20210001", name: "김민준", department: "Computer Science", attendance: "Present", grade: null },
  { id: "20210002", name: "이하은", department: "Computer Science", attendance: "Present", grade: null },
  { id: "20210003", name: "박서준", department: "Computer Science", attendance: "Absent", grade: null },
  { id: "20210004", name: "최지우", department: "Computer Science", attendance: "Late", grade: null },
];
