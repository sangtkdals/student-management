import React, { useState, useMemo, useEffect } from 'react';
import type { User, Course } from '../types';
import { Card, Table, Button, Dropdown, DropdownItem, Input } from './ui';
import { MOCK_COURSES, MOCK_GRADES, MOCK_ANNOUNCEMENTS, ICONS } from '../constants';
import { UserProfile } from './CommonViews';
import { getAllLeaveApplications, createLeaveApplication } from '../api/services';


interface StudentHomeProps {
    user: User;
    setActiveView: (view: string) => void;
}

const StudentHeader: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => (
    <header className="bg-white rounded-lg border border-brand-gray p-3 mb-8">
        <nav className="flex items-center justify-start space-x-2 overflow-x-auto no-scrollbar">
            <Dropdown label="등록금">
                <DropdownItem onClick={() => setActiveView('tuition_payment')}>등록금 납부</DropdownItem>
                <DropdownItem onClick={() => setActiveView('tuition_history')}>등록금 납부 내역 조회</DropdownItem>
            </Dropdown>
            <Dropdown label="휴학/복학">
                <DropdownItem onClick={() => setActiveView('leave_application')}>휴학 신청</DropdownItem>
                <DropdownItem onClick={() => setActiveView('leave_history')}>휴학 신청 조회</DropdownItem>
                <DropdownItem onClick={() => setActiveView('return_application')}>복학 신청</DropdownItem>
                <DropdownItem onClick={() => setActiveView('return_history')}>복학 신청 조회</DropdownItem>
            </Dropdown>
            <Dropdown label="증명서">
                <DropdownItem onClick={() => setActiveView('certificate_issuance')}>증명서 발급</DropdownItem>
            </Dropdown>
            <Dropdown label="수강/성적">
                <DropdownItem onClick={() => setActiveView('course_registration')}>수강 신청</DropdownItem>
                <DropdownItem onClick={() => setActiveView('timetable')}>수강 내역/시간표 조회</DropdownItem>
                <DropdownItem onClick={() => setActiveView('current_grades')}>금학기 성적 조회</DropdownItem>
                <DropdownItem onClick={() => setActiveView('all_grades')}>전체 성적 조회</DropdownItem>
            </Dropdown>
            <Dropdown label="졸업">
                <DropdownItem onClick={() => setActiveView('graduation_check')}>졸업 요건 조회/시뮬레이션</DropdownItem>
            </Dropdown>
        </nav>
    </header>
);

const QuickLinkButton: React.FC<{ icon: React.ReactElement<any>, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-4 bg-brand-gray-light rounded-lg hover:bg-brand-blue-light text-slate-700 hover:text-brand-blue transition-colors">
        {React.cloneElement(icon, { className: "h-7 w-7 mb-1" })}
        <span className="text-xs font-semibold">{label}</span>
    </button>
);


