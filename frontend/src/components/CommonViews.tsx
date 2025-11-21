import React, { useState } from 'react';
import type { User, CalendarEvent } from '../types';
import { Card, Button, Input } from './ui';
import { MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS } from '../constants';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => (
  <div className="space-y-8">
    <Card title="개인 정보">
      <div className="flex items-center space-x-6">
        <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div><span className="font-semibold text-slate-600">이름:</span> {user.name}</div>
          <div><span className="font-semibold text-slate-600">학번/교번:</span> {user.id}</div>
          <div><span className="font-semibold text-slate-600">소속:</span> {user.department}</div>
          <div><span className="font-semibold text-slate-600">이메일:</span> {user.email}</div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button>정보 수정</Button>
      </div>
    </Card>
    <Card title="비밀번호 변경">
      <form className="space-y-4 max-w-md">
        <Input label="현재 비밀번호" type="password" />
        <Input label="새 비밀번호" type="password" />
        <Input label="새 비밀번호 확인" type="password" />
        <div className="pt-2">
          <Button type="submit">비밀번호 변경</Button>
        </div>
      </form>
    </Card>
  </div>
);

export const NoticeBoard: React.FC = () => (
  <Card title="공지사항">
    <ul className="divide-y divide-slate-200">
      {MOCK_ANNOUNCEMENTS.map(ann => (
        <li key={ann.id} className="py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">{ann.title}</h3>
            <span className="text-sm text-slate-500">{ann.date}</span>
          </div>
          <p className="mt-2 text-slate-600">{ann.content}</p>
          <p className="mt-2 text-xs text-slate-400">게시자: {ann.author}</p>
        </li>
      ))}
    </ul>
  </Card>
);

const MonthCalendar: React.FC<{ year: number; month: number; events: CalendarEvent[] }> = ({ year, month, events }) => {
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const categoryColor = {
        academic: 'bg-blue-500 text-white',
        holiday: 'bg-green-500 text-white',
        event: 'bg-purple-500 text-white',
    };

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="border-r border-b border-slate-200"></div>);

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const currentDate = new Date(year, month, day);
        currentDate.setHours(0, 0, 0, 0);
        const dayOfWeek = currentDate.getDay(); // 0 for Sunday

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


export const AcademicCalendar: React.FC = () => {
    const allYears = [...new Set(MOCK_CALENDAR_EVENTS.map(e => new Date(e.startDate).getFullYear()))].sort();
    const [selectedYear, setSelectedYear] = useState(allYears.length > 0 ? allYears[allYears.length - 1] : new Date().getFullYear());

    const eventsForYear = MOCK_CALENDAR_EVENTS.filter(
        event => new Date(event.startDate).getFullYear() === selectedYear
    );

    const months = Array.from({ length: 12 }, (_, i) => i); // 0-11 for Jan-Dec

    return (
        <Card title="학사일정">
            <div className="flex items-center justify-center space-x-2 mb-6 border-b pb-6">
                <span className="font-semibold mr-2">년도 선택:</span>
                {(allYears.length > 0 ? allYears : [new Date().getFullYear()]).map(year => (
                    <Button
                        key={year}
                        variant={selectedYear === year ? 'primary' : 'secondary'}
                        onClick={() => setSelectedYear(year)}
                    >
                        {year}년
                    </Button>
                ))}
            </div>

            <div className="space-y-12 max-h-[75vh] overflow-y-auto p-1">
                {months.map(month => (
                    <MonthCalendar
                        key={month}
                        year={selectedYear}
                        month={month}
                        events={eventsForYear.filter(e => {
                            const eventStart = new Date(e.startDate);
                            const eventEnd = new Date(e.endDate);
                            const monthStart = new Date(selectedYear, month, 1);
                            const monthEnd = new Date(selectedYear, month + 1, 0);
                            return eventStart <= monthEnd && eventEnd >= monthStart;
                        })}
                    />
                ))}
            </div>
        </Card>
    );
};
