import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Course, Assignment } from "../../types";
import { jwtDecode } from "jwt-decode";

// ... (DetailSection component remains the same)
const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">{title}</h2>
        <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            active ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {children}
    </button>
);

const StudentCourseDetail: React.FC = () => {
    const { courseCode } = useParams<{ courseCode: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [assignments, setAssignments] = useState<any[]>([]); // Allow any shape for debugging
    const [activeTab, setActiveTab] = useState('syllabus');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
    const [editingSubmission, setEditingSubmission] = useState<{ id: number; content: string } | null>(null);
    
    const fetchCourseData = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("인증 토큰이 없습니다.");

            const courseResponse = await fetch(`/api/courses/${courseCode}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!courseResponse.ok) throw new Error(`HTTP error! status: ${courseResponse.status}`);
            const courseData = await courseResponse.json();
            setCourse(courseData);

            const assignmentsResponse = await fetch(`/api/assignments/course/${courseCode}`, {
                 headers: { Authorization: `Bearer ${token}` },
            });
            if(!assignmentsResponse.ok) throw new Error(`HTTP error! status: ${assignmentsResponse.status}`);
            const assignmentsData = await assignmentsResponse.json();
            console.log("Fetched Assignments Data from API:", JSON.stringify(assignmentsData, null, 2));
            setAssignments(assignmentsData);

        } catch (e) {
            setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }, [courseCode]);

    useEffect(() => {
        if (courseCode) {
            fetchCourseData();
        }
    }, [courseCode, fetchCourseData]);

    const handleFileChange = (assignmentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: event.target.files[0] }));
        }
    };

    const handleAssignmentSubmit = async (assignmentId: number, content: string) => {
        const selectedFile = selectedFiles[assignmentId];
        // Allow submission with only content and no file
        if (!selectedFile && !content) {
            alert("내용을 입력하거나 파일을 선택해주세요.");
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
        formData.append("content", content); // Add content to the form data

        try {
            const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                alert("과제가 성공적으로 제출되었습니다.");
                setSelectedFiles(prev => {
                    const newFiles = { ...prev };
                    delete newFiles[assignmentId];
                    return newFiles;
                });
                fetchCourseData(); // Refresh assignments to show submission status
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "과제 제출에 실패했습니다.");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
        }
    };

    const handleAssignmentUpdate = async (submissionId: number) => {
        const token = localStorage.getItem("token");
        if (!token || !editingSubmission) return;

        const formData = new FormData();
        // Check if a new file is selected for the specific assignment being edited.
        // The assignmentId can be retrieved from the assignments array based on the submissionId.
        const assignment = assignments.find(a => a.submission?.submissionId === submissionId);
        if (assignment && selectedFiles[assignment.assignmentId]) {
            formData.append("file", selectedFiles[assignment.assignmentId] as File);
        }
        formData.append("content", editingSubmission.content);

        try {
            const response = await fetch(`/api/assignments/submissions/${submissionId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                alert("과제가 성공적으로 수정되었습니다.");
                setEditingSubmission(null); // Exit editing mode
                if (assignment) {
                    setSelectedFiles(prev => ({ ...prev, [assignment.assignmentId]: null })); // Clear selected file for this assignment
                }
                fetchCourseData(); // Refresh data
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "과제 수정에 실패했습니다.");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
        }
    };


    const handleAssignmentDelete = async (submissionId: number) => {
        if (!window.confirm("정말로 제출한 과제를 삭제하시겠습니까?")) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch(`/api/assignments/submissions/${submissionId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                alert("과제가 성공적으로 삭제되었습니다.");
                fetchCourseData(); // Refresh assignments
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "과제 삭제에 실패했습니다.");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
        }
    };


    if (loading) return <div className="p-8 text-center">로딩 중...</div>;
    if (error) return <div className="p-8 text-center text-red-500">오류: {error}</div>;
    if (!course) return <div className="p-8 text-center">강의 정보를 찾을 수 없습니다.</div>;

    const renderSyllabus = () => (
        <div className="space-y-6 mt-4">
            <DetailSection title="과목 개요">
                <p className="whitespace-pre-wrap">{course.courseObjectives || "내용이 없습니다."}</p>
            </DetailSection>
            <DetailSection title="강의 내용">
                <p className="whitespace-pre-wrap">{course.courseContent || "내용이 없습니다."}</p>
            </DetailSection>
            <DetailSection title="평가 방법">
                {course.evaluationMethod ? (
                    <ul className="list-disc list-inside">
                        {Object.entries(course.evaluationMethod).map(([key, value]) => (
                            <li key={key}>{`${key}: ${value}%`}</li>
                        ))}
                    </ul>
                ) : <p>내용이 없습니다.</p>}
            </DetailSection>
            <DetailSection title="교재 및 참고자료">
                <p className="whitespace-pre-wrap">{course.textbookInfo || "내용이 없습니다."}</p>
            </DetailSection>
        </div>
    );
    
    const renderAssignments = () => {
        const now = new Date();

        return (
            <div className="space-y-6 mt-4">
                {assignments.length > 0 ? (
                    assignments.map((assignment) => {
                        const dueDate = new Date(assignment.dueDate);
                        const isPastDue = now > dueDate;
                        const submission = assignment.submission;

                        return (
                            <div key={assignment.assignmentId} className="p-4 border rounded-md shadow-sm bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{assignment.assignmentTitle}</h3>
                                        <p className="text-sm text-gray-500">
                                            마감일: {dueDate.toLocaleString('ko-KR', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                        </p>
                                    </div>
                                    {submission && (
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            submission.grade ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {submission.grade ? `채점 완료: ${submission.grade}점` : '제출 완료'}
                                    </span>
                                    )}
                                </div>

                                <p className="mt-2 text-gray-700">{assignment.assignmentDesc}</p>
                                
                                {/* Test Submission Data */}
                                <div className="mt-2 p-2 bg-gray-100 border rounded">
                                    <h4 className="text-xs font-bold">Test Submission Data:</h4>
                                    <pre className="text-xs whitespace-pre-wrap">
                                        {JSON.stringify(assignment.submission, null, 2) || "No submission data"}
                                    </pre>
                                </div>


                                <div className="mt-4 pt-4 border-t">
                                    {isPastDue && !submission ? (
                                        <p className="text-sm font-semibold text-red-600">과제가 마감되었습니다.</p>
                                    ) : editingSubmission?.id === submission?.submissionId ? (
                                        // Editing UI
                                        <div>
                                            <textarea
                                                value={editingSubmission.content}
                                                onChange={(e) => setEditingSubmission({ ...editingSubmission, content: e.target.value })}
                                                className="w-full p-2 border rounded-md"
                                                rows={4}
                                            />
                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(assignment.assignmentId, e)}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                <div className="ml-4 flex space-x-2">
                                                    <button
                                                        onClick={() => handleAssignmentUpdate(submission.submissionId)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                                    >
                                                        수정 완료
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSubmission(null)}
                                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : submission ? (
                                        // Submitted View
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">제출된 과제:</p>
                                            <div className="mt-2 p-3 bg-white rounded-md border text-sm">
                                                <p><strong>내용:</strong> {submission.content || "없음"}</p>
                                                <p><strong>파일명:</strong> {submission.filePath?.split('_').pop() || "없음"}</p>
                                                <p><strong>제출일:</strong> {new Date(submission.submissionDate).toLocaleString('ko-KR')}</p>
                                            </div>
                                            { !isPastDue &&
                                                <div className="mt-3 flex space-x-2">
                                                    <button
                                                        onClick={() => setEditingSubmission({ id: submission.submissionId, content: submission.content || '' })}
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleAssignmentDelete(submission.submissionId)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    ) : (
                                        // Submission Form
                                        <div>
                                            <textarea
                                                id={`content-${assignment.assignmentId}`}
                                                rows={4}
                                                className="w-full p-2 border rounded-md"
                                                placeholder="과제 내용을 입력하세요..."
                                            />
                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="file"
                                                    id={`file-upload-${assignment.assignmentId}`}
                                                    onChange={(e) => handleFileChange(assignment.assignmentId, e)}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const content = (document.getElementById(`content-${assignment.assignmentId}`) as HTMLTextAreaElement).value;
                                                        handleAssignmentSubmit(assignment.assignmentId, content);
                                                    }}
                                                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm disabled:bg-gray-400"
                                                >
                                                    제출
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">등록된 과제가 없습니다.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{course.subjectName}</h1>
                <p className="mt-2 text-gray-600">
                    {course.professorName} 교수님
                    <span className="mx-2">|</span>
                    <span className="font-mono bg-gray-100 p-1 rounded text-sm">{course.courseCode}</span>
                </p>
            </div>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <TabButton active={activeTab === 'syllabus'} onClick={() => setActiveTab('syllabus')}>
                        강의계획서
                    </TabButton>
                    <TabButton active={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')}>
                        과제
                    </TabButton>
                    {/* Add other tabs like Announcements here */}
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'syllabus' && renderSyllabus()}
                {activeTab === 'assignments' && renderAssignments()}
            </div>
        </div>
    );
};

export default StudentCourseDetail;
