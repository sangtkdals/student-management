import React, { useState, useEffect } from 'react';
import type { User, Course } from '../types';
import { Card, Button, Table, Modal } from './ui';
import { MOCK_COURSES, MOCK_STUDENT_RECORDS, MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS, ICONS } from '../constants';

interface ProfessorHomeProps {
    user: User;
    setActiveView: (view: string) => void;
}

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
                const left = dayMap[slot.day] * 20; 
                
                const blockBaseClasses = "absolute rounded-lg p-1.5 text-[10px] flex flex-col overflow-hidden";

                blocks.push(
                    <div
                        key={`${course.id}-${slotIndex}`}
                        className={`${blockBaseClasses} border ${courseColors[index % courseColors.length]}`}
                        style={{
                            top: `${top}px`,
                            height: `${height-2}px`,
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
            <div className="w-12 text-right text-xs text-slate-400 flex flex-col shrink-0">
                {timeLabels.map(time => (
                    <div key={time} style={{ height: `${hourHeight}px` }} className="relative -top-2 pr-2 shrink-0">
                        {time}
                    </div>
                ))}
            </div>
            <div className="flex-1 grid grid-cols-5 relative" style={{ minHeight: `${10 * hourHeight}px`}}>
                <div className="col-span-5 grid grid-cols-5 absolute top-0 left-0 w-full h-8 -translate-y-full">
                    {days.map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-slate-600 py-1">{day}</div>
                    ))}
                </div>
                {days.map((day, index) => (
                    <div key={index} className="border-r border-slate-200 h-full"></div>
                ))}
                {timeLabels.map((_, index) => (
                    <div 
                        key={index} 
                        className="absolute w-full border-t border-dashed border-slate-200" 
                        style={{ top: `${(index) * hourHeight}px`, zIndex: -1 }}
                    ></div>
                ))}
                {getCourseBlocks()}
            </div>
        </div>
    );
};

