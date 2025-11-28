
import React from 'react';
import { User } from '../types';
import { UserCircleIcon, AcademicCapIcon } from './icons/Icons';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-md">
                <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                동의대학교 수강신청
            </h1>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-6 w-6 text-blue-600" />
                <div className="hidden md:block">
                    <span className="font-semibold">{user.name}</span>
                    <span className="mx-1">|</span>
                    <span>{user.studentId}</span>
                </div>
            </div>
            <div className="hidden lg:block bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">
                {user.major} ({user.year}학년)
            </div>
             <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg text-xs">
                로그아웃
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
