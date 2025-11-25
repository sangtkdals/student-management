import React, { useState, useEffect } from 'react';
import { Card, Button } from './ui';
import { getAllCalendarEvents, createCalendarEvent, deleteCalendarEvent } from '../api/services';

interface CalendarEvent {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    category: 'academic' | 'holiday' | 'event';
}

const MonthCalendar: React.FC<{ year: number; month: number; events: CalendarEvent[] }> = ({ year, month, events }) => {
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const categoryColor = {
        academic: 'bg-blue-500 text-white',
        holiday: 'bg-green-500 text-white',
        event: 'bg-purple-500 text-white',
    };

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="border-r border-b border-slate-200"></div>);

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const currentDate = new Date(year, month, day);
        currentDate.setHours(0, 0, 0, 0);
        const dayOfWeek = currentDate.getDay();

        const isToday = isCurrentMonth && today.getDate() === day;

        const dayEvents = events.filter(e => {
            const eventStartDate = new Date(e.startDate);
            eventStartDate.setHours(0, 0, 0, 0);
            const eventEndDate = new Date(e.endDate);
            eventEndDate.setHours(0, 0, 0, 0);
            return currentDate >= eventStartDate && currentDate <= eventEndDate;
        });

        const isHoliday = dayEvents.some(event => event.category === 'holiday');
        const isSunday = dayOfWeek === 0;

        return (
            <div key={day} className="border-r border-b border-slate-200 p-2 min-h-[120px] flex flex-col relative">
                <span className={`font-semibold ${isToday ? 'bg-brand-blue text-white rounded-full h-6 w-6 flex items-center justify-center' : isHoliday || isSunday ? 'text-red-500' : 'text-slate-700'}`}>
                    {day}
                </span>
                <div className="flex-grow space-y-1 mt-1 overflow-y-auto">
                    {dayEvents.map(event => (
                        <div key={event.id} title={event.title} className={`text-xs p-1 rounded-md truncate ${categoryColor[event.category]}`}>
                            {event.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    });

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-4">{year}년 {month + 1}월</h3>
            <div className="grid grid-cols-7 border-t border-l border-slate-200 bg-white">
                {daysOfWeek.map((day, index) => (
                    <div key={day} className={`text-center font-bold text-sm py-2 border-r border-b border-slate-200 bg-slate-50 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-slate-600'}`}>
                        {day}
                    </div>
                ))}
                {blanks}
                {dayCells}
            </div>
        </div>
    );
};

export const AcademicCalendarConnected: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        startDate: '',
        endDate: '',
        category: 'academic' as 'academic' | 'holiday' | 'event'
    });

    const months = Array.from({ length: 12 }, (_, i) => i);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setIsLoading(true);
            const data = await getAllCalendarEvents();

            const categoryMap: { [key: string]: 'academic' | 'holiday' | 'event' } = {
                'ACADEMIC': 'academic',
                'HOLIDAY': 'holiday',
                'EVENT': 'event'
            };

            const mappedEvents: CalendarEvent[] = data.map((event: any) => ({
                id: String(event.scheduleId || event.scheduleid || event.id),
                title: event.eventName || event.eventname || '',
                startDate: event.startDate || event.startdate || '',
                endDate: event.endDate || event.enddate || '',
                category: categoryMap[event.eventType || event.eventtype] || 'academic'
            }));

            setEvents(mappedEvents);
        } catch (error) {
            console.error('Failed to load calendar events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEvent = async () => {
        if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const categoryMap: { [key: string]: string } = {
                'academic': 'ACADEMIC',
                'holiday': 'HOLIDAY',
                'event': 'EVENT'
            };

            await createCalendarEvent({
                eventName: newEvent.title,
                startDate: newEvent.startDate,
                endDate: newEvent.endDate,
                eventType: categoryMap[newEvent.category],
                academicYear: currentYear
            });

            alert('일정이 추가되었습니다.');
            setNewEvent({ title: '', startDate: '', endDate: '', category: 'academic' });
            setIsAddingEvent(false);
            await loadEvents();
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('일정 추가에 실패했습니다.');
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            try {
                await deleteCalendarEvent(Number(eventId));
                alert('일정이 삭제되었습니다.');
                await loadEvents();
            } catch (error) {
                console.error('Failed to delete event:', error);
                alert('일정 삭제에 실패했습니다.');
            }
        }
    };

    if (isLoading) {
        return (
            <Card title="학사일정">
                <div className="flex justify-center items-center py-12">
                    <div className="text-slate-500">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="학사일정">
            <div className="mb-6 border-b pb-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">{currentYear}년 학사일정</h3>
                    <Button onClick={() => setIsAddingEvent(!isAddingEvent)}>
                        {isAddingEvent ? '취소' : '일정 추가'}
                    </Button>
                </div>

                {isAddingEvent && (
                    <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="text-md font-bold text-slate-800 mb-4">새 일정 추가</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">일정 제목</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="예: 중간고사"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">시작일</label>
                                <input
                                    type="date"
                                    value={newEvent.startDate}
                                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">종료일</label>
                                <input
                                    type="date"
                                    value={newEvent.endDate}
                                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
                                <select
                                    value={newEvent.category}
                                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                >
                                    <option value="academic">학사</option>
                                    <option value="holiday">휴일</option>
                                    <option value="event">행사</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setIsAddingEvent(false)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                            >
                                취소
                            </button>
                            <Button onClick={handleAddEvent}>추가하기</Button>
                        </div>
                    </div>
                )}

                {/* 일정 목록 */}
                <div className="mt-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">등록된 일정 목록</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                        {events.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">등록된 일정이 없습니다.</p>
                        ) : (
                            events
                                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                .map(event => (
                                    <div key={event.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                                    event.category === 'academic' ? 'bg-blue-100 text-blue-700' :
                                                    event.category === 'holiday' ? 'bg-green-100 text-green-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {event.category === 'academic' ? '학사' : event.category === 'holiday' ? '휴일' : '행사'}
                                                </span>
                                                <span className="font-semibold text-slate-800">{event.title}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {event.startDate} ~ {event.endDate}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-12 max-h-[75vh] overflow-y-auto p-1">
                {months.map(month => (
                    <MonthCalendar
                        key={month}
                        year={currentYear}
                        month={month}
                        events={events.filter(e => {
                            const eventStart = new Date(e.startDate);
                            const eventEnd = new Date(e.endDate);
                            const monthStart = new Date(currentYear, month, 1);
                            const monthEnd = new Date(currentYear, month + 1, 0);
                            return eventStart <= monthEnd && eventEnd >= monthStart;
                        })}
                    />
                ))}
            </div>
        </Card>
    );
};
