// src/navigation.ts

export interface MenuNode {
  label: string;
  path: string;
  children?: MenuNode[];
}

export const STUDENT_MENU: MenuNode[] = [
  {
    label: "수강",
    path: "",
    children: [
      { label: "수강신청", path: "/student/course-registration" },
      { label: "시간표 조회", path: "/student/Mytimetable" },
    ],
  },
  {
    label: "성적",
    path: "",
    children: [
      { label: "금학기 성적", path: "/student/current-grades" },
      { label: "전체 성적", path: "/student/all-grades" },
    ],
  },
  {
    label: "등록/장학",
    path: "",
    children: [
      { label: "등록금 납부", path: "/student/tuition-payment" },
      { label: "등록금 내역", path: "/student/tuition-history" },
    ],
  },
  {
    label: "학적/졸업",
    path: "",
    children: [
      { label: "휴학 신청", path: "/student/leave-application" },
      { label: "휴학 내역", path: "/student/leave-history" },
      { label: "복학 신청", path: "/student/return-application" },
      { label: "복학 내역", path: "/student/return-history" },
      { label: "졸업 요건", path: "/student/graduation-check" },
      { label: "증명서 발급", path: "/student/certificate-issuance" },
    ],
  },
];

export const PROFESSOR_MENU: MenuNode[] = [
  {
    label: "강의 관리",
    path: "",
    children: [
      { label: "강의 등록", path: "/professor/my-lectures" },
      { label: "강의계획서", path: "/professor/syllabus" },
      { label: "강의 자료", path: "/professor/course-materials" },
      { label: "과제 관리", path: "/professor/assignments" },
    ],
  },
  {
    label: "학생 관리",
    path: "",
    children: [
      { label: "수강생 출결", path: "/professor/student-attendance" },
      { label: "성적 관리", path: "/professor/grade-management" },
    ],
  },
  {
    label: "행정/연구",
    path: "/professor/research",
  },
];

export const ADMIN_MENU: MenuNode[] = [
  { label: "사용자 관리", path: "/admin/user-management" },
  { label: "강의 관리", path: "/admin/system-management" },
  {label: "휴학/복학 관리",path: "/admin/leave-management"},
  {label: "공지사항 관리",path: "/admin/notice-management"},
  { label: "학사일정 관리", path: "/admin/schedule-management" },
  { label: "등록금 관리", path: "/admin/tuition-management" },
];
