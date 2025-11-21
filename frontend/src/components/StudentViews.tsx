import React, { useState, useEffect } from 'react';
import type { User, Course } from '../types';
import { Card, Button, Table, Modal } from './ui';
import { MOCK_COURSES, MOCK_GRADES, MOCK_STUDENT_RECORDS, ICONS } from '../constants';

interface StudentHomeProps {
    user: User;
    setActiveView: (view: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ user, setActiveView }) => {
    const myGrades = MOCK_GRADES;
    const currentSemesterGrades = myGrades.filter(g => g.year === 2024 && g.semester === 1); 
    const totalCredits = myGrades.reduce((sum, g) => sum + g.credits, 0);
    const totalGPA = myGrades.reduce((sum, g) => sum + g.gpa * g.credits, 0) / totalCredits;

    // Mock Timetable Data for Visual Representation
    const timeSlots = [
        { day: '월', time: '10:00', course: '프로그래밍 입문', room: '공학관 101', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { day: '수', time: '10:00', course: '프로그래밍 입문', room: '공학관 101', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { day: '화', time: '13:00', course: '자료구조', room: '공학관 203', color: 'bg-green-100 text-green-700 border-green-200' },
        { day: '목', time: '13:00', course: '자료구조', room: '공학관 203', color: 'bg-green-100 text-green-700 border-green-200' },
        { day: '월', time: '15:00', course: '선형대수학', room: '과학관 301', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    ];

    const days = ['월', '화', '수', '목', '금'];
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    return (
        <div className="flex flex-col lg:h-full h-auto">
            {/* Top Banner Area - Profile & Stats */}
            <div className="bg-brand-blue w-full lg:h-1/2 h-auto py-6 px-4 sm:px-6 lg:px-8 shadow-md relative z-10 flex-shrink-0">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        
                        {/* Profile Card */}
                        <div className="lg:col-span-1 h-full min-h-[200px]">
                            <div className="border-2 border-white/20 bg-brand-blue-dark rounded-xl p-6 text-white shadow-2xl h-full flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-brand-blue/50 rounded-full blur-2xl"></div>

                                <div className="flex flex-row items-center space-x-5 mb-6 w-full relative z-10">
                                    <div className="relative shrink-0">
                                        <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-full border-4 border-white/20 shadow-xl object-cover" />
                                        <span className="absolute bottom-1 right-1 bg-green-400 w-5 h-5 rounded-full border-4 border-brand-blue-dark"></span>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h2 className="text-3xl font-bold tracking-tight truncate">{user.name}</h2>
                                        <p className="text-blue-200 text-base mt-1 truncate">{user.department}</p>
                                        <div className="mt-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-100 border border-white/10 inline-block">
                                            재학 | 3학년
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-center w-full relative z-10">
                                    <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm border border-white/5">
                                        <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">전체 평점</p>
                                        <p className="text-2xl font-bold text-white mt-1">{totalGPA.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm border border-white/5">
                                        <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">이수 학점</p>
                                        <p className="text-2xl font-bold text-white mt-1">{totalCredits}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timetable Preview */}
                        <div className="lg:col-span-2 h-full min-h-[300px]">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-slate-100">
                                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                                    <h2 className="text-lg font-bold text-brand-blue flex items-center">
                                        <span className="mr-2 p-1 bg-blue-100 rounded-md">{React.cloneElement(ICONS.calendar, { className: "h-4 w-4 text-brand-blue" })}</span>
                                        주간 시간표
                                    </h2>
                                    <button onClick={() => setActiveView('timetable')} className="text-xs font-bold text-slate-400 hover:text-brand-blue uppercase tracking-wide">전체보기</button>
                                </div>
                                <div className="p-4 flex-1 overflow-auto custom-scrollbar bg-slate-50/30 relative">
                                    {/* Simple Visual Timetable */}
                                    <div className="grid grid-cols-6 gap-1 min-w-[500px] h-full">
                                        <div className="col-span-1">
                                            <div className="h-8"></div> {/* Header Spacer */}
                                            {hours.map(h => <div key={h} className="h-12 text-xs text-slate-400 text-right pr-2 -mt-2">{h}</div>)}
                                        </div>
                                        {days.map(day => (
                                            <div key={day} className="col-span-1 flex flex-col">
                                                <div className="h-8 text-center text-xs font-bold text-slate-600 bg-slate-100 rounded-t-md py-2 mb-1">{day}</div>
                                                <div className="flex-1 relative bg-white rounded-b-md border border-slate-100">
                                                    {/* Grid lines */}
                                                    {hours.map((_, i) => (
                                                        <div key={i} className="absolute w-full border-t border-dashed border-slate-100" style={{ top: `${i * 48}px` }}></div>
                                                    ))}
                                                    
                                                    {/* Course Blocks */}
                                                    {timeSlots.filter(s => s.day === day).map((slot, idx) => {
                                                        const startHourIndex = hours.findIndex(h => h === slot.time);
                                                        const top = startHourIndex * 48;
                                                        return (
                                                            <div 
                                                                key={idx} 
                                                                className={`absolute w-[90%] left-[5%] rounded p-1.5 text-[10px] border shadow-sm ${slot.color} hover:scale-105 transition-transform cursor-pointer z-10`}
                                                                style={{ top: `${top}px`, height: '90px' }} 
                                                            >
                                                                <p className="font-bold truncate">{slot.course}</p>
                                                                <p className="truncate opacity-80">{slot.room}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Content Area */}
            <div className="bg-brand-gray-light w-full lg:h-1/2 h-auto py-6 px-4 sm:px-6 lg:px-8 flex-shrink-0">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                        
                        {/* Quick Menu Cards */}
                        <div onClick={() => setActiveView('course_registration')} className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-full min-h-[180px]">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-blue-100">
                                {React.cloneElement(ICONS.courses, { className: "h-8 w-8 text-brand-blue" })}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-blue">수강신청</h3>
                            <p className="text-xs text-slate-500 mt-2">2024-1학기 수강신청 기간입니다</p>
                        </div>

                        <div onClick={() => setActiveView('current_grades')} className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray hover:shadow-md hover:border-green-300 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-full min-h-[180px]">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-green-100">
                                {React.cloneElement(ICONS.grades, { className: "h-8 w-8 text-green-600" })}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-600">금학기 성적</h3>
                            <p className="text-xs text-slate-500 mt-2">중간고사 성적이 발표되었습니다</p>
                        </div>

                        <div onClick={() => setActiveView('tuition_payment')} className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-full min-h-[180px]">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-purple-100">
                                {React.cloneElement(ICONS.tuition, { className: "h-8 w-8 text-purple-600" })}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-600">등록금 납부</h3>
                            <p className="text-xs text-slate-500 mt-2">납부 내역 및 고지서 확인</p>
                        </div>

                        <div onClick={() => setActiveView('certificate_issuance')} className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-full min-h-[180px]">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-orange-100">
                                {React.cloneElement(ICONS.profile, { className: "h-8 w-8 text-orange-600" })}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600">증명서 발급</h3>
                            <p className="text-xs text-slate-500 mt-2">재학/성적 증명서 즉시 발급</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export const StudentCourseRegistration: React.FC = () => {
    const [cart, setCart] = useState<Course[]>([]);
    const availableCourses = MOCK_COURSES.filter(c => !cart.find(item => item.id === c.id));

    const handleAddToCart = (course: Course) => {
        setCart([...cart, course]);
    };

    const handleRemoveFromCart = (courseId: string) => {
        setCart(cart.filter(c => c.id !== courseId));
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="개설 강좌 목록">
                    <div className="overflow-y-auto max-h-[500px]">
                        <Table headers={['코드', '과목명', '교수', '학점', '시간', '신청']}>
                            {availableCourses.map(course => (
                                <tr key={course.id}>
                                    <td className="px-4 py-3 text-sm">{course.id}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-slate-700">{course.name}</td>
                                    <td className="px-4 py-3 text-sm">{course.professor}</td>
                                    <td className="px-4 py-3 text-sm">{course.credits}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{course.time}</td>
                                    <td className="px-4 py-3">
                                        <Button size="sm" onClick={() => handleAddToCart(course)}>담기</Button>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card title="수강 바구니">
                        <div className="overflow-y-auto max-h-[250px]">
                             {cart.length === 0 ? (
                                <p className="text-center py-8 text-slate-500">담긴 강좌가 없습니다.</p>
                            ) : (
                                <Table headers={['코드', '과목명', '학점', '취소']}>
                                    {cart.map(course => (
                                        <tr key={course.id}>
                                            <td className="px-4 py-3 text-sm">{course.id}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{course.name}</td>
                                            <td className="px-4 py-3 text-sm">{course.credits}</td>
                                            <td className="px-4 py-3">
                                                <Button size="sm" variant="secondary" onClick={() => handleRemoveFromCart(course.id)}>취소</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className="mt-4 flex justify-end pt-4 border-t border-slate-100">
                                <Button onClick={() => alert('수강신청이 완료되었습니다.')}>수강신청 확정</Button>
                            </div>
                        )}
                    </Card>
                    
                    <Card title="신청 유의사항" className="bg-yellow-50 border-yellow-200">
                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                            <li>수강신청 변경 기간은 3월 8일까지입니다.</li>
                            <li>최대 수강 가능 학점은 18학점입니다. (직전 학기 평점 4.0 이상 시 21학점)</li>
                            <li>폐강 기준: 수강 인원 10명 미만 시 폐강될 수 있습니다.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export const StudentAllGrades: React.FC = () => {
    const gradesBySemester = MOCK_GRADES.reduce((acc, grade) => {
        const key = `${grade.year}-${grade.semester}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(grade);
        return acc;
    }, {} as { [key: string]: typeof MOCK_GRADES });

    return (
        <div className="space-y-8">
            {Object.entries(gradesBySemester).sort().reverse().map(([semester, grades]) => {
                const semesterGPA = grades.reduce((sum, g) => sum + g.gpa * g.credits, 0) / grades.reduce((sum, g) => sum + g.credits, 0);
                return (
                    <Card key={semester} title={`${semester.split('-')[0]}년 ${semester.split('-')[1]}학기 성적`}>
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                            <span className="font-bold text-slate-700">학기 평점: <span className="text-brand-blue text-lg ml-2">{semesterGPA.toFixed(2)}</span></span>
                            <span className="text-sm text-slate-500">이수 학점: {grades.reduce((sum, g) => sum + g.credits, 0)}</span>
                        </div>
                        <Table headers={['과목코드', '과목명', '학점', '성적', '평점']}>
                            {grades.map((grade, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 text-sm text-slate-500">{grade.courseId}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{grade.courseName}</td>
                                    <td className="px-6 py-4 text-sm text-center">{grade.credits}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-brand-blue text-center">{grade.letterGrade}</td>
                                    <td className="px-6 py-4 text-sm text-center">{grade.gpa}</td>
                                </tr>
                            ))}
                        </Table>
                    </Card>
                );
            })}
        </div>
    );
};

// Simple Placeholder Components for other views
const PlaceholderView: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
    <Card title={title}>
        <div className="text-center py-16">
            <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
            <div className="mt-6">
                <Button variant="secondary" onClick={() => alert('준비 중인 기능입니다.')}>자세히 보기</Button>
            </div>
        </div>
    </Card>
);

export const StudentTuitionHistory: React.FC = () => <PlaceholderView title="등록금 납부 내역" desc="지난 학기 등록금 납부 내역을 조회합니다." />;
export const StudentLeaveApplication: React.FC = () => <PlaceholderView title="휴학 신청" desc="일반 휴학 및 군 휴학을 신청할 수 있습니다." />;
export const StudentGraduationCheck: React.FC = () => <PlaceholderView title="졸업 요건 조회" desc="졸업에 필요한 학점 및 필수 이수 과목 충족 여부를 확인합니다." />;
export const StudentTuitionPayment: React.FC = () => <PlaceholderView title="등록금 납부" desc="이번 학기 등록금 고지서를 확인하고 납부할 수 있습니다." />;
export const StudentLeaveHistory: React.FC = () => <PlaceholderView title="휴학 내역 조회" desc="신청한 휴학 처리 현황 및 과거 내역을 확인합니다." />;
export const StudentReturnApplication: React.FC = () => <PlaceholderView title="복학 신청" desc="휴학 후 복학을 신청합니다." />;
export const StudentReturnHistory: React.FC = () => <PlaceholderView title="복학 내역 조회" desc="복학 신청 처리 현황을 확인합니다." />;
export const StudentCertificateIssuance: React.FC = () => <PlaceholderView title="증명서 발급" desc="재학증명서, 성적증명서 등 각종 증명서를 발급받을 수 있습니다." />;
export const StudentTimetable: React.FC = () => <PlaceholderView title="시간표 조회" desc="이번 학기 수강 신청한 과목의 시간표를 확인합니다." />;
export const StudentCurrentGrades: React.FC = () => <PlaceholderView title="금학기 성적 조회" desc="이번 학기 중간/기말 고사 성적 및 과제 점수를 확인합니다." />;