export const ProfessorHome: React.FC<ProfessorHomeProps> = ({ user, setActiveView }) => {
  const myCourses = MOCK_COURSES.filter(c => c.professor === user.name);
  const todayDay = '월'; 
  const todayCourses = myCourses.filter(c => c.time.includes(todayDay));

  return (
    <div className="flex flex-col lg:h-full h-auto">
        <div className="bg-brand-blue w-full lg:h-1/2 h-auto py-6 px-4 sm:px-6 lg:px-8 shadow-md relative z-10 flex-shrink-0">
            <div className="max-w-7xl mx-auto h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
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
                                        교수 | {user.id}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full space-y-3 text-left flex-grow relative z-10">
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5 hover:bg-black/30 transition-colors">
                                    <span className="text-blue-200 text-xs">이메일</span>
                                    <span className="font-medium text-xs text-white truncate ml-2">{user.email}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5 hover:bg-black/30 transition-colors">
                                    <span className="text-blue-200 text-xs">연구실</span>
                                    <span className="font-medium text-xs text-white truncate ml-2">공학관 401호</span>
                                </div>
                            </div>

                            <div className="w-full mt-4 relative z-10">
                                <button onClick={() => setActiveView('profile')} className="w-full py-3 bg-white text-brand-blue font-bold text-sm rounded-lg hover:bg-blue-50 transition-all shadow-lg transform hover:-translate-y-0.5">
                                    내 정보 관리
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 h-full min-h-[300px]">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-slate-100">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <h2 className="text-lg font-bold text-brand-blue flex items-center">
                                     <span className="relative flex h-3 w-3 mr-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    오늘의 시간표
                                </h2>
                                <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">2024.05.22 (수)</span>
                            </div>
                            <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                                <div className="flex flex-col overflow-y-auto pr-2" style={{ maxHeight: '300px' }}>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">강의 일정</h3>
                                    {todayCourses.length > 0 ? (
                                        <div className="space-y-3">
                                             {todayCourses.map((course, idx) => (
                                                <div key={course.id} className="flex items-start p-4 bg-blue-50/50 rounded-xl border border-blue-100 hover:shadow-sm transition-shadow">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className={`w-1.5 h-10 rounded-full ${idx === 0 ? 'bg-brand-blue' : 'bg-slate-300'}`}></div>
                                                    </div>
                                                    <div className="ml-4 flex-grow min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-base text-slate-800 truncate">{course.name}</h4>
                                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${idx === 0 ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                                {idx === 0 ? '수업중' : '예정'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">{course.room}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{course.time}</p>
                                                    </div>
                                                </div>
                                             ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
                                            <p className="text-sm">오늘 예정된 강의가 없습니다.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col border-l border-slate-100 pl-0 md:pl-6 overflow-y-auto" style={{ maxHeight: '300px' }}>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">할 일 (To-Do)</h3>
                                    <div className="space-y-3 flex-1">
                                         {[
                                             { id: 1, text: '자료구조 과제 채점 (마감)', done: false, tag: '긴급' },
                                             { id: 2, text: '캡스톤 디자인 면담', done: false, tag: '미팅' },
                                             { id: 3, text: '학과 회의 참석 (16:00)', done: true, tag: '일정' },
                                             { id: 4, text: '다음 주 강의 자료 업로드', done: false, tag: '수업' }
                                         ].map(todo => (
                                             <label key={todo.id} className={`flex items-start p-3 rounded-lg cursor-pointer transition-all group ${todo.done ? 'bg-slate-50 opacity-60' : 'bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                                                 <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue" defaultChecked={todo.done} />
                                                 <div className="ml-3 flex-1">
                                                     <div className="flex justify-between">
                                                        <span className={`text-sm font-medium ${todo.done ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-brand-blue'}`}>{todo.text}</span>
                                                        {!todo.done && <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded ml-2 whitespace-nowrap">{todo.tag}</span>}
                                                     </div>
                                                 </div>
                                             </label>
                                         ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
        <div className="bg-brand-gray-light w-full lg:h-1/2 h-auto py-6 px-4 sm:px-6 lg:px-8 flex-shrink-0">
             <div className="max-w-7xl mx-auto h-full">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                    <div className="bg-white rounded-xl shadow-sm border border-brand-gray overflow-hidden flex flex-col h-full min-h-[250px] hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 flex-shrink-0">
                            <div className="flex items-center">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-brand-blue mr-2">
                                     {React.cloneElement(ICONS.announcement, { className: "h-4 w-4" })}
                                </div>
                                <h2 className="text-sm font-bold text-slate-800">공지사항</h2>
                            </div>
                            <button onClick={() => setActiveView('announcements')} className="text-[10px] font-bold text-slate-400 hover:text-brand-blue uppercase tracking-wide">더보기</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            <ul className="divide-y divide-slate-50">
                                {MOCK_ANNOUNCEMENTS.map(ann => (
                                    <li key={ann.id} className="py-2 px-2 hover:bg-slate-50 cursor-pointer group transition-colors rounded-lg" onClick={() => setActiveView('announcements')}>
                                        <div className="flex flex-col">
                                            <h3 className="text-xs font-bold text-slate-700 group-hover:text-brand-blue transition-colors line-clamp-1 mb-1">{ann.title}</h3>
                                            <p className="text-[10px] text-slate-500 line-clamp-1 mb-1">{ann.content}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-medium px-1.5 py-0.5 bg-slate-100 rounded-full text-slate-500">{ann.author}</span>
                                                <span className="text-[9px] text-slate-400">{ann.date}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-brand-gray overflow-hidden flex flex-col h-full min-h-[250px] hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 flex-shrink-0">
                            <div className="flex items-center">
                                <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600 mr-2">
                                     {React.cloneElement(ICONS.calendar, { className: "h-4 w-4" })}
                                </div>
                                <h2 className="text-sm font-bold text-slate-800">학사일정</h2>
                            </div>
                            <button onClick={() => setActiveView('calendar')} className="text-[10px] font-bold text-slate-400 hover:text-brand-blue uppercase tracking-wide">전체보기</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                             <div className="space-y-2">
                                    {MOCK_CALENDAR_EVENTS.slice(0, 6).map(event => {
                                        const date = new Date(event.startDate);
                                        const day = date.getDate();
                                        const month = date.getMonth() + 1;
                                        return (
                                            <div key={event.id} className="flex items-center group p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default border border-transparent hover:border-slate-100">
                                                <div className={`flex-shrink-0 w-9 h-9 flex flex-col items-center justify-center rounded-md ${event.category === 'academic' ? 'bg-blue-50 text-brand-blue' : 'bg-red-50 text-red-500'} border border-black/5 shadow-sm`}>
                                                    <span className="text-[9px] font-bold leading-none uppercase opacity-70">{month}월</span>
                                                    <span className="text-sm font-extrabold leading-none mt-0.5">{day}</span>
                                                </div>
                                                <div className="ml-3 min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-blue transition-colors">{event.title}</p>
                                                    <div className="flex items-center mt-0.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${event.category === 'academic' ? 'bg-blue-400' : 'bg-red-400'} mr-1.5`}></span>
                                                        <p className="text-[10px] text-slate-500">{event.category === 'academic' ? '학사 일정' : '공휴일'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-brand-gray overflow-hidden flex flex-col h-full min-h-[250px] hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 flex-shrink-0">
                             <div className="flex items-center">
                                <div className="p-1.5 bg-green-50 rounded-lg text-green-600 mr-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-800">바로가기</h2>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3 content-start overflow-y-auto">
                            <button onClick={() => setActiveView('lecture_timetable')} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm">
                                 <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                                     {React.cloneElement(ICONS.courses, { className: "h-5 w-5 text-brand-blue" })}
                                 </div>
                                 <span className="text-xs font-bold text-slate-700 group-hover:text-brand-blue">내 강의</span>
                            </button>
                            <button onClick={() => setActiveView('student_attendance')} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm">
                                 <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                                     {React.cloneElement(ICONS.users, { className: "h-5 w-5 text-brand-blue" })}
                                 </div>
                                 <span className="text-xs font-bold text-slate-700 group-hover:text-brand-blue">학생 관리</span>
                            </button>
                             <button onClick={() => setActiveView('lecture_timetable')} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm">
                                 <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                                     {React.cloneElement(ICONS.calendar, { className: "h-5 w-5 text-brand-blue" })}
                                 </div>
                                 <span className="text-xs font-bold text-slate-700 group-hover:text-brand-blue">시간표</span>
                            </button>
                            <button onClick={() => setActiveView('course_evaluation')} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm">
                                 <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                                     {React.cloneElement(ICONS.grades, { className: "h-5 w-5 text-brand-blue" })}
                                 </div>
                                 <span className="text-xs font-bold text-slate-700 group-hover:text-brand-blue">강의평가</span>
                            </button>
                        </div>
                    </div>
                 </div>
             </div>
        </div>
    </div>
  );
};

export const ProfessorLectureTimetable: React.FC<{ user: User, setActiveView: (view: string) => void }> = ({ user, setActiveView }) => {
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
        if (newMarked.has(courseId)) newMarked.delete(courseId);
        else newMarked.add(courseId);
        setMarkedForDeletion(newMarked);
    };

    const handleSave = () => {
        setLocalCourses(prev => prev.filter(c => !markedForDeletion.has(c.id)));
        setMarkedForDeletion(new Set());
        alert('변경사항이 저장되었습니다.');
    };

    const activeCourses = localCourses.filter(c => !markedForDeletion.has(c.id));

    return (
        <div className="space-y-8">
             <div className="bg-white rounded-lg border border-brand-gray overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-brand-gray">
                    <h2 className="text-lg font-bold text-brand-blue">강의 시간표</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-3 p-6 border-r border-brand-gray">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">주간 시간표</h3>
                        <ProfessorVisualTimetable courses={activeCourses} />
                    </div>
                    <div className="lg:col-span-2 p-6 bg-brand-gray-light flex flex-col h-full" style={{ minHeight: '600px' }}>
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-lg font-bold text-slate-800">강의 목록 (2024년 1학기)</h3>
                            <Button size="sm" onClick={() => alert('기능 구현 예정: 강의 등록')}>+ 강의 등록</Button>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-2 flex-grow" style={{ maxHeight: '600px' }}>
                            {localCourses.length > 0 ? localCourses.map(course => {
                                const typeInfo = getCourseType(course.id);
                                const isMarked = markedForDeletion.has(course.id);
                                return (
                                    <div key={course.id} className={`p-4 bg-white rounded-lg border relative group transition-all duration-200 ${isMarked ? 'border-red-300 bg-red-50' : 'border-brand-gray hover:shadow-lg hover:border-brand-blue'}`}>
                                        <div className={`transition-opacity ${isMarked ? 'opacity-50' : 'opacity-100'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeInfo.color}`}>{typeInfo.label}</span>
                                            </div>
                                            <h4 className={`font-bold ${isMarked ? 'text-slate-500 line-through' : 'text-brand-blue'}`}>{course.name}</h4>
                                            <p className="text-sm text-slate-500 mt-1">{course.id} | <span className="font-semibold">{MOCK_STUDENT_RECORDS.length}</span>명</p>
                                            <p className="text-xs text-slate-400 mt-1">{course.time}</p>
                                        </div>
                                        {!isMarked && (
                                            <div className="mt-4 border-t pt-4 flex flex-wrap gap-2">
                                                <Button size="sm" variant="secondary" onClick={() => setActiveView('student_attendance')}>학생 관리</Button>
                                                <Button size="sm" variant="secondary" onClick={() => setActiveView('syllabus')}>계획서 관리</Button>
                                            </div>
                                        )}
                                        <button onClick={() => handleToggleDelete(course.id)} className={`absolute bottom-4 right-4 transition-colors p-1 ${isMarked ? 'text-brand-blue hover:text-brand-blue-dark' : 'text-slate-400 hover:text-red-500'}`}>
                                            {isMarked ? <span className="flex items-center text-xs font-bold">복구</span> : <span className="text-xs font-bold">삭제</span>}
                                        </button>
                                        {isMarked && <div className="absolute top-2 right-2"><span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">삭제 예정</span></div>}
                                    </div>
                                );
                            }) : <p className="text-sm text-slate-500 text-center py-8">등록된 강의가 없습니다.</p>}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-300 flex justify-end">
                             <Button size="sm" onClick={handleSave} disabled={!hasChanges} className={hasChanges ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" : "bg-slate-300 text-slate-500 cursor-not-allowed"}>
                                {hasChanges ? `${markedForDeletion.size}개 변경사항 저장` : '변경사항 저장'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface WeeklyRecord { attendance: string; score: number; note: string; }

const AttendanceView: React.FC<{ selectedCourse: Course }> = ({ selectedCourse }) => {
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [weeklyData, setWeeklyData] = useState<{ [studentId: string]: { [week: number]: WeeklyRecord } }>({});
    const totalWeeks = 15;

    useEffect(() => {
        const initialData: { [studentId: string]: { [week: number]: WeeklyRecord } } = {};
        MOCK_STUDENT_RECORDS.forEach(student => {
            initialData[student.id] = {};
            for (let i = 1; i <= totalWeeks; i++) {
                initialData[student.id][i] = { attendance: Math.random() > 0.9 ? '결석' : '출석', score: 10, note: '' };
            }
        });
        setWeeklyData(initialData);
    }, []);

    const handleChange = (studentId: string, field: keyof WeeklyRecord, val: string | number) => {
        setWeeklyData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [selectedWeek]: { ...prev[studentId][selectedWeek], [field]: val } }
        }));
    };

    return (
        <>
            <div className="mb-6 flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-700">주차 선택:</span>
                    <select value={selectedWeek} onChange={(e) => setSelectedWeek(parseInt(e.target.value))} className="px-3 py-1.5 border border-slate-300 rounded-md text-sm">
                        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => <option key={week} value={week}>{week}주차</option>)}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto border border-brand-gray rounded-lg">
                <table className="min-w-full divide-y divide-brand-gray">
                    <thead className="bg-brand-gray-light">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold">학번</th>
                            <th className="px-6 py-3 text-left text-xs font-bold">이름</th>
                            <th className="px-6 py-3 text-center text-xs font-bold">출결 상태</th>
                            <th className="px-6 py-3 text-left text-xs font-bold">비고</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-brand-gray">
                        {MOCK_STUDENT_RECORDS.map(student => {
                            const record = weeklyData[student.id]?.[selectedWeek] || { attendance: '출석', score: 0, note: '' };
                            return (
                                <tr key={student.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-500">{student.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        <select value={record.attendance} onChange={(e) => handleChange(student.id, 'attendance', e.target.value)} className="px-2 py-1 rounded text-xs font-bold border">
                                            <option value="출석">출석</option>
                                            <option value="지각">지각</option>
                                            <option value="결석">결석</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <input type="text" value={record.note} onChange={(e) => handleChange(student.id, 'note', e.target.value)} className="w-full border-slate-300 rounded-md text-sm" />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex justify-end"><Button onClick={() => alert('저장되었습니다.')}>출결 저장</Button></div>
        </>
    );
};

const GradesView: React.FC<{ selectedCourse: Course }> = ({ selectedCourse }) => {
    const [studentGrades, setStudentGrades] = useState<{ [studentId: string]: { mid: number, final: number, assign: number, attend: number } }>({});

    useEffect(() => {
        const initial: any = {};
        MOCK_STUDENT_RECORDS.forEach(s => { initial[s.id] = { mid: 0, final: 0, assign: 0, attend: 0 }; });
        setStudentGrades(initial);
    }, []);

    const handleGradeChange = (sid: string, field: string, val: number) => {
        setStudentGrades(prev => ({ ...prev, [sid]: { ...prev[sid], [field]: val } }));
    };

    return (
        <div className="overflow-x-auto border border-brand-gray rounded-lg">
            <table className="min-w-full divide-y divide-brand-gray">
                <thead className="bg-brand-gray-light">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold w-20">학번</th>
                        <th className="px-4 py-3 text-left text-xs font-bold w-24">이름</th>
                        <th className="px-2 py-3 text-center text-xs font-bold">중간(30)</th>
                        <th className="px-2 py-3 text-center text-xs font-bold">기말(30)</th>
                        <th className="px-2 py-3 text-center text-xs font-bold">과제(20)</th>
                        <th className="px-2 py-3 text-center text-xs font-bold">출석(20)</th>
                        <th className="px-4 py-3 text-center text-xs font-bold bg-blue-50">총점</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-gray">
                    {MOCK_STUDENT_RECORDS.map(s => {
                        const g = studentGrades[s.id] || { mid: 0, final: 0, assign: 0, attend: 0 };
                        const total = (g.mid * 0.3) + (g.final * 0.3) + (g.assign * 0.2) + (g.attend * 0.2);
                        return (
                            <tr key={s.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm text-slate-500">{s.id}</td>
                                <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                                <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.mid} onChange={e => handleGradeChange(s.id, 'mid', parseInt(e.target.value)||0)} /></td>
                                <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.final} onChange={e => handleGradeChange(s.id, 'final', parseInt(e.target.value)||0)} /></td>
                                <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.assign} onChange={e => handleGradeChange(s.id, 'assign', parseInt(e.target.value)||0)} /></td>
                                <td className="px-2 py-3 text-center"><input type="number" className="w-14 text-center border rounded text-sm" value={g.attend} onChange={e => handleGradeChange(s.id, 'attend', parseInt(e.target.value)||0)} /></td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50">{total.toFixed(1)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="p-4 flex justify-end border-t border-brand-gray bg-slate-50"><Button onClick={() => alert("저장되었습니다.")}>성적 저장</Button></div>
        </div>
    );
};

export const ProfessorStudentManagement: React.FC<{ user: User, viewType: 'attendance' | 'grades' }> = ({ user, viewType }) => {
    const myCourses = MOCK_COURSES.filter(c => c.professor === user.name);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(myCourses.length > 0 ? myCourses[0] : null);

    return (
        <Card title={viewType === 'attendance' ? "수강생 출결 관리" : "성적 관리"}>
            <div className="mb-6 pb-4 border-b border-slate-200 flex items-center space-x-4">
                <label className="font-semibold text-slate-700 shrink-0">강의 선택:</label>
                <select value={selectedCourse?.id || ''} onChange={(e) => setSelectedCourse(myCourses.find(c => c.id === e.target.value) || null)} className="block w-full max-w-sm px-3 py-2 bg-white border border-slate-300 rounded-md text-sm">
                    {myCourses.map(course => <option key={course.id} value={course.id}>{course.name} ({course.id})</option>)}
                </select>
            </div>
            {selectedCourse ? (
                <div>
                    {viewType === 'attendance' && <AttendanceView selectedCourse={selectedCourse} />}
                    {viewType === 'grades' && <GradesView selectedCourse={selectedCourse} />}
                </div>
            ) : <div className="text-center py-12"><p className="text-slate-500">관리할 강의가 없습니다.</p></div>}
        </Card>
    );
};

export const ProfessorSyllabus: React.FC<{ user: User }> = ({ user }) => {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(MOCK_COURSES[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [syllabus, setSyllabus] = useState({ overview: '강의 개요...', objectives: '강의 목표...', textbook: '교재...', evaluation: '평가 방법...' });

    return (
        <Card title="강의계획서 관리" titleAction={<Button size="sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? '저장' : '수정'}</Button>}>
             <div className="space-y-4">
                <div><label className="font-bold">개요</label><textarea className="w-full border p-2 rounded" disabled={!isEditing} value={syllabus.overview} onChange={e => setSyllabus({...syllabus, overview: e.target.value})} /></div>
                <div><label className="font-bold">목표</label><textarea className="w-full border p-2 rounded" disabled={!isEditing} value={syllabus.objectives} onChange={e => setSyllabus({...syllabus, objectives: e.target.value})} /></div>
             </div>
        </Card>
    );
};

export const ProfessorCourseMaterials: React.FC<{ user: User }> = ({ user }) => {
    return (
        <Card title="강의 자료 관리" titleAction={<Button size="sm">+ 자료 등록</Button>}>
            <p className="text-center py-8 text-slate-500">등록된 강의 자료가 없습니다.</p>
        </Card>
    );
};

export const ProfessorAssignments: React.FC<{ user: User }> = ({ user }) => {
    return (
        <Card title="과제 관리" titleAction={<Button size="sm">+ 과제 등록</Button>}>
            <p className="text-center py-8 text-slate-500">등록된 과제가 없습니다.</p>
        </Card>
    );
};

export const ProfessorCourseEvaluation: React.FC<{ user: User }> = ({ user }) => {
    return (
        <Card title="강의평가 결과">
            <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="mt-1 text-sm text-slate-500">아직 강의 평가가 완료되지 않았거나 데이터가 없습니다.</p>
            </div>
        </Card>
    );
};
