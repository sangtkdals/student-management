// =====================================================
// Common Types & Enums
// =====================================================

/** 사용자 권한 (m_type) */
export type UserRole = "STUDENT" | "PROFESSOR" | "ADMIN" | "student" | "professor" | "admin";

/** 학적 상태 (enrollment_status) */
export type EnrollmentStatus = "ENROLLED" | "LEAVE" | "GRADUATED";

/** 이수 구분 (s_type) */
export type SubjectType = "MAJOR" | "GENERAL" | "ELECTIVE";

/** 강의 상태 (course_status) */
export type CourseStatus = "OPEN" | "CLOSED" | "CANCELLED";

/** 출석 상태 (attendance_status) */
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

/** 학기 (1, 2학기 외 계절학기 고려 number) */
export type Semester = 1 | 2 | 3 | 4;

// =====================================================
// 1. Department (학과)
// =====================================================
export interface Department {
  deptCode: string; // PK
  deptName: string;
  collegeName: string;
  deptPhone?: string;
  deptOffice?: string;
}

// =====================================================
// 2. Member (회원: 학생, 교수, 관리자 통합)
// =====================================================
export interface User {
  id: string; // m_id (로그인 ID)
  password?: string; // m_pwd (보안상 프론트에서는 보통 제외하거나 등록시에만 사용)
  name: string; // m_name
  role: UserRole; // m_type
  memberNo: string; // m_no (학번/교번) - Unique Key
  email: string; // m_email
  phone?: string; // m_phone
  birthDate?: string; // m_birth (YYYY-MM-DD string)
  address?: string; // m_addr
  deptCode: string; // FK -> Department

  // 학생 전용 필드
  gradeLevel?: number; // stu_grade
  enrollmentStatus?: EnrollmentStatus;

  // 교수/직원 전용 필드
  position?: string;
  officeRoom?: string;
  majorField?: string;
  startDate?: string; // 입사일/입학일

  // UI용 확장 필드 (DB에는 없지만 조인해서 가져올 경우)
  departmentName?: string;
  department?: string; // for constants.tsx compatibility
  avatarUrl?: string; // 기존 코드 호환성 유지 (DB엔 없음)
}

// =====================================================
// 3. Subject (교과목 - 메타데이터)
// =====================================================
export interface Subject {
  subjectCode: string; // s_code (PK)
  subjectName: string; // s_name
  credit: number;
  subjectType: SubjectType;
  deptCode: string;
  description?: string;
}

// =====================================================
// 4. Course (개설 강좌 - 실제 열린 수업)
// =====================================================
export interface CourseSchedule {
  dayOfWeek: string;
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
}

export interface Course {
  courseCode: string; // PK
  academicYear: number;
  semester: number;
  subjectCode: string; // FK -> Subject
  courseClass: string; // 분반 (01, 02...)
  professorNo: string; // FK -> Member(Professor)
  maxStudents: number;
  classroom?: string;
  courseSchedules?: CourseSchedule[];
  courseTime?: string;

  // 강의 계획서 관련
  courseObjectives?: string;
  courseContent?: string;
  evaluationMethod?: Record<string, number>;
  textbookInfo?: string;
  status: CourseStatus;

  // UI 표시용 (Join된 데이터)
  subjectName?: string;
  professorName?: string;
  credit?: number; // subject 테이블에서 가져옴
  deptCode?: string; // 추가: 학과 코드
  subject?: Subject; // For filtering by type
  currentStudents?: number; // From DTO
}

// =====================================================
// 5 & 6. Board & Post (게시판)
// =====================================================
export interface Board {
  boardId: number;
  boardCode: string;
  boardName: string;
  writeAuth: "ADMIN" | "PROFESSOR" | "ALL";
}

export interface Post {
  postId: number;
  boardId: number;
  postTitle: string;
  postContent: string;
  writerId: string;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;

  // UI용
  writerName?: string;
  author?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  attachmentId: number;
  postId: number;
  filename: string;
}

// =====================================================
// 7. Tuition (등록금)
// =====================================================
export interface Tuition {
  tuitionId: number;
  studentNo: string;
  academicYear: number;
  semester: number;
  tuitionAmount: number;
  scholarshipAmount: number;
  paidAmount: number;
  billDate?: string;
  dueDate?: string;
  paidDate?: string;
  paymentMethod?: string;
  receiptNo?: string;
  paymentStatus: "UNPAID" | "PAID" | "OVERDUE";
}

// =====================================================
// 8. Leave Application (휴학 신청)
// =====================================================
export interface LeaveApplication {
  applicationId: number;
  studentNo: string;
  leaveType: "GENERAL" | "MILITARY" | "ILLNESS" | "PREGNANCY";
  startYear: number;
  startSemester: number;
  endYear: number;
  endSemester: number;
  reason: string;
  applicationDate: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  approvalDate?: string;
  approverId?: string;
  rejectReason?: string;
}

// =====================================================
// 9. Enrollment (수강 신청)
// =====================================================
export interface Enrollment {
  enrollmentId: number;
  studentNo: string;
  courseCode: string;
  enrollmentDate: string;
  status: "ENROLLED" | "DROPPED" | "COMPLETED";
  cancelDate?: string;
}

// =====================================================
// 10. Grade (성적)
// =====================================================
export interface Grade {
  gradeId: number;
  enrollmentId: number;

  midtermScore?: number;
  finalScore?: number;
  assignmentScore?: number;
  attendanceScore?: number;
  presentationScore?: number;
  totalScore?: number;

  gradeLetter?: string; // A+, B0 ...
  gradePoint?: number; // 4.5, 3.0 ...

  // UI용 편의 필드 (Enrollment -> Course -> Subject Join)
  courseName?: string;
  courseId?: string; // for constants.tsx compatibility
  credits?: number; // for constants.tsx compatibility
  letterGrade?: string; // for constants.tsx compatibility
  gpa?: number; // for constants.tsx compatibility
  courseCode?: string;
  credit?: number;
  year?: number; // Course.academicYear
  semester?: number; // Course.semester
}

// =====================================================
// 11. Attendance (출석부)
// =====================================================
export interface Attendance {
  attendanceId: number;
  enrollmentId: number;
  attendanceDate: string; // YYYY-MM-DD
  period: number; // 교시
  status: AttendanceStatus;
  remark?: string;
}

// =====================================================
// 12. Course Evaluation (강의 평가)
// =====================================================
export interface CourseEvaluation {
  evaluationId: number;
  courseCode: string;
  studentNo: string;
  eval1: number;
  eval2: number;
  eval3: number;
  eval4: number;
  eval5: number;
  totalScore: number;
  comment?: string;
  evaluationDate: string;
}

// =====================================================
// 13. Academic Schedule (학사 일정)
// =====================================================
export interface AcademicSchedule {
  scheduleId: number;
  academicYear: number;
  semester: number;
  scheduleTitle: string;
  scheduleContent?: string;
  startDate: string;
  endDate: string;
  backgroundColor?: string;
  category?: "academic" | "holiday" | "event";
  recurrenceType?: string;
}

// =====================================================
// Mock Data Types (Not in DB)
// =====================================================

export interface StudentRecord {
  id: string;
  name: string;
  department: string;
  attendance: "Present" | "Absent" | "Late";
  grade: string | null;
}
