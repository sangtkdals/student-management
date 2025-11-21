
import React, { useState, useEffect } from 'react';
import type { User, Course, StudentRecord } from '../types';
import { Card, Table, Button, Dropdown, DropdownItem } from './ui';
import { MOCK_COURSES, MOCK_STUDENT_RECORDS, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS, ICONS } from '../constants';


interface ProfessorHomeProps {
    user: User;
    setActiveView: (view: string) => void;
}

// Removed ProfessorHeader as requested to remove top tabs.

const ProfessorVisualTimetable: React.FC<{ courses: Course[] }> = ({ courses }) => {
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
    // Reduced height by 20% (60px -> 48px)
    const hourHeight = 48; 

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
            timeSlots.forEach((slot, slotIndex) => {
                const startHour = parseInt(slot.startTime.split(':')[0]);
                const startMinute = parseInt(slot.startTime.split(':')[1]);
                const endHour = parseInt(slot.endTime.split(':')[0]);
                const endMinute = parseInt(slot.endTime.split(':')[1]);

                const top = (startHour - 9 + startMinute / 60) * hourHeight;
                const height = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60 * hourHeight;
                const left = dayMap[slot.day] * 20; // 20% width for each day
                
                const blockBaseClasses = "absolute rounded-lg p-1.5 text-[10px] flex flex-col overflow-hidden";

                blocks.push(
                    <div
                        key={`${course.id}-${slotIndex}`}
                        className={`${blockBaseClasses} border ${courseColors[index % courseColors.length]}`}
                        style={{
                            top: `${top}px`,
                            height: `${height-2}px`, // 2px margin
                            left: `calc(${left}% + 1px)`,
                            width: 'calc(20% - 2px)',
                        }}
                    >
                        <p className="font-bold truncate">{course.name}</p>
                        <p className="truncate">{course.room}</p>
                    </div>
                );
            });
        });
        return blocks;
    };
    
    return (
        <div className="flex select-none">
            {/* Time labels column */}
            <div className="w-12 text-right text-xs text-slate-400 flex flex-col shrink-0">
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
                      <div key={day} className="text-center text-xs font-semibold text-slate-600 py-1">{day}</div>
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
    );
};

