import { apiCall, API_ENDPOINTS } from './config';

// 사용자 로그인
export const loginUser = async (mId: string, mPwd: string) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.users}/login`, {
      method: 'POST',
      body: JSON.stringify({ mId, mPwd }),
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 사용자 정보 조회
export const getUserById = async (mId: string) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.users}/${mId}`);
    return response;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// 모든 사용자 조회
export const getAllUsers = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.users);
    return response;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

// 사용자 생성
export const createUser = async (userData: any) => {
  try {
    const response = await apiCall(API_ENDPOINTS.users, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// 사용자 수정
export const updateUser = async (mId: string, userData: any) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.users}/${mId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// 사용자 삭제
export const deleteUser = async (mId: string) => {
  try {
    await apiCall(`${API_ENDPOINTS.users}/${mId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// 비밀번호 변경
export const changePassword = async (mId: string, currentPassword: string, newPassword: string) => {
  try {
    await apiCall(`${API_ENDPOINTS.users}/${mId}/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// 강의 관련
export const getAllCourses = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.courses);
    return response;
  } catch (error) {
    console.error('Get all courses error:', error);
    throw error;
  }
};

export const createCourse = async (courseData: any) => {
  try {
    const response = await apiCall(API_ENDPOINTS.courses, {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
    return response;
  } catch (error) {
    console.error('Create course error:', error);
    throw error;
  }
};

export const updateCourse = async (courseCode: string, courseData: any) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.courses}/${courseCode}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
    return response;
  } catch (error) {
    console.error('Update course error:', error);
    throw error;
  }
};

export const deleteCourse = async (courseCode: string) => {
  try {
    await apiCall(`${API_ENDPOINTS.courses}/${courseCode}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    throw error;
  }
};

// 등록금 관련
export const getAllTuition = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.tuition);
    return response;
  } catch (error) {
    console.error('Get all tuition error:', error);
    throw error;
  }
};

export const getTuitionByStudent = async (stuNo: string) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.tuition}/student/${stuNo}`);
    return response;
  } catch (error) {
    console.error('Get tuition by student error:', error);
    throw error;
  }
};

export const createTuition = async (tuitionData: any) => {
  try {
    const response = await apiCall(API_ENDPOINTS.tuition, {
      method: 'POST',
      body: JSON.stringify(tuitionData),
    });
    return response;
  } catch (error) {
    console.error('Create tuition error:', error);
    throw error;
  }
};

export const updateTuition = async (tuitionId: number, tuitionData: any) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.tuition}/${tuitionId}`, {
      method: 'PUT',
      body: JSON.stringify(tuitionData),
    });
    return response;
  } catch (error) {
    console.error('Update tuition error:', error);
    throw error;
  }
};

export const deleteTuition = async (tuitionId: number) => {
  try {
    await apiCall(`${API_ENDPOINTS.tuition}/${tuitionId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete tuition error:', error);
    throw error;
  }
};

// 휴학/복학 관련
export const getAllLeaveApplications = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.leaveOfAbsence);
    return response;
  } catch (error) {
    console.error('Get all leave applications error:', error);
    throw error;
  }
};

export const createLeaveApplication = async (applicationData: any) => {
  try {
    const response = await apiCall(API_ENDPOINTS.leaveOfAbsence, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    return response;
  } catch (error) {
    console.error('Create leave application error:', error);
    throw error;
  }
};

export const getLeaveApplicationById = async (applicationId: number) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.leaveOfAbsence}/${applicationId}`);
    return response;
  } catch (error) {
    console.error('Get leave application by ID error:', error);
    throw error;
  }
};

export const getLeaveApplicationsByStudent = async (stuNo: string) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.leaveOfAbsence}/student/${stuNo}`);
    return response;
  } catch (error) {
    console.error('Get leave applications by student error:', error);
    throw error;
  }
};

export const getLeaveApplicationsByStatus = async (approvalStatus: string) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.leaveOfAbsence}/status/${approvalStatus}`);
    return response;
  } catch (error) {
    console.error('Get leave applications by status error:', error);
    throw error;
  }
};

export const updateLeaveApplicationStatus = async (applicationId: number, statusData: { approvalStatus: string, approverId?: string, rejectReason?: string }) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.leaveOfAbsence}/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
    return response;
  } catch (error) {
    console.error('Update leave application status error:', error);
    throw error;
  }
};

export const cancelLeaveApplication = async (applicationId: number) => {
  try {
    await apiCall(`${API_ENDPOINTS.leaveOfAbsence}/${applicationId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Cancel leave application error:', error);
    throw error;
  }
};

// Wrapper functions for backward compatibility
export const approveLeaveApplication = async (applicationId: number, approverId: string = 'admin') => {
  return updateLeaveApplicationStatus(applicationId, { approvalStatus: 'APPROVED', approverId });
};

export const rejectLeaveApplication = async (applicationId: number, rejectReason: string = '', approverId: string = 'admin') => {
  return updateLeaveApplicationStatus(applicationId, { approvalStatus: 'REJECTED', approverId, rejectReason });
};

// 공지사항 관련
export const getAllAnnouncements = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.announcements);
    return response;
  } catch (error) {
    console.error('Get all announcements error:', error);
    throw error;
  }
};

export const createAnnouncement = async (announcementData: any) => {
  try {
    const response = await apiCall(API_ENDPOINTS.announcements, {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
    return response;
  } catch (error) {
    console.error('Create announcement error:', error);
    throw error;
  }
};

export const updateAnnouncement = async (postId: number, announcementData: any) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.announcements}/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
    return response;
  } catch (error) {
    console.error('Update announcement error:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (postId: number) => {
  try {
    await apiCall(`${API_ENDPOINTS.announcements}/${postId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    throw error;
  }
};

// 학사일정 관련
export const getAllCalendarEvents = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.calendarEvents);
    return response;
  } catch (error) {
    console.error('Get all calendar events error:', error);
    throw error;
  }
};

export const createCalendarEvent = async (eventData: any) => {
  try {
    const response = await apiCall(API_ENDPOINTS.calendarEvents, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return response;
  } catch (error) {
    console.error('Create calendar event error:', error);
    throw error;
  }
};

export const updateCalendarEvent = async (scheduleId: number, eventData: any) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.calendarEvents}/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return response;
  } catch (error) {
    console.error('Update calendar event error:', error);
    throw error;
  }
};

export const deleteCalendarEvent = async (scheduleId: number) => {
  try {
    await apiCall(`${API_ENDPOINTS.calendarEvents}/${scheduleId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete calendar event error:', error);
    throw error;
  }
};

// 수강신청 관련
export const getAllEnrollments = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.enrollments);
    return response;
  } catch (error) {
    console.error('Get all enrollments error:', error);
    throw error;
  }
};

export const getEnrollmentsByStudent = async (stuNo: string) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.enrollments}/student/${stuNo}`);
    return response;
  } catch (error) {
    console.error('Get enrollments by student error:', error);
    throw error;
  }
};

export const getEnrollmentsByCourse = async (courseCode: string) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.enrollments}/course/${courseCode}`);
    return response;
  } catch (error) {
    console.error('Get enrollments by course error:', error);
    throw error;
  }
};

export const createEnrollment = async (enrollmentData: any) => {
  try {
    const response = await apiCall(API_ENDPOINTS.enrollments, {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
    return response;
  } catch (error) {
    console.error('Create enrollment error:', error);
    throw error;
  }
};

export const deleteEnrollment = async (enrollmentId: number) => {
  try {
    await apiCall(`${API_ENDPOINTS.enrollments}/${enrollmentId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    throw error;
  }
};

// 성적 관련
export const getAllGrades = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.grades);
    return response;
  } catch (error) {
    console.error('Get all grades error:', error);
    throw error;
  }
};

export const getGradeByEnrollment = async (enrollmentId: number) => {
  try {
    const response = await apiCall(`${API_ENDPOINTS.grades}/enrollment/${enrollmentId}`);
    return response;
  } catch (error) {
    console.error('Get grade by enrollment error:', error);
    throw error;
  }
};
