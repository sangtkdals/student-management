import React, { useState, useMemo, useEffect } from 'react';
import type { User, Course } from '../types';
import { Card, Table, Button } from './ui';
import { getAllCourses, getEnrollmentsByStudent, createEnrollment, deleteEnrollment } from '../api/services';

interface CourseWithEnrollment extends Course {
    enrollmentId?: number;
}

export const StudentCourseRegistrationConnected: React.FC<{ user: User }> = ({ user }) => {
    const [availableCourses, setAvailableCourses] = useState<CourseWithEnrollment[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<CourseWithEnrollment[]>([]);
    const [previewCourse, setPreviewCourse] = useState<CourseWithEnrollment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // 수강 가능한 모든 과목 로드
            const coursesData = await getAllCourses();

            // 내가 신청한 수강 내역 로드
            const enrollmentsData = await getEnrollmentsByStudent(user.id);

            // Course 데이터 매핑
            const mappedCourses: CourseWithEnrollment[] = coursesData.map((c: any) => ({
                id: c.courseCode || c.coursecode || c.id,
                name: c.courseName || c.coursename || '',
                code: c.courseCode || c.coursecode || '',
                professor: c.profId || c.profid || '',
                credits: c.credits || 0,
                time: c.courseTime || c.coursetime || '',
                room: c.classroom || '',
                maxStudents: c.maxStudents || c.maxstudents || 30,
                currentStudents: c.currentStudents || c.currentstudents || 0
            }));

            // Enrollment 데이터에서 courseCode로 과목 찾아서 enrollmentId 추가
            const enrolledCoursesWithId: CourseWithEnrollment[] = enrollmentsData
                .filter((e: any) => e.enrollmentStatus === 'ENROLLED' || e.enrollmentstatus === 'ENROLLED')
                .map((e: any) => {
                    const courseCode = e.courseCode || e.coursecode;
                    const course = mappedCourses.find(c => c.code === courseCode);
                    if (course) {
                        return {
                            ...course,
                            enrollmentId: e.enrollmentId || e.enrollmentid
                        };
                    }
                    return null;
                })
                .filter((c: any) => c !== null) as CourseWithEnrollment[];

            setAvailableCourses(mappedCourses);
            setEnrolledCourses(enrolledCoursesWithId);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalCredits = useMemo(() => {
        return enrolledCourses.reduce((sum, course) => sum + course.credits, 0);
    }, [enrolledCourses]);

    const coursesForTimetable = useMemo(() => {
        if (previewCourse && !enrolledCourses.some(c => c.id === previewCourse.id)) {
            return [...enrolledCourses, previewCourse];
        }
        return enrolledCourses;
    }, [enrolledCourses, previewCourse]);

    const addCourse = async (course: CourseWithEnrollment) => {
        if (enrolledCourses.some(c => c.id === course.id)) {
            return;
        }

        try {
            await createEnrollment({
                stuNo: user.id,
                courseCode: course.code
            });
            await loadData();
        } catch (error) {
            console.error('Failed to enroll:', error);
            alert('수강 신청에 실패했습니다.');
        }
    };

    const removeCourse = async (courseId: string) => {
        const course = enrolledCourses.find(c => c.id === courseId);
        if (!course || !course.enrollmentId) return;

        try {
            await deleteEnrollment(course.enrollmentId);
            await loadData();
        } catch (error) {
            console.error('Failed to drop course:', error);
            alert('수강 취소에 실패했습니다.');
        }
    };

    // 시간표 시각화 컴포넌트
    const VisualTimetable: React.FC<{ courses: CourseWithEnrollment[], previewCourseId?: string | null }> = ({ courses, previewCourseId = null }) => {
        const days = ['월', '화', '수', '목', '금'];
        const timeLabels = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`);
        const dayMap: { [key: string]: number } = { '월': 0, '화': 1, '수': 2, '목': 3, '금': 4 };
        const courseColors = [
            'bg-blue-100 border-blue-300 text-blue-800',
            'bg-green-100 border-green-300 text-green-800',
            'bg-purple-100 border-purple-300 text-purple-800',
            'bg-yellow-100 border-yellow-300 text-yellow-800',
            'bg-pink-100 border-pink-300 text-pink-800',
            'bg-indigo-100 border-indigo-300 text-indigo-800'
        ];
        const hourHeight = 60;

        const parseTime = (timeStr: string) => {
            if (!timeStr) return [];
            const parts = timeStr.split(',').map(s => s.trim());
            const parsedSlots: { day: string, startTime: string, endTime: string }[] = [];
            parts.forEach(part => {
                const match = part.match(/([월화수목금])\s*(\d{2}:\d{2})-(\d{2}:\d{2})/);
                if (match) {
                    const [, day, startTime, endTime] = match;
                    parsedSlots.push({ day, startTime, endTime });
                }
            });
            return parsedSlots;
        };

        const getCourseBlocks = () => {
            const blocks: React.ReactNode[] = [];
            courses.forEach((course, index) => {
                const slots = parseTime(course.time);
                const color = courseColors[index % courseColors.length];
                const isPreview = course.id === previewCourseId;

                slots.forEach((slot, slotIndex) => {
                    const dayIdx = dayMap[slot.day];
                    if (dayIdx === undefined) return;

                    const [startHour, startMin] = slot.startTime.split(':').map(Number);
                    const [endHour, endMin] = slot.endTime.split(':').map(Number);
                    const startMinutes = (startHour - 9) * 60 + startMin;
                    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

                    const top = (startMinutes / 60) * hourHeight;
                    const height = (duration / 60) * hourHeight;

                    blocks.push(
                        <div
                            key={`${course.id}-${slotIndex}`}
                            className={`absolute border-l-4 ${color} ${isPreview ? 'opacity-50 border-dashed' : ''} p-2 overflow-hidden rounded shadow-sm`}
                            style={{
                                left: `${dayIdx * 20 + 0.5}%`,
                                width: '19%',
                                top: `${top}px`,
                                height: `${height}px`,
                            }}
                        >
                            <div className="text-xs font-bold truncate">{course.name}</div>
                            <div className="text-xs truncate">{course.room}</div>
                        </div>
                    );
                });
            });
            return blocks;
        };

        return (
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className="grid grid-cols-6 border-b border-brand-gray">
                        <div className="border-r border-brand-gray"></div>
                        {days.map(day => (
                            <div key={day} className="text-center py-2 font-semibold text-slate-700 border-r border-brand-gray last:border-r-0">{day}</div>
                        ))}
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-6">
                            <div className="space-y-0">
                                {timeLabels.map(time => (
                                    <div key={time} className="border-r border-b border-brand-gray bg-slate-50 text-xs text-center py-2" style={{ height: `${hourHeight}px` }}>{time}</div>
                                ))}
                            </div>
                            <div className="col-span-5 relative" style={{ height: `${hourHeight * timeLabels.length}px` }}>
                                <div className="absolute inset-0 grid grid-cols-5">
                                    {days.map(day => (
                                        <div key={day} className="border-r border-brand-gray last:border-r-0">
                                            {timeLabels.map(time => (
                                                <div key={time} className="border-b border-brand-gray" style={{ height: `${hourHeight}px` }}></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                {getCourseBlocks()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-slate-600">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card title="내 시간표">
                        <div className="pt-8">
                            <VisualTimetable courses={coursesForTimetable} previewCourseId={previewCourse?.id} />
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <h4 className="font-bold text-slate-700 mb-2">신청 내역</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                {enrolledCourses.length}개 과목 ({totalCredits}학점)을 신청했습니다.
                            </p>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                                    <div key={course.id} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                        <div className="truncate pr-2">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{course.name}</p>
                                            <p className="text-xs text-slate-500">{course.credits}학점</p>
                                        </div>
                                        <button onClick={() => removeCourse(course.id)} className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 shrink-0">삭제</button>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-500 text-center py-4">신청한 과목이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="수강 가능 과목">
                        <div className="max-h-[70vh] overflow-y-auto">
                            <Table headers={['과목명', '교수', '시간', '학점', '신청']}>
                                {availableCourses.map(course => {
                                    const isSelected = enrolledCourses.some(c => c.id === course.id);
                                    return (
                                        <tr
                                            key={course.id}
                                            onMouseEnter={() => setPreviewCourse(course)}
                                            onMouseLeave={() => setPreviewCourse(null)}
                                            className="transition-colors hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{course.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{course.professor}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{course.time.split(',')[0]}...</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{course.credits}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Button size="sm" onClick={() => addCourse(course)} disabled={isSelected}>
                                                    {isSelected ? '완료' : '추가'}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
