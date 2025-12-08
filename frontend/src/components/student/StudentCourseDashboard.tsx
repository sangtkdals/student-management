import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useOutlet } from 'react-router-dom';
import { Course, CourseAnnouncement, Attendance, Grade, Assignment } from '../../types';
import { jwtDecode } from 'jwt-decode';
import { FaHome, FaBook, FaFileAlt, FaBullhorn, FaSignOutAlt } from 'react-icons/fa';

interface CourseAttendance {
  courseName: string;
  courseCode: string;
  attendance: Attendance[];
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const StudentCourseDashboard: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const outlet = useOutlet();
  const [activeView, setActiveView] = useState('home');
  const [course, setCourse] = useState<Course | null>(null);
  const [announcements, setAnnouncements] = useState<CourseAnnouncement[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | undefined }>({});
  const [submissionContents, setSubmissionContents] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('인증 토큰이 없습니다.');
        const response = await fetch(`/api/courses/${courseCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setCourse(await response.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (courseCode) {
      fetchCourseDetail();
    }
  }, [courseCode]);
  
  useEffect(() => {
    const fetchDataForView = async () => {
      const token = localStorage.getItem('token');
      if (!token || !courseCode) return;

      try {
        if (activeView === 'home') {
            if (attendance.length === 0) {
              const attendanceResponse = await fetch(`/api/attendance/student`, { headers: { Authorization: `Bearer ${token}` } });
              if (!attendanceResponse.ok) throw new Error('출결 정보 로딩 실패');
              const allAttendanceData: CourseAttendance[] = await attendanceResponse.json();
              const currentCourseAttendance = allAttendanceData.find(a => a.courseCode === courseCode);
              if (currentCourseAttendance) setAttendance(currentCourseAttendance.attendance);
            }
            if (!grade) {
               const gradesResponse = await fetch(`/api/grades`, { headers: { Authorization: `Bearer ${token}` } });
               if (!gradesResponse.ok) throw new Error('성적 정보 로딩 실패');
               const allGradesData: Grade[] = await gradesResponse.json();
               const currentCourseGrade = allGradesData.find(g => g.courseCode === courseCode);
               if (currentCourseGrade) setGrade(currentCourseGrade);
            }
        }
        
        if ((activeView === 'home' || activeView === 'announcements') && announcements.length === 0) {
            const announcementsResponse = await fetch(`/api/course-notices/${courseCode}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!announcementsResponse.ok) throw new Error('공지사항 로딩 실패');
            setAnnouncements(await announcementsResponse.json());
        }

        if (activeView === 'assignments' && assignments.length === 0) {
            const assignmentsResponse = await fetch(`/api/assignments/course/${courseCode}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!assignmentsResponse.ok) throw new Error('과제 정보 로딩 실패');
            setAssignments(await assignmentsResponse.json());
        }

      } catch (e) {
        setError(e instanceof Error ? e.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };
    
    fetchDataForView();
  }, [activeView, courseCode]);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">오류: {error}</div>;
  if (!course) return <div className="p-8 text-center">강의 정보를 찾을 수 없습니다.</div>;

  const handleFileChange = (assignmentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFiles(prev => ({ ...prev, [assignmentId]: event.target.files[0] }));
    }
  };

  const handleContentChange = (assignmentId: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSubmissionContents(prev => ({ ...prev, [assignmentId]: event.target.value }));
  };

  const handleAssignmentSubmit = async (assignmentId: number) => {
    const selectedFile = selectedFiles[assignmentId];
    const content = submissionContents[assignmentId] || "";

    if (!selectedFile && content.trim() === "") {
      alert("내용을 작성하거나 파일을 첨부해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const decodedToken = jwtDecode<{ sub: string }>(token);
    const studentId = decodedToken.sub;

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("content", content);

    try {
      const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("과제가 성공적으로 제출되었습니다.");
        setSelectedFiles(prev => ({ ...prev, [assignmentId]: undefined }));
        setSubmissionContents(prev => ({ ...prev, [assignmentId]: "" }));
        // Optionally, refresh submission status
      } else {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "과제 제출에 실패했습니다.");
        } catch (jsonError) {
          throw new Error(errorText || "과제 제출에 실패했습니다.");
        }
      }
    } catch (e) {
        alert(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  const sidebarNavItems = [
    { id: 'home', name: 'Home', icon: FaHome },
    { id: 'syllabus', name: '수업계획서', icon: FaBook },
    { id: 'assignments', name: '과제', icon: FaFileAlt },
    { id: 'announcements', name: '공지사항', icon: FaBullhorn },
  ];

  const renderMainContent = () => {
    switch (activeView) {
      case 'syllabus':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">수업계획서</h1>
            <div className="space-y-6">
              <DetailSection title="과목 개요">
                <p className="whitespace-pre-wrap">{course.courseObjectives || "내용이 없습니다."}</p>
              </DetailSection>
              <DetailSection title="강의 내용">
                <p className="whitespace-pre-wrap">{course.courseContent || "내용이 없습니다."}</p>
              </DetailSection>
              <DetailSection title="평가 방법">
                {course.evaluationMethod ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(
                      typeof course.evaluationMethod === 'string' 
                        ? JSON.parse(course.evaluationMethod) 
                        : course.evaluationMethod
                    ).map(([key, value]) => (
                      <li key={key}>{`${key}: ${value as number}%`}</li>
                    ))}
                  </ul>
                ) : (
                  <p>내용이 없습니다.</p>
                )}
              </DetailSection>
              <DetailSection title="교재 및 참고자료">
                <p className="whitespace-pre-wrap">{course.textbookInfo || "내용이 없습니다."}</p>
              </DetailSection>
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">과제</h1>
            <div className="space-y-6">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.assignmentId} className="p-4 border rounded-md">
                    <h3 className="text-lg font-bold">{assignment.assignmentTitle}</h3>
                    <p className="text-sm text-gray-500">마감일: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    <p className="mt-2">{assignment.assignmentDesc}</p>
                    <div className="mt-4 pt-4 border-t">
                      {assignment.submission ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-700">제출된 과제:</p>
                          <div className="mt-2 p-3 bg-white rounded-md border text-sm">
                            <p><strong>내용:</strong> {assignment.submission.content}</p>
                            {assignment.submission.filePath && <p><strong>파일명:</strong> {assignment.submission.filePath.split(/[\\/]/).pop()?.split('_').slice(1).join('_')}</p>}
                            <p><strong>제출일:</strong> {new Date(assignment.submission.submissionDate).toLocaleString('ko-KR')}</p>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => alert("수정 기능은 현재 구현되지 않았습니다.")}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                            >
                              수정
                            </button>
                            <button
                              // onClick={() => handleAssignmentDelete(assignment.submission.submissionId)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <textarea
                              rows={4}
                              placeholder="과제 내용을 100자 이내로 입력하세요."
                              maxLength={100}
                              value={submissionContents[assignment.assignmentId] || ''}
                              onChange={(e) => handleContentChange(assignment.assignmentId, e)}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                          <div className="flex items-center">
                            <input type="file" onChange={(e) => handleFileChange(assignment.assignmentId, e)} className="text-sm"/>
                            <button
                              onClick={() => handleAssignmentSubmit(assignment.assignmentId)}
                              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                              제출
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>등록된 과제가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">공지사항</h1>
            {announcements.length > 0 ? (
              <ul className="space-y-4">
                {announcements.map((notice) => (
                  <li key={notice.noticeId} className="border-b pb-2">
                    <Link to={`/student/my-classroom/${courseCode}/announcements/${notice.noticeId}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                      {notice.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">작성일: {new Date(notice.createdAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-12">게시된 공지사항이 없습니다.</div>
            )}
          </div>
        );
      case 'home':
      default:
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{course.subjectName} 홈</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">출결현황</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">주차</th>
                          {Array.from({ length: 15 }, (_, i) => i + 1).map(week => (<th key={week} className="p-2 border">{week}</th>))}
                          <th className="p-2 border">참여도(출석/결석)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border font-semibold bg-gray-50">출결</td>
                          {Array.from({ length: 15 }, (_, i) => i + 1).map(week => {
                            const record = attendance.find(a => a.period === week);
                            let statusSymbol = '-';
                            if (record) {
                              if (record.status === 'PRESENT') statusSymbol = 'O';
                              else if (record.status === 'ABSENT') statusSymbol = 'X';
                            }
                            return <td key={week} className="p-2 border">{statusSymbol}</td>;
                          })}
                          <td className="p-2 border">
                            {attendance.filter(a => a.status === 'PRESENT').length} / {attendance.filter(a => a.status === 'ABSENT').length}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-500 mt-2">※출결 표시 구분: 출석 O, 결석 X, 수업없음 -</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">학습참여현황</h3>
                  {grade ? (
                    <table className="w-full text-sm text-center">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">중간고사</th>
                          <th className="p-2 border">기말고사</th>
                          <th className="p-2 border">과제</th>
                          <th className="p-2 border">총점</th>
                          <th className="p-2 border">학점</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border">{grade.midtermScore ?? '-'}</td>
                          <td className="p-2 border">{grade.finalScore ?? '-'}</td>
                          <td className="p-2 border">{grade.assignmentScore ?? '-'}</td>
                          <td className="p-2 border">{grade.totalScore ?? '-'}</td>
                          <td className="p-2 border">{grade.gradeLetter ?? '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (<div className="text-center text-gray-500">학습 참여 정보가 없습니다.</div>)}
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">최근게시글</h3>
                  {announcements.length > 0 ? (
                    <ul className="space-y-2">
                      {announcements.slice(0, 5).map((notice) => (
                        <li key={notice.noticeId} className="text-gray-700 hover:text-blue-600">
                          <Link to={`/student/my-classroom/${courseCode}/announcements/${notice.noticeId}`}>{notice.title}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (<div className="text-center text-gray-500">최근 게시글이 없습니다.</div>)}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{course.subjectName}</h2>
          <p className="text-sm text-gray-500">{course.professorName} 교수님</p>
        </div>
        <nav className="flex-grow">
          <ul>
            {sidebarNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center w-full p-4 text-left text-gray-600 hover:bg-gray-200 ${activeView === item.id ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t">
          <ul>
             <li>
                <Link to="/student/my-classroom" className="flex items-center p-4 text-gray-600 hover:bg-gray-200">
                  <FaSignOutAlt className="w-5 h-5 mr-3" />
                  나가기
                </Link>
              </li>
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {outlet ? <Outlet /> : renderMainContent()}
      </main>
    </div>
  );
};

export default StudentCourseDashboard;