export const ProfessorHome: React.FC<ProfessorHomeProps> = ({ user, setActiveView }) => {
  const myCourses = MOCK_COURSES.filter(c => c.professor === user.name);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Row 1 */}
        <div className="lg:col-span-2">
            <Card 
              title="이번 학기 강의"
              className="h-full"
              titleAction={
                <Button size="sm" onClick={() => setActiveView('my_lectures')}>
                    강의 관리 이동 &rarr;
                </Button>
              }
            >
              <div className="space-y-4">
                {myCourses.map(course => (
                  <div key={course.id} className="p-4 bg-slate-50 rounded-lg flex justify-between items-center transition-shadow hover:shadow-md cursor-pointer" onClick={() => setActiveView('my_lectures')}>
                      <div>
                          <p className="font-bold text-slate-800">{course.name} <span className="text-sm font-normal text-slate-500">({course.id})</span></p>
                          <p className="text-sm text-slate-500">{course.time} / {course.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-blue">35명</p>
                        <p className="text-xs text-slate-400">수강중</p>
                      </div>
                  </div>
                ))}
              </div>
            </Card>
        </div>

        <div className="lg:col-span-1">
             <Card className="h-full">
                <div className="flex flex-col h-full">
                    <div className="text-center mb-6">
                        <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-full mx-auto border-4 border-white shadow-md" />
                        <div className="mt-4">
                            <div className="font-bold text-xl text-slate-800">{user.name}</div>
                            <div className="text-sm text-slate-500">Professor</div>
                        </div>
                    </div>
                    <div className="space-y-4 flex-grow">
                        <div className="flex justify-between border-b border-brand-gray-light pb-2">
                            <span className="text-slate-500 text-sm font-medium">소속</span>
                            <span className="text-slate-700 text-sm">{user.department}</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-gray-light pb-2">
                            <span className="text-slate-500 text-sm font-medium">사번</span>
                            <span className="text-slate-700 text-sm">{user.id}</span>
                        </div>
                         <div className="flex justify-between border-b border-brand-gray-light pb-2">
                            <span className="text-slate-500 text-sm font-medium">이메일</span>
                            <span className="text-slate-700 text-sm truncate max-w-[150px]" title={user.email}>{user.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-gray-light pb-2">
                            <span className="text-slate-500 text-sm font-medium">연구실</span>
                            <span className="text-slate-700 text-sm">공학관 401호</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button onClick={() => setActiveView('profile')} className="w-full" variant="secondary">
                            내 정보 수정
                        </Button>
                    </div>
                </div>
            </Card>
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-2">
             <Card 
                title="공지사항"
                className="h-full"
                titleAction={
                    <button onClick={() => setActiveView('announcements')} className="text-sm font-medium text-brand-blue hover:underline">
                        더보기 &rarr;
                    </button>
                }
            >
                <ul className="divide-y divide-brand-gray -mx-6 -my-6">
                    {MOCK_ANNOUNCEMENTS.slice(0, 3).map(ann => (
                        <li key={ann.id} className="py-4 px-6 hover:bg-slate-50 cursor-pointer" onClick={() => setActiveView('announcements')}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-md font-semibold text-slate-800 truncate">{ann.title}</h3>
                                <span className="text-sm text-slate-500 flex-shrink-0 ml-4">{ann.date}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card 
                title="학사 일정" 
                className="h-full"
                titleAction={
                    <button onClick={() => setActiveView('calendar')} className="text-sm font-medium text-brand-blue hover:underline">
                        전체 보기 &rarr;
                    </button>
                }
            >
                <div className="flex flex-col h-full">
                    <ul className="space-y-4 flex-grow">
                        {MOCK_CALENDAR_EVENTS.slice(0, 4).map(event => (
                            <li key={event.id} className="flex flex-col pb-3 border-b border-brand-gray-light last:border-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${event.category === 'academic' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                        {event.category === 'academic' ? '학사' : '휴일'}
                                    </span>
                                    <span className="text-xs text-slate-400">{event.startDate}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 mt-1">{event.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};


export const ProfessorMyLectures: React.FC<{ user: User, setActiveView: (view: string) => void }> = ({ user, setActiveView }) => {
    const initialCourses = MOCK_COURSES.filter(c => c.professor === user.name);
    const [localCourses, setLocalCourses] = useState<Course[]>(initialCourses);
    const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());

    const hasChanges = markedForDeletion.size > 0;

    const getCourseType = (id: string) => {
        if (id.startsWith('CS')) return { label: '전공필수', color: 'bg-red-100 text-red-800' };
        if (id.startsWith('MA')) return { label: '전공선택', color: 'bg-blue-100 text-blue-800' };
        return { label: '교양', color: 'bg-gray-100 text-gray-800' };
    };

    const handleToggleDelete = (courseId: string) => {
        const newMarked = new Set(markedForDeletion);
        if (newMarked.has(courseId)) {
            newMarked.delete(courseId);
        } else {
            newMarked.add(courseId);
        }
        setMarkedForDeletion(newMarked);
    };

    const handleSave = () => {
        setLocalCourses(prev => prev.filter(c => !markedForDeletion.has(c.id)));
        setMarkedForDeletion(new Set());
        alert('변경사항이 저장되었습니다.');
    };

    // Calculate effective courses for timetable (current minus marked for deletion)
    const activeCourses = localCourses.filter(c => !markedForDeletion.has(c.id));

    return (
        <div className="space-y-8">
            <Card title="강의 관리 대시보드" className="!p-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-3 p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-slate-800">주간 시간표</h3>
                            <Button variant="secondary" size="sm" onClick={() => setActiveView('prof_timetable')}>크게 보기</Button>
                        </div>
                        <ProfessorVisualTimetable courses={activeCourses} />
                    </div>
                    <div className="lg:col-span-2 p-6 bg-brand-gray-light border-l border-brand-gray flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-lg font-bold text-slate-800">강의 목록 (2024년 1학기)</h3>
                            <Button size="sm" onClick={() => alert('기능 구현 예정: 강의 등록')}>
                                + 강의 등록
                            </Button>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-2 flex-grow" style={{ maxHeight: '600px' }}>
                            {localCourses.length > 0 ? localCourses.map(course => {
                                const typeInfo = getCourseType(course.id);
                                const isMarked = markedForDeletion.has(course.id);

                                return (
                                    <div key={course.id} className={`p-4 bg-white rounded-lg border relative group transition-all duration-200 ${isMarked ? 'border-red-300 bg-red-50' : 'border-brand-gray hover:shadow-lg hover:border-brand-blue'}`}>
                                        <div className={`transition-opacity ${isMarked ? 'opacity-50' : 'opacity-100'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeInfo.color}`}>
                                                    {typeInfo.label}
                                                </span>
                                            </div>
                                            <h4 className={`font-bold ${isMarked ? 'text-slate-500 line-through' : 'text-brand-blue'}`}>{course.name}</h4>
                                            <p className="text-sm text-slate-500 mt-1">{course.id} | <span className="font-semibold">{MOCK_STUDENT_RECORDS.length}</span>명</p>
                                            <p className="text-xs text-slate-400 mt-1">{course.time}</p>
                                        </div>

                                        {!isMarked && (
                                            <div className="mt-4 border-t pt-4 flex flex-wrap gap-2">
                                                <Button size="sm" variant="secondary" onClick={() => setActiveView('student_grades')}>학생 관리</Button>
                                                <Button size="sm" variant="secondary" onClick={() => setActiveView('syllabus')}>계획서 관리</Button>
                                            </div>
                                        )}
                                        
                                        <button 
                                            onClick={() => handleToggleDelete(course.id)}
                                            className={`absolute bottom-4 right-4 transition-colors p-1 ${isMarked ? 'text-brand-blue hover:text-brand-blue-dark' : 'text-slate-400 hover:text-red-500'}`}
                                            title={isMarked ? "삭제 취소" : "강의 목록에서 제거 (저장 필요)"}
                                        >
                                            {isMarked ? (
                                                 <div className="flex items-center text-xs font-bold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v3.283a1 1 0 01-2 0V13.109A7.002 7.002 0 014.08 8.29a1 1 0 01.928-1.232z" clipRule="evenodd" />
                                                    </svg>
                                                    복구
                                                 </div>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>

                                        {isMarked && (
                                            <div className="absolute top-2 right-2">
                                                 <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">삭제 예정</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            }) : (
                                <p className="text-sm text-slate-500 text-center py-8">등록된 강의가 없습니다.</p>
                            )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-300 flex justify-end">
                             <Button 
                                size="sm" 
                                onClick={handleSave} 
                                disabled={!hasChanges}
                                className={hasChanges ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" : "bg-slate-300 text-slate-500 cursor-not-allowed"}
                            >
                                {hasChanges ? `${markedForDeletion.size}개 변경사항 저장` : '변경사항 저장'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const ProfessorStudentManagement: React.FC<{ user: User, initialTab?: 'grades' | 'list' }> = ({ user, initialTab = 'grades' }) => {
    const myCourses = MOCK_COURSES.filter(c => c.professor === user.name);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(myCourses.length > 0 ? myCourses[0] : null);
    const [activeTab, setActiveTab] = useState<'grades' | 'list'>(initialTab);

    const attendanceMap: { [key: string]: string } = {
        'Present': '출석',
        'Absent': '결석',
        'Late': '지각',
    };

    const SelectedCourseGradeAttendance = () => {
        if (!selectedCourse) return null;
        return (
            <>
                <Table headers={['학번', '이름', '소속', '출결', '성적']}>
                    {MOCK_STUDENT_RECORDS.map(student => (
                         <tr key={student.id}>
                            <td className="px-6 py-4 text-sm">{student.id}</td>
                            <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                            <td className="px-6 py-4 text-sm">{student.department}</td>
                            <td className="px-6 py-4 text-sm">{attendanceMap[student.attendance] || student.attendance}</td>
                            <td className="px-6 py-4 text-sm">
                                <select className="border-slate-300 rounded-md focus:ring-brand-blue focus:border-brand-blue text-sm">
                                    <option>미입력</option>
                                    <option>A+</option><option>A0</option><option>B+</option><option>B0</option>
                                    <option>C+</option><option>C0</option><option>D+</option><option>D0</option>
                                    <option>F</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </Table>
                <div className="mt-6 flex justify-end">
                    <Button>성적 저장</Button>
                </div>
            </>
        );
    };

    const SelectedCourseStudentList = () => {
        if (!selectedCourse) return null;
        return (
             <>
                <p className="text-slate-600 mb-4">{selectedCourse.name} 수강생 목록입니다.</p>
                <Table headers={['학번', '이름', '소속', '이메일']}>
                    {MOCK_STUDENT_RECORDS.map(s => (
                         <tr key={s.id}>
                            <td className="px-6 py-4 text-sm">{s.id}</td>
                            <td className="px-6 py-4 text-sm font-medium">{s.name}</td>
                            <td className="px-6 py-4 text-sm">{s.department}</td>
                            <td className="px-6 py-4 text-sm">{s.id.toLowerCase()}@university.ac.kr</td>
                        </tr>
                    ))}
                </Table>
            </>
        );
    };

    return (
        <Card title="학생 관리 대시보드">
            <div className="mb-6 pb-4 border-b border-slate-200 flex items-center space-x-4">
                <label htmlFor="course-select" className="font-semibold text-slate-700 shrink-0">강의 선택:</label>
                <select 
                    id="course-select"
                    value={selectedCourse?.id || ''} 
                    onChange={(e) => setSelectedCourse(myCourses.find(c => c.id === e.target.value) || null)}
                    className="block w-full max-w-sm px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                >
                    {myCourses.map(course => (
                        <option key={course.id} value={course.id}>{course.name} ({course.id})</option>
                    ))}
                </select>
            </div>

            {selectedCourse ? (
                <div>
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('grades')}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === 'grades' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                            >
                                성적/출결 관리
                            </button>
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === 'list' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                            >
                                수강생 명단
                            </button>
                        </nav>
                    </div>
                    <div className="pt-6">
                        {activeTab === 'grades' && <SelectedCourseGradeAttendance />}
                        {activeTab === 'list' && <SelectedCourseStudentList />}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-500">관리할 강의가 없습니다.</p>
                </div>
            )}
        </Card>
    );
};


// --- Placeholder Views ---

export const ProfessorSyllabus: React.FC = () => (
    <Card title="강의계획서">
        <p className="text-slate-600">강의계획서를 작성하고 수정할 수 있습니다. (UI 구현 영역)</p>
        <div className="mt-4 space-x-2">
            <Button>계획서 보기</Button>
            <Button variant="secondary">계획서 수정</Button>
        </div>
    </Card>
);

export const ProfessorCourseMaterials: React.FC = () => (
    <Card title="강의 자료">
        <p className="text-slate-600">강의 자료를 업로드하고 관리할 수 있습니다. (UI 구현 영역)</p>
        <div className="mt-4 space-x-2">
            <Button>새 파일 업로드</Button>
            <Button variant="secondary">파일 관리</Button>
        </div>
    </Card>
);

export const ProfessorAssignments: React.FC = () => (
    <Card title="과제 관리">
        <p className="text-slate-600">온라인 과제를 등록하고 제출 현황을 관리할 수 있습니다. (UI 구현 영역)</p>
        <div className="mt-4 space-x-2">
            <Button>과제 등록</Button>
            <Button variant="secondary">제출 현황 보기</Button>
        </div>
    </Card>
);

export const ProfessorTimetable: React.FC<{ user: User }> = ({ user }) => {
    const myCourses = MOCK_COURSES.filter(c => c.professor === user.name);
    return (
        <Card title="전체 강의 시간표 (2024년 1학기)">
            <div className="pt-8 px-4">
                <ProfessorVisualTimetable courses={myCourses} />
            </div>
        </Card>
    );
};


export const ProfessorCourseEvaluation: React.FC = () => (
    <Card title="강의평가 확인">
        <p className="text-slate-600">강의평가 결과를 확인할 수 있습니다. (UI 구현 영역)</p>
    </Card>
);
