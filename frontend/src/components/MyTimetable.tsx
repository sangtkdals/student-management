
import React from 'react';
import { Course } from '../types';
import { MinusCircleIcon } from './icons/Icons';

interface MyTimetableProps {
  courses: Course[];
  onRemoveCourse?: (course: Course) => void;
  showRemoveButton?: boolean;
}

const timeSlots = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`; // 09:00 to 18:00
});

const days = ['월', '화', '수', '목', '금'];
const dayToGridCol: { [key: string]: number } = { '월': 2, '화': 3, '수': 4, '목': 5, '금': 6 };

const parseCourseTime = (time: string | undefined) => {
  if (!time) return null;
  const parts = time.split(' ');
  if (parts.length < 2) return null;
  const day = parts[0];
  const [start, end] = parts[1].split('-');
  return { day, start, end };
};

const timeToGridRow = (time: string, type: 'start' | 'end') => {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutesFrom9 = (hour - 9) * 60 + minute;
  const rawRow = totalMinutesFrom9 / 30;
  
  if (type === 'start') {
    return Math.floor(rawRow) + 2;
  }
  return Math.ceil(rawRow) + 2;
};

const courseColors = [
  'bg-red-200/80 border-red-400',
  'bg-blue-200/80 border-blue-400',
  'bg-green-200/80 border-green-400',
  'bg-yellow-200/80 border-yellow-400',
  'bg-purple-200/80 border-purple-400',
  'bg-indigo-200/80 border-indigo-400',
  'bg-pink-200/80 border-pink-400',
  'bg-teal-200/80 border-teal-400',
];

const MyTimetable: React.FC<MyTimetableProps> = ({ courses, onRemoveCourse, showRemoveButton = true }) => {
  return (
    <div className="h-full p-4 overflow-auto bg-white">
      <div className="relative grid grid-cols-[50px_repeat(5,1fr)] grid-rows-[40px_repeat(18,50px)] min-w-[700px]">
        {/* Header Days */}
        {['', ...days].map((day, i) => (
          <div key={i} className="sticky top-0 z-20 flex items-center justify-center font-bold text-gray-700 text-sm bg-gray-100 border-b border-r border-gray-300">
            {day}
          </div>
        ))}

        {/* Time Labels (Sticky) */}
        {timeSlots.slice(0, -1).map((time, i) => (
            <div key={time} className="row-start-2 row-span-1 sticky left-0 bg-gray-100 z-10" style={{ gridRow: i + 2 }}>
                <div className="h-full flex items-start justify-center text-xs text-gray-500 pt-1 pr-2 border-r border-b border-gray-300">
                    {time.endsWith('00') ? time : ''}
                </div>
            </div>
        ))}

        {/* Grid Lines */}
        {Array.from({ length: 18 * 5 }).map((_, i) => (
          <div key={i} className={`border-b border-r border-gray-200 ${i % 5 === 4 ? 'border-r-gray-300' : ''}`}></div>
        ))}
        
        {/* Placed Courses */}
        {courses.map((course, index) => {
          const timeInfo = parseCourseTime(course.courseTime);
          if (!timeInfo) return null;

          const startRow = timeToGridRow(timeInfo.start, 'start');
          const endRow = timeToGridRow(timeInfo.end, 'end');
          const col = dayToGridCol[timeInfo.day];
          
          if (!col || startRow < 2 || endRow < startRow) return null;

          const colorClass = courseColors[index % courseColors.length];

          return (
            <div
              key={course.courseCode}
              className={`relative rounded-lg p-2 text-xs flex flex-col justify-center items-center shadow-lg border ${colorClass} overflow-hidden m-px z-10`}
              style={{
                gridColumn: col,
                gridRowStart: startRow,
                gridRowEnd: endRow,
              }}
            >
              {showRemoveButton && onRemoveCourse && (
                <button
                  onClick={() => onRemoveCourse(course)}
                  aria-label={`Remove ${course.courseName || course.subjectName}`}
                  className="absolute top-0.5 right-0.5 p-0.5 rounded-full text-red-500 bg-white/50 hover:bg-white/90 hover:text-red-700 transition-colors"
                >
                    <MinusCircleIcon className="h-4 w-4" />
                </button>
              )}
              <p className="font-bold text-gray-800 text-center text-[11px] leading-tight pt-2">{course.courseName || course.subjectName}</p>
              <p className="text-gray-600 text-[10px] mt-1">{course.classroom}</p>
              <p className="text-gray-600 text-[10px]">{course.professorName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTimetable;
