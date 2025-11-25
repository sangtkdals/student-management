import React, { useState, useEffect } from "react";
import type { User, AcademicSchedule, CalendarEvent, Post } from "../types";
import { Card, Button, Input } from "./ui";
import { MOCK_CALENDAR_EVENTS } from "../constants";
import axios from "axios";

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validation logic here
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        // In a real app, trigger API update here
        alert("정보가 성공적으로 수정되었습니다.");

        // Update visual state if this were a real connected component, 
        // but for now we just exit edit mode
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <Card
                title="개인 정보 관리"
                titleAction={
                    !isEditing && <Button onClick={() => setIsEditing(true)}>정보 수정</Button>
                }
            >
                <div className="flex flex-col md:flex-row md:space-x-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-6 md:mb-0 shrink-0">
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-32 w-32 rounded-full object-cover border-4 border-brand-gray-light shadow-sm"
                        />
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                            <p className="text-sm text-slate-500">{user.role === 'student' ? '학생' : user.role === 'professor' ? '교수' : '관리자'}</p>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-grow space-y-6">
                        {isEditing ? (
                            // EDIT MODE
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
                                <div className="md:col-span-2 border-b pb-2 mb-2">
                                    <h4 className="font-bold text-brand-blue text-sm uppercase tracking-wider">기본 정보 (수정 불가)</h4>
                                </div>
                                <Input
                                    label="이름"
                                    value={user.name}
                                    disabled
                                    readOnly
                                    className="bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                                <Input
                                    label="소속"
                                    value={user.department}
                                    disabled
                                    readOnly
                                    className="bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                                <Input
                                    label="아이디"
                                    value={user.id}
                                    disabled
                                    readOnly
                                    className="bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                                <Input
                                    label={user.role === 'professor' ? '교번' : '학번'}
                                    value={user.id}
                                    disabled
                                    readOnly
                                    className="bg-slate-100 text-slate-500 cursor-not-allowed"
                                />

                                <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                    <h4 className="font-bold text-brand-blue text-sm uppercase tracking-wider">연락처 및 거주지</h4>
                                </div>
                                <Input
                                    label="이메일"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@university.ac.kr"
                                />
                                <Input
                                    label="전화번호"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="010-0000-0000"
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="거주지 (주소)"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="주소를 입력하세요"
                                    />
                                </div>

                                <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                    <h4 className="font-bold text-brand-blue text-sm uppercase tracking-wider">보안</h4>
                                </div>
                                <Input
                                    label="새 비밀번호"
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="변경 시에만 입력"
                                />
                                <Input
                                    label="새 비밀번호 확인"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="비밀번호 재입력"
                                />

                                <div className="md:col-span-2 flex justify-end space-x-3 pt-6 border-t mt-2">
                                    <Button variant="secondary" onClick={handleCancel}>취소</Button>
                                    <Button onClick={handleSave}>저장하기</Button>
                                </div>
                            </div>
                        ) : (
                            // VIEW MODE
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="border-b border-slate-100 pb-2 col-span-1 md:col-span-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">기본 정보</h4>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-slate-500 mb-1">이름</span>
                                    <span className="block text-base font-semibold text-slate-800">{user.name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-slate-500 mb-1">소속</span>
                                    <span className="block text-base font-semibold text-slate-800">{user.department}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-slate-500 mb-1">아이디</span>
                                    <span className="block text-base font-semibold text-slate-800">{user.id}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-slate-500 mb-1">{user.role === 'professor' ? '교번' : '학번'}</span>
                                    <span className="block text-base font-semibold text-slate-800">{user.id}</span>
                                </div>

                                <div className="border-b border-slate-100 pb-2 col-span-1 md:col-span-2 mt-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">연락처 및 상세 정보</h4>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">이메일</span>
                                    <span className="block text-base text-slate-800">{user.email}</span>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">전화번호</span>
                                    <span className="block text-base text-slate-800">{user.phoneNumber || '-'}</span>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">거주지 (주소)</span>
                                    <span className="block text-base text-slate-800">{user.address || '-'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const NoticeBoard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get("/api/announcements")
      .then((response) => {
        const posts = response.data.map((post: any) => ({
          postId: post.postId,
          title: post.postTitle,
          content: post.postContent,
          createdAt: post.createdAt,
          writerName: post.writer.mName,
        }));
        setAnnouncements(posts);
      })
      .catch((error) => console.error("Error fetching announcements:", error));
  }, []);

  return (
    <Card title="공지사항">
      <ul className="divide-y divide-slate-200">
        {announcements.map((ann) => (
          <li key={ann.postId} className="py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">{ann.title}</h3>
              <span className="text-sm text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-slate-600">{ann.content}</p>
            <p className="mt-2 text-xs text-slate-400">게시자: {ann.writerName}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
};

// DB 타입(AcademicSchedule)과 Mock 타입(CalendarEvent) 호환 지원
type CalendarItem = AcademicSchedule | CalendarEvent;

const MonthCalendar: React.FC<{ year: number; month: number; events: CalendarItem[] }> = ({ year, month, events }) => {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  const categoryColor: { [key: string]: string } = {
    academic: "bg-blue-500 text-white",
    holiday: "bg-green-500 text-white",
    event: "bg-purple-500 text-white",
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

    const dayEvents = events.filter((e) => {
      const eventStartDate = new Date(e.startDate);
      eventStartDate.setHours(0, 0, 0, 0);
      const eventEndDate = new Date(e.endDate); // CalendarEvent, AcademicSchedule 모두 endDate 존재
      eventEndDate.setHours(0, 0, 0, 0);
      return currentDate >= eventStartDate && currentDate <= eventEndDate;
    });

    const isHoliday = dayEvents.some((event) => event.category === "holiday");
    const isSunday = dayOfWeek === 0;

    return (
      <div key={day} className="border-r border-b border-slate-200 p-2 min-h-[120px] flex flex-col relative">
        <span
          className={`font-semibold ${
            isToday
              ? "bg-brand-blue text-white rounded-full h-6 w-6 flex items-center justify-center"
              : isHoliday || isSunday
              ? "text-red-500"
              : "text-slate-700"
          }`}
        >
          {day}
        </span>
        <div className="flex-grow space-y-1 mt-1 overflow-y-auto">
          {dayEvents.map((event) => {
            // 타입 호환: scheduleId(DB) vs id(Mock)
            const id = "scheduleId" in event ? event.scheduleId : event.id;
            const colorClass = event.category && categoryColor[event.category] ? categoryColor[event.category] : "bg-gray-400 text-white";

            return (
              <div key={id} title={event.title} className={`text-xs p-1 rounded-md truncate ${colorClass}`}>
                {event.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
        {year}년 {month + 1}월
      </h3>
      <div className="grid grid-cols-7 border-t border-l border-slate-200 bg-white">
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className={`text-center font-bold text-sm py-2 border-r border-b border-slate-200 bg-slate-50 ${
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-slate-600"
            }`}
          >
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
  // Mock 데이터 타입 캐스팅
  const events = MOCK_CALENDAR_EVENTS as CalendarItem[];

  const allYears = [...new Set(events.map((e) => new Date(e.startDate).getFullYear()))].sort();
  const [selectedYear, setSelectedYear] = useState(allYears.length > 0 ? allYears[allYears.length - 1] : new Date().getFullYear());

  const eventsForYear = events.filter((event) => new Date(event.startDate).getFullYear() === selectedYear);
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Card title="학사일정">
      <div className="flex items-center justify-center space-x-2 mb-6 border-b pb-6">
        {(allYears.length > 0 ? allYears : [new Date().getFullYear()]).map((year) => (
          <Button key={year} variant={selectedYear === year ? "primary" : "secondary"} onClick={() => setSelectedYear(year)}>
            {year}년
          </Button>
        ))}
      </div>
      <div className="space-y-12 max-h-[75vh] overflow-y-auto p-1">
        {months.map((month) => (
          <MonthCalendar key={month} year={selectedYear} month={month} events={eventsForYear} />
        ))}
      </div>
    </Card>
  );
};
