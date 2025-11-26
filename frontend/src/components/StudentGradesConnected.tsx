import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Card, Table } from './ui';
import { getEnrollmentsByStudent, getAllGrades, getAllCourses } from '../api/services';

interface GradeData {
    courseCode: string;
    courseName: string;
    credits: number;
    letterGrade: string;
    gradePoint: number;
    totalScore: number;
    midtermScore: number;
    finalScore: number;
    assignmentScore: number;
    attendanceScore: number;
}

export const StudentAllGradesConnected: React.FC<{ user: User }> = ({ user }) => {
    const [grades, setGrades] = useState<GradeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [overallGPA, setOverallGPA] = useState(0);

    useEffect(() => {
        loadGrades();
    }, []);

    const loadGrades = async () => {
        try {
            setLoading(true);

            // 내 수강 내역 가져오기
            const enrollments = await getEnrollmentsByStudent(user.id);

            // 모든 성적 가져오기
            const allGrades = await getAllGrades();

            // 모든 과목 정보 가져오기
            const allCourses = await getAllCourses();

            // enrollment와 grade를 매칭
            const gradeData: GradeData[] = [];
            let totalGradePoints = 0;
            let totalCredits = 0;

            for (const enrollment of enrollments) {
                const enrollmentId = enrollment.enrollmentId || enrollment.enrollmentid;
                const courseCode = enrollment.courseCode || enrollment.coursecode;

                // 해당 enrollment의 성적 찾기
                const gradeRecord = allGrades.find((g: any) =>
                    (g.enrollmentId || g.enrollmentid) === enrollmentId
                );

                if (gradeRecord) {
                    // 과목 정보 찾기
                    const course = allCourses.find((c: any) =>
                        (c.courseCode || c.coursecode) === courseCode
                    );

                    if (course) {
                        const credits = course.credits || 0;
                        const gradePoint = parseFloat(gradeRecord.gradePoint || gradeRecord.gradepoint || 0);

                        gradeData.push({
                            courseCode: courseCode,
                            courseName: course.courseName || course.coursename || '',
                            credits: credits,
                            letterGrade: gradeRecord.gradeLetter || gradeRecord.gradeletter || '',
                            gradePoint: gradePoint,
                            totalScore: parseFloat(gradeRecord.totalScore || gradeRecord.totalscore || 0),
                            midtermScore: parseFloat(gradeRecord.midtermScore || gradeRecord.midtermscore || 0),
                            finalScore: parseFloat(gradeRecord.finalScore || gradeRecord.finalscore || 0),
                            assignmentScore: parseFloat(gradeRecord.assignmentScore || gradeRecord.assignmentscore || 0),
                            attendanceScore: parseFloat(gradeRecord.attendanceScore || gradeRecord.attendancescore || 0)
                        });

                        totalGradePoints += gradePoint * credits;
                        totalCredits += credits;
                    }
                }
            }

            setGrades(gradeData);
            setOverallGPA(totalCredits > 0 ? totalGradePoints / totalCredits : 0);
        } catch (error) {
            console.error('Failed to load grades:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card title="전체 성적 조회">
                <div className="flex justify-center items-center h-32">
                    <div className="text-slate-600">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="전체 성적 조회">
            <p className="mb-4 text-slate-600">
                전체 평점: <span className="font-bold text-brand-blue">{overallGPA.toFixed(2)}</span> / 4.5
            </p>
            {grades.length > 0 ? (
                <Table headers={['과목코드', '과목명', '학점', '성적', '평점']}>
                    {grades.map((grade, idx) => (
                        <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.courseCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{grade.courseName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.credits}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.letterGrade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.gradePoint.toFixed(2)}</td>
                        </tr>
                    ))}
                </Table>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    등록된 성적이 없습니다.
                </div>
            )}
        </Card>
    );
};

export const StudentCurrentGradesConnected: React.FC<{ user: User }> = ({ user }) => {
    const [grades, setGrades] = useState<GradeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [semesterGPA, setSemesterGPA] = useState(0);

    useEffect(() => {
        loadCurrentSemesterGrades();
    }, []);

    const loadCurrentSemesterGrades = async () => {
        try {
            setLoading(true);

            // 현재 학기의 수강 내역만 가져오기 (ENROLLED 상태)
            const enrollments = await getEnrollmentsByStudent(user.id);
            const currentEnrollments = enrollments.filter((e: any) =>
                (e.enrollmentStatus || e.enrollmentstatus) === 'ENROLLED'
            );

            const allGrades = await getAllGrades();
            const allCourses = await getAllCourses();

            const gradeData: GradeData[] = [];
            let totalGradePoints = 0;
            let totalCredits = 0;

            for (const enrollment of currentEnrollments) {
                const enrollmentId = enrollment.enrollmentId || enrollment.enrollmentid;
                const courseCode = enrollment.courseCode || enrollment.coursecode;

                const gradeRecord = allGrades.find((g: any) =>
                    (g.enrollmentId || g.enrollmentid) === enrollmentId
                );

                if (gradeRecord) {
                    const course = allCourses.find((c: any) =>
                        (c.courseCode || c.coursecode) === courseCode
                    );

                    if (course) {
                        const credits = course.credits || 0;
                        const gradePoint = parseFloat(gradeRecord.gradePoint || gradeRecord.gradepoint || 0);

                        gradeData.push({
                            courseCode: courseCode,
                            courseName: course.courseName || course.coursename || '',
                            credits: credits,
                            letterGrade: gradeRecord.gradeLetter || gradeRecord.gradeletter || '',
                            gradePoint: gradePoint,
                            totalScore: parseFloat(gradeRecord.totalScore || gradeRecord.totalscore || 0),
                            midtermScore: parseFloat(gradeRecord.midtermScore || gradeRecord.midtermscore || 0),
                            finalScore: parseFloat(gradeRecord.finalScore || gradeRecord.finalscore || 0),
                            assignmentScore: parseFloat(gradeRecord.assignmentScore || gradeRecord.assignmentscore || 0),
                            attendanceScore: parseFloat(gradeRecord.attendanceScore || gradeRecord.attendancescore || 0)
                        });

                        totalGradePoints += gradePoint * credits;
                        totalCredits += credits;
                    }
                }
            }

            setGrades(gradeData);
            setSemesterGPA(totalCredits > 0 ? totalGradePoints / totalCredits : 0);
        } catch (error) {
            console.error('Failed to load current semester grades:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card title="금학기 성적 조회">
                <div className="flex justify-center items-center h-32">
                    <div className="text-slate-600">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="금학기 성적 조회">
            <p className="mb-4 text-slate-600">
                이번 학기 평점: <span className="font-bold text-brand-blue">{semesterGPA.toFixed(2)}</span> / 4.5
            </p>
            {grades.length > 0 ? (
                <Table headers={['과목명', '중간', '기말', '과제', '출석', '총점', '학점', '평점']}>
                    {grades.map((grade, idx) => (
                        <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{grade.courseName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.midtermScore.toFixed(1)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.finalScore.toFixed(1)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.assignmentScore.toFixed(1)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.attendanceScore.toFixed(1)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.totalScore.toFixed(1)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-blue">{grade.letterGrade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.gradePoint.toFixed(2)}</td>
                        </tr>
                    ))}
                </Table>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    이번 학기 성적이 아직 등록되지 않았습니다.
                </div>
            )}
        </Card>
    );
};
