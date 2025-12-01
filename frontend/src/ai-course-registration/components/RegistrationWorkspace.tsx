import React, { useState } from 'react';
import { Course } from '../types';
import SelectedCourses from './SelectedCourses';
import MyTimetable from './MyTimetable';
import Wishlist from './Wishlist';
import { ListBulletIcon, TableCellsIcon, BookmarkIcon } from './icons/Icons';

interface RegistrationWorkspaceProps {
  courses: Course[];
  wishlist: Course[];
  onRemoveCourse: (course: Course) => void;
  onRemoveFromWishlist: (course: Course) => void;
  onRegisterFromWishlist: (course: Course) => void;
}

type View = 'list' | 'MyTimetable' | 'wishlist';

const RegistrationWorkspace: React.FC<RegistrationWorkspaceProps> = ({ courses, wishlist, onRemoveCourse, onRemoveFromWishlist, onRegisterFromWishlist }) => {
  const [activeView, setActiveView] = useState<View>('list');

  const TabButton: React.FC<{ view: View, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeView === view ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[75vh]">
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">수강신청 내역</h2>
        <div className="flex gap-2">
          <TabButton view="list" label="신청 목록" icon={<ListBulletIcon className="h-5 w-5" />} />
          <TabButton view="wishlist" label="관심강의" icon={<BookmarkIcon className="h-5 w-5" />} />
          <TabButton view="MyTimetable" label="시간표" icon={<TableCellsIcon className="h-5 w-5" />} />
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden">
        {activeView === 'list' && (
          <SelectedCourses courses={courses} onRemoveCourse={onRemoveCourse} />
        )}
        {activeView === 'wishlist' && (
          <Wishlist 
            courses={wishlist} 
            onRemoveFromWishlist={onRemoveFromWishlist}
            onRegisterFromWishlist={onRegisterFromWishlist}
          />
        )}
        {activeView === 'MyTimetable' && (
          <MyTimetable courses={courses} onRemoveCourse={onRemoveCourse} />
        )}
      </div>
    </div>
  );
};

export default RegistrationWorkspace;