export const StudentHome: React.FC<StudentHomeProps> = ({ user, setActiveView }) => {
  return (
    <div className="space-y-8">
      {/* StudentHeader is not displayed on the main dashboard page */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
            <Card title="이번 학기 시간표">
                <StudentTimetable />
            </Card>
            <Card 
                title="공지사항"
                titleAction={
                    <button onClick={() => setActiveView('announcements')} className="text-sm font-medium text-brand-blue hover:underline">
                        더보기 &rarr;
                    </button>
                }
            >
                <ul className="divide-y divide-brand-gray -mx-6 -my-6">
                    {MOCK_ANNOUNCEMENTS.slice(0, 3).map(ann => (
                        <li key={ann.id} className="py-4 px-6 hover:bg-slate-50 cursor-pointer" onClick={() => setActiveView('announcements')}>
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-slate-800">{ann.title}</h3>
                                <span className="text-sm text-slate-500 flex-shrink-0 ml-4">{ann.date}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
        {/* Right Column */}
        <div className="space-y-8">
          <Card>
              <div className="text-center">
                  <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-full mx-auto border-4 border-white shadow-md" />
                  <div className="mt-4">
                    <div className="font-bold text-xl text-slate-800">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.department}</div>
                  </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 text-center text-sm">
                <div className="p-2 bg-brand-gray-light rounded-md">
                    <p className="font-semibold">학적</p>
                    <p>재학</p>
                </div>
                <div className="p-2 bg-brand-gray-light rounded-md">
                    <p className="font-semibold">평점</p>
                    <p>4.0/4.5</p>
                </div>
              </div>
              <Button onClick={() => setActiveView('profile')} className="w-full mt-6">
                내 정보 관리
              </Button>
          </Card>
          <Card title="Quick Links">
            <div className="grid grid-cols-2 gap-3">
                <QuickLinkButton icon={ICONS.courses} label="수강신청" onClick={() => setActiveView('course_registration')} />
                <QuickLinkButton icon={ICONS.grades} label="성적조회" onClick={() => setActiveView('all_grades')} />
                <QuickLinkButton icon={ICONS.tuition} label="등록금" onClick={() => setActiveView('tuition_history')} />
                <QuickLinkButton icon={ICONS.graduation} label="졸업요건" onClick={() => setActiveView('graduation_check')} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


const VisualTimetable: React.FC<{ courses: Course[], previewCourseId?: string | null }> = ({ courses, previewCourseId = null }) => {
    const days = ['월', '화', '수', '목', '금'];
    const timeLabels = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`); // 9:00 to 18:00
    const dayMap: { [key: string]: number } = { '월': 0, '화': 1, '수': 2, '목': 3, '금': 4 };
    const courseColors = [
        'bg-blue-100 border-blue-300 text-blue-800', 
        'bg-green-100 border-green-300 text-green-800', 
        'bg-purple-100 border-purple-300 text-purple-800', 
        'bg-yellow-100 border-yellow-300 text-yellow-800', 
        'bg-pink-100 border-pink-300 text-pink-800', 
        'bg-indigo-100 border-indigo-300 text-indigo-800'
    ];
    const hourHeight = 60; // in px

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
            const timeSlots = parseTime(course.time);
            const isPreview = course.id === previewCourseId;
            timeSlots.forEach((slot, slotIndex) => {
                const startHour = parseInt(slot.startTime.split(':')[0]);
                const startMinute = parseInt(slot.startTime.split(':')[1]);
                const endHour = parseInt(slot.endTime.split(':')[0]);
                const endMinute = parseInt(slot.endTime.split(':')[1]);

                const top = (startHour - 9 + startMinute / 60) * hourHeight;
                const height = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60 * hourHeight;
                const left = dayMap[slot.day] * 20; // 20% width for each day
                
                const blockBaseClasses = "absolute rounded-lg p-2 text-xs flex flex-col overflow-hidden transition-all duration-200 ease-in-out";
                const blockStateClasses = isPreview 
                    ? `border-2 border-dashed border-brand-blue opacity-75 ${courseColors[index % courseColors.length]}`
                    : `border ${courseColors[index % courseColors.length]}`;

                blocks.push(
                    <div
                        key={`${course.id}-${slotIndex}`}
                        className={`${blockBaseClasses} ${blockStateClasses}`}
                        style={{
                            top: `${top}px`,
                            height: `${height-2}px`, // 2px margin
                            left: `calc(${left}% + 1px)`,
                            width: 'calc(20% - 2px)',
                        }}
                    >
                        <p className="font-bold truncate">{course.name}</p>
                        <p className="hidden md:block">{course.room}</p>
                    </div>
                );
            });
        });
        return blocks;
    };
    
    return (
        <div className="flex select-none overflow-x-auto pb-4">
            <div className="min-w-[300px] w-full flex">
                {/* Time labels column */}
                <div className="w-10 md:w-12 text-right text-xs text-slate-400 flex flex-col shrink-0">
                    {timeLabels.map(time => (
                        <div key={time} style={{ height: `${hourHeight}px` }} className="relative -top-2 pr-2 shrink-0">
                            {time}
                        </div>
                    ))}
                </div>
                {/* Timetable grid */}
                <div className="flex-1 grid grid-cols-5 relative" style={{ minHeight: `${10 * hourHeight}px`}}>
                    {/* Day Headers */}
                    <div className="col-span-5 grid grid-cols-5 absolute top-0 left-0 w-full h-8 -translate-y-full">
                        {days.map((day) => (
                          <div key={day} className="text-center text-sm font-semibold text-slate-600 py-1">{day}</div>
                        ))}
                    </div>
                    {/* Vertical lines */}
                    {days.map((day, index) => (
                        <div key={index} className="border-r border-slate-200 h-full"></div>
                    ))}
                    {/* Horizontal lines */}
                    {timeLabels.map((_, index) => (
                        <div 
                            key={index} 
                            className="absolute w-full border-t border-dashed border-slate-200" 
                            style={{ top: `${(index) * hourHeight}px`, zIndex: -1 }}
                        ></div>
                    ))}
                    {/* Course blocks */}
                    {getCourseBlocks()}
                </div>
            </div>
        </div>
    );
};

export const StudentTimetable: React.FC = () => {
  const currentCourses = MOCK_COURSES.slice(0, 2); // Mock current courses
  return <VisualTimetable courses={currentCourses} />;
};

export const StudentAllGrades: React.FC = () => (
  <Card title="전체 성적 조회">
    <p className="mb-4 text-slate-600">전체 평점: <span className="font-bold text-brand-blue">4.0</span></p>
    <Table headers={['년도/학기', '과목명', '학점', '성적', '평점']}>
      {MOCK_GRADES.map(grade => (
        <tr key={grade.courseId}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.year} / {grade.semester}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{grade.courseName}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.credits}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.letterGrade}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{grade.gpa.toFixed(1)}</td>
        </tr>
      ))}
    </Table>
  </Card>
);

export const StudentCourseRegistration: React.FC = () => {
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([MOCK_COURSES[0]]);
    const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

    const totalCredits = useMemo(() => {
        return selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    }, [selectedCourses]);
    
    const coursesForTimetable = useMemo(() => {
        if (previewCourse && !selectedCourses.some(c => c.id === previewCourse.id)) {
            return [...selectedCourses, previewCourse];
        }
        return selectedCourses;
    }, [selectedCourses, previewCourse]);

    const addCourse = (course: Course) => {
        if (!selectedCourses.some(c => c.id === course.id)) {
            // In a real app, you'd check for time conflicts here
            setSelectedCourses([...selectedCourses, course]);
        }
    };

    const removeCourse = (courseId: string) => {
        setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
    };

    return (
        <div className="space-y-8">
            <StudentHeader setActiveView={() => {}} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card title="내 시간표">
                        <div className="pt-8">
                            <VisualTimetable courses={coursesForTimetable} previewCourseId={previewCourse?.id} />
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <h4 className="font-bold text-slate-700 mb-2">신청 내역</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                {selectedCourses.length}개 과목 ({totalCredits}학점)을 신청했습니다.
                            </p>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {selectedCourses.length > 0 ? selectedCourses.map(course => (
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
                            <div className="mt-6 flex justify-end">
                                <Button>수강신청 확정</Button>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="수강 가능 과목">
                        <div className="max-h-[70vh] overflow-y-auto">
                            <Table headers={['과목명', '교수', '시간', '학점', '신청']}>
                                {MOCK_COURSES.map(course => {
                                    const isSelected = selectedCourses.some(c => c.id === course.id);
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

export const StudentTuitionHistory: React.FC = () => (
    <Card title="등록금 납부 내역">
        <Table headers={['년도/학기', '금액', '납부일', '상태']}>
            <tr>
                <td className="px-6 py-4 text-sm">2024 / 1</td>
                <td className="px-6 py-4 text-sm">₩4,500,000</td>
                <td className="px-6 py-4 text-sm">2024-02-20</td>
                <td className="px-6 py-4 text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">납부 완료</span></td>
            </tr>
             <tr>
                <td className="px-6 py-4 text-sm">2023 / 2</td>
                <td className="px-6 py-4 text-sm">₩4,500,000</td>
                <td className="px-6 py-4 text-sm">2023-08-21</td>
                <td className="px-6 py-4 text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">납부 완료</span></td>
            </tr>
        </Table>
    </Card>
);

// --- Unified Leave/Return Management System ---

interface StudentLeaveManagementProps {
    defaultTab?: 'leave' | 'return' | 'history';
}

interface HistoryItem {
    id: number;
    type: string;
    category: string;
    year: number;
    semester: number;
    date: string;
    status: string;
    statusColor: string;
    reason?: string;
    rejectReason?: string;
    contactNumber?: string;
    address?: string;
    documents?: string[];
}

const StudentLeaveManagement: React.FC<StudentLeaveManagementProps> = ({ defaultTab = 'leave' }) => {
    const [activeTab, setActiveTab] = useState<'leave' | 'return' | 'history'>(defaultTab);
    const [leaveType, setLeaveType] = useState('일반휴학');
    const [leaveReason, setLeaveReason] = useState('');
    const [returnType, setReturnType] = useState('일반복학');
    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

    const [history, setHistory] = useState<HistoryItem[]>([
        { 
            id: 1, 
            type: '휴학', 
            category: '일반휴학', 
            year: 2023, 
            semester: 1, 
            date: '2022-12-15', 
            status: '승인', 
            statusColor: 'bg-green-100 text-green-800',
            reason: '개인 사정으로 인한 휴학을 신청합니다. 가족의 건강 문제로 인해 학업을 일시 중단하고자 합니다.',
            contactNumber: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123',
            documents: ['가족관계증명서.pdf']
        },
        { 
            id: 2, 
            type: '복학', 
            category: '일반복학', 
            year: 2024, 
            semester: 1, 
            date: '2023-12-20', 
            status: '승인', 
            statusColor: 'bg-green-100 text-green-800',
            reason: '휴학 기간 종료로 인한 복학 신청',
            contactNumber: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123'
        },
        { 
            id: 3, 
            type: '휴학', 
            category: '질병휴학', 
            year: 2024, 
            semester: 2, 
            date: '2024-06-10', 
            status: '검토중', 
            statusColor: 'bg-yellow-100 text-yellow-800',
            reason: '건강상의 이유로 질병휴학을 신청합니다. 의사 소견서를 첨부하였습니다.',
            contactNumber: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123',
            documents: ['진단서.pdf', '의사소견서.pdf']
        },
        { 
            id: 4, 
            type: '휴학', 
            category: '군입대휴학', 
            year: 2022, 
            semester: 2, 
            date: '2022-08-15', 
            status: '거절', 
            statusColor: 'bg-red-100 text-red-800',
            reason: '군 입대로 인한 휴학 신청',
            rejectReason: '입영통지서 미제출. 필수 서류를 제출한 후 재신청 바랍니다.',
            contactNumber: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123'
        }
    ]);

    const handleLeaveSubmit = () => {
        const newItem: HistoryItem = {
            id: Date.now(),
            type: '휴학',
            category: leaveType,
            year: 2025, 
            semester: 1,
            date: new Date().toISOString().split('T')[0],
            status: '신청완료', 
            statusColor: 'bg-blue-100 text-blue-800',
            reason: leaveReason,
            contactNumber: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123'
        };
        setHistory([newItem, ...history]);
        setActiveTab('history');
        alert('휴학 신청이 정상적으로 접수되었습니다.');
        setLeaveReason('');
    };

    const handleReturnSubmit = () => {
        const newItem: HistoryItem = {
            id: Date.now(),
            type: '복학',
            category: returnType,
            year: 2025,
            semester: 1,
            date: new Date().toISOString().split('T')[0],
            status: '신청완료',
            statusColor: 'bg-blue-100 text-blue-800',
            reason: '휴학 기간 종료로 인한 복학 신청',
            contactNumber: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123'
        };
        setHistory([newItem, ...history]);
        setActiveTab('history');
        alert('복학 신청이 정상적으로 접수되었습니다.');
    };

    const toggleExpand = (itemId: number) => {
        setExpandedItemId(expandedItemId === itemId ? null : itemId);
    };

    // ✅ useMemo로 감싸서 불필요한 리렌더링 방지
    const ApplyLeaveTab = useMemo(() => (
        <div className="space-y-6 max-w-2xl w-full mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex flex-col md:flex-row items-start">
                    <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-3">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-0 md:ml-3">
                        <p className="text-sm text-yellow-700 leading-relaxed">
                            휴학 신청 전 반드시 도서관 미반납 도서 및 미납 연체료를 확인해 주시기 바랍니다.
                            <br className="hidden md:block"/> 일반 휴학은 1회에 1년(2학기)까지 신청 가능하며, 재학 중 통산 3년(6학기)을 초과할 수 없습니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">신청 년도/학기</label>
                    <input type="text" value="2025년 1학기" disabled className="block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">휴학 구분</label>
                    <select 
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
                    >
                        <option value="일반휴학">일반휴학</option>
                        <option value="군입대휴학">군입대휴학</option>
                        <option value="질병휴학">질병휴학</option>
                        <option value="창업휴학">창업휴학</option>
                        <option value="육아휴학">육아휴학</option>
                    </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <Input label="연락처 (비상연락망)" defaultValue="010-1234-5678" />
                </div>
                <div className="col-span-1 md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">휴학 사유</label>
                     <textarea 
                        rows={4} 
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="구체적인 휴학 사유를 입력하세요."
                    ></textarea>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">증빙 서류 첨부 (해당자)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-slate-50 transition-colors">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-brand-blue-dark focus-within:outline-none">
                                    <span>파일 업로드</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1 pt-1 sm:pt-0">또는 드래그 앤 드롭</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button className="w-full md:w-auto" onClick={handleLeaveSubmit}>휴학 신청 제출</Button>
            </div>
        </div>
    ), [leaveType, leaveReason, handleLeaveSubmit]);

    const ApplyReturnTab = useMemo(() => (
        <div className="space-y-6 max-w-2xl w-full mx-auto">
             <div className="bg-blue-50 border-l-4 border-brand-blue p-4">
                <div className="flex flex-col md:flex-row items-start">
                    <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-3">
                        <svg className="h-5 w-5 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-0 md:ml-3">
                        <p className="text-sm text-blue-700 leading-relaxed">
                            복학 신청 기간은 학기 개시일로부터 4주 이내입니다.
                            <br className="hidden md:block"/> 군제대 복학자는 전역증 사본 또는 병적증명서를 첨부해야 합니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">복학 예정 학기</label>
                        <input type="text" value="2025년 1학기" disabled className="block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">복학 구분</label>
                        <select 
                            value={returnType}
                            onChange={(e) => setReturnType(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
                        >
                            <option value="일반복학">일반복학</option>
                            <option value="제대복학">제대복학</option>
                        </select>
                    </div>
                 </div>
                 
                 <Input label="연락처 (휴대전화)" defaultValue="010-1234-5678" />
                 <Input label="주소" defaultValue="서울시 강남구 테헤란로 123" />
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">증빙 서류 첨부 (제대복학 시)</label>
                    <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"/>
                </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button className="w-full md:w-auto" onClick={handleReturnSubmit}>복학 신청 제출</Button>
            </div>
        </div>
    ), [returnType, handleReturnSubmit]);

    const HistoryTab = useMemo(() => (
        <div className="space-y-4">
            <p className="text-slate-600 mb-2 text-sm md:text-base">최근 3년간의 휴/복학 신청 내역입니다.</p>
            
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">신청일자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">구분</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">세부구분</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">신청학기</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">상태</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">상세</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {history.map(item => (
                                <React.Fragment key={item.id}>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.year}년 {item.semester}학기</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button 
                                                onClick={() => toggleExpand(item.id)}
                                                className="text-brand-blue hover:text-brand-blue-dark font-medium flex items-center"
                                            >
                                                {expandedItemId === item.id ? (
                                                    <>
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                        접기
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                        상세보기
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedItemId === item.id && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 bg-slate-50">
                                                <div className="space-y-4 text-sm">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="font-semibold text-slate-700">연락처:</span>
                                                            <span className="ml-2 text-slate-600">{item.contactNumber || '-'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-700">주소:</span>
                                                            <span className="ml-2 text-slate-600">{item.address || '-'}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {item.reason && (
                                                        <div>
                                                            <span className="font-semibold text-slate-700 block mb-1">{item.type} 사유:</span>
                                                            <p className="text-slate-600 bg-white p-3 rounded border border-slate-200">
                                                                {item.reason}
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    {item.rejectReason && (
                                                        <div>
                                                            <span className="font-semibold text-red-700 block mb-1">거절 사유:</span>
                                                            <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                                                {item.rejectReason}
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    {item.documents && item.documents.length > 0 && (
                                                        <div>
                                                            <span className="font-semibold text-slate-700 block mb-2">첨부 서류:</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.documents.map((doc, idx) => (
                                                                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        {doc}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-4">
                {history.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${item.type === '휴학' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {item.type}
                                    </span>
                                    <span className="text-sm font-bold text-slate-800">{item.category}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.statusColor}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm mb-3">
                                 <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-400">신청일자</span>
                                    <span className="text-slate-600">{item.date}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-slate-400">신청학기</span>
                                    <span className="text-slate-600">{item.year}년 {item.semester}학기</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => toggleExpand(item.id)}
                                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-brand-blue font-medium rounded text-sm flex items-center justify-center transition-colors"
                            >
                                {expandedItemId === item.id ? (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                        접기
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        상세보기
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {expandedItemId === item.id && (
                            <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-200">
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="font-semibold text-slate-700 block mb-1">연락처</span>
                                        <span className="text-slate-600">{item.contactNumber || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-slate-700 block mb-1">주소</span>
                                        <span className="text-slate-600">{item.address || '-'}</span>
                                    </div>
                                    
                                    {item.reason && (
                                        <div>
                                            <span className="font-semibold text-slate-700 block mb-1">{item.type} 사유</span>
                                            <p className="text-slate-600 bg-white p-3 rounded border border-slate-200">
                                                {item.reason}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {item.rejectReason && (
                                        <div>
                                            <span className="font-semibold text-red-700 block mb-1">거절 사유</span>
                                            <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                                {item.rejectReason}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {item.documents && item.documents.length > 0 && (
                                        <div>
                                            <span className="font-semibold text-slate-700 block mb-2">첨부 서류</span>
                                            <div className="space-y-2">
                                                {item.documents.map((doc, idx) => (
                                                    <div key={idx} className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded text-xs">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        {doc}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    ), [history, expandedItemId]);

    return (
        <Card title="휴학/복학 관리">
            <div className="border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                <nav className="-mb-px flex space-x-8 min-w-max px-1">
                    <button
                        onClick={() => setActiveTab('leave')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'leave'
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        휴학 신청
                    </button>
                    <button
                        onClick={() => setActiveTab('return')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'return'
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        복학 신청
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'history'
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        신청 내역 조회
                    </button>
                </nav>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'leave' && ApplyLeaveTab}
                {activeTab === 'return' && ApplyReturnTab}
                {activeTab === 'history' && HistoryTab}
            </div>
        </Card>
    );
};


// --- Updated Component Exports ---

export const StudentLeaveApplication: React.FC = () => <StudentLeaveManagement defaultTab="leave" />;
export const StudentReturnApplication: React.FC = () => <StudentLeaveManagement defaultTab="return" />;
export const StudentLeaveHistory: React.FC = () => <StudentLeaveManagement defaultTab="history" />;
export const StudentReturnHistory: React.FC = () => <StudentLeaveManagement defaultTab="history" />;


export const StudentGraduationCheck: React.FC = () => (
    <Card title="졸업 요건 충족 현황">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-brand-gray-light rounded-lg">
                <p className="text-sm text-slate-500">총 취득 학점</p>
                <p className="text-2xl font-bold text-slate-800">98 / 130</p>
            </div>
             <div className="p-4 bg-brand-gray-light rounded-lg">
                <p className="text-sm text-slate-500">전공 학점</p>
                <p className="text-2xl font-bold text-slate-800">45 / 72</p>
            </div>
             <div className="p-4 bg-brand-gray-light rounded-lg">
                <p className="text-sm text-slate-500">교양 학점</p>
                <p className="text-2xl font-bold text-slate-800">32 / 36</p>
            </div>
             <div className="p-4 bg-brand-gray-light rounded-lg">
                <p className="text-sm text-slate-500">전체 평점</p>
                <p className="text-2xl font-bold text-slate-800">4.0 / 2.0</p>
            </div>
        </div>
        <p className="mt-6 text-slate-600">현재까지의 졸업 요건 충족 현황 요약입니다.</p>
    </Card>
);


// --- New Placeholder Views ---

export const StudentTuitionPayment: React.FC = () => (
    <Card title="등록금 납부">
        <p className="text-slate-600">이곳에서 등록금 납부를 진행할 수 있습니다. (UI 구현 영역)</p>
    </Card>
);

export const StudentCertificateIssuance: React.FC = () => (
    <Card title="증명서 발급">
        <p className="text-slate-600">이곳에서 다양한 증명서를 발급받을 수 있습니다. (UI 구현 영역)</p>
    </Card>
);

export const StudentCurrentGrades: React.FC = () => (
  <Card title="금학기 성적 조회">
    <p className="text-slate-600 mb-4">현재 학기 성적은 아직 공개되지 않았습니다.</p>
    {/* Placeholder for current semester grades table */}
  </Card>
);