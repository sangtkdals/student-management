// API 기본 설정
// Vite 프록시 설정으로 인해 '/api'로 시작하는 요청은 자동으로 백엔드로 전달됨
export const API_BASE_URL = '/api';

// API 엔드포인트
export const API_ENDPOINTS = {
  // 사용자 관련
  login: '/users/login',
  users: '/users',

  // 수강 관련
  courses: '/courses',
  enrollments: '/enrollments',

  // 성적 관련
  grades: '/grades',

  // 등록금 관련
  tuition: '/tuition',

  // 휴학/복학 관련
  leaveOfAbsence: '/leave-of-absence',

  // 공지사항 관련
  announcements: '/announcements',

  // 학사일정 관련
  calendarEvents: '/calendar-events',
};

// HTTP 요청 헤더
export const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// API 호출 헬퍼 함수
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
