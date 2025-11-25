import React, { useState, useEffect } from 'react';
import { Card, Table, Button } from './ui';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../api/services';

interface CourseData {
    id: string;
    name: string;
    professor: string;
    credits: number;
    department: string;
    time: string;
    room: string;
}

export const AdminCourseManagementConnected: React.FC = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newCourse, setNewCourse] = useState({
        courseCode: '',
        courseName: '',
        credits: 3,
        profId: '',
        classroom: '',
        courseTime: '',
        maxStudents: 30
    });

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setIsLoading(true);
            const data = await getAllCourses();

            const mappedCourses: CourseData[] = data.map((course: any) => ({
                id: course.courseCode || course.coursecode || '',
                name: course.courseName || course.coursename || '',
                professor: course.profId || course.profid || '',
                credits: course.credits || 3,
                department: '', // 백엔드에서 조인 필요
                time: course.courseTime || course.coursetime || '',
                room: course.classroom || ''
            }));

            setCourses(mappedCourses);
        } catch (error) {
            console.error('Failed to load courses:', error);
            alert('강의 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCourse.courseCode || !newCourse.courseName) {
            alert('과목코드와 과목명을 입력해주세요.');
            return;
        }

        try {
            await createCourse(newCourse);
            alert('강의가 개설되었습니다.');
            setNewCourse({
                courseCode: '',
                courseName: '',
                credits: 3,
                profId: '',
                classroom: '',
                courseTime: '',
                maxStudents: 30
            });
            setIsCreating(false);
            await loadCourses();
        } catch (error) {
            console.error('Failed to create course:', error);
            alert('강의 개설에 실패했습니다.');
        }
    };

    const handleDelete = async (courseCode: string) => {
        if (window.confirm('정말 이 강의를 삭제하시겠습니까?')) {
            try {
                await deleteCourse(courseCode);
                alert('강의가 삭제되었습니다.');
                await loadCourses();
            } catch (error) {
                console.error('Failed to delete course:', error);
                alert('강의 삭제에 실패했습니다.');
            }
        }
    };

    if (isLoading) {
        return (
            <Card title="강의 관리">
                <div className="flex justify-center items-center py-12">
                    <div className="text-slate-500">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="강의 관리">
            <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-slate-600">
                    총 <span className="font-bold text-brand-blue">{courses.length}</span>개 강의
                </p>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? '취소' : '새 강의 개설'}
                </Button>
            </div>

            {isCreating && (
                <div className="mb-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">새 강의 개설</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">과목코드</label>
                            <input
                                type="text"
                                value={newCourse.courseCode}
                                onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="CS101"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">과목명</label>
                            <input
                                type="text"
                                value={newCourse.courseName}
                                onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="컴퓨터과학개론"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">담당교수 ID</label>
                            <input
                                type="text"
                                value={newCourse.profId}
                                onChange={(e) => setNewCourse({ ...newCourse, profId: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="P001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">학점</label>
                            <input
                                type="number"
                                value={newCourse.credits}
                                onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                min="1"
                                max="6"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">강의실</label>
                            <input
                                type="text"
                                value={newCourse.classroom}
                                onChange={(e) => setNewCourse({ ...newCourse, classroom: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="공학관 301"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">강의시간</label>
                            <input
                                type="text"
                                value={newCourse.courseTime}
                                onChange={(e) => setNewCourse({ ...newCourse, courseTime: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="월 09:00-10:30, 수 09:00-10:30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">최대 수강인원</label>
                            <input
                                type="number"
                                value={newCourse.maxStudents}
                                onChange={(e) => setNewCourse({ ...newCourse, maxStudents: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                        >
                            취소
                        </button>
                        <Button onClick={handleCreate}>개설하기</Button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <Table headers={['과목코드', '과목명', '담당교수', '학점', '개설학과', '시간', '강의실', '관리']}>
                    {courses.map(course => (
                        <tr key={course.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-mono text-slate-700">{course.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{course.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{course.professor}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{course.credits}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{course.department || '-'}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{course.time}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{course.room}</td>
                            <td className="px-6 py-4 text-sm">
                                <div className="flex gap-2">
                                    <button className="text-brand-blue hover:text-brand-blue-dark font-medium">수정</button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
        </Card>
    );
};
