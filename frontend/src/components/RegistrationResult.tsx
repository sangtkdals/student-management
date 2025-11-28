
import React from 'react';
import { Course, User } from '../types';
import MyTimetable from './MyTimetable';
import { CheckCircleIcon } from './icons/Icons';

interface RegistrationResultProps {
  courses: Course[];
  user: User;
  totalCredits: number;
  maxCredits: number;
  onGoBack: () => void;
}

const RegistrationResult: React.FC<RegistrationResultProps> = ({ courses, user, totalCredits, maxCredits, onGoBack }) => {
  return (
    <main className="flex-grow container mx-auto p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 lg:p-10 animate-fade-in">
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-800">수강신청 결과</h2>
          <p className="mt-2 text-md text-gray-600">
            {user.name} ({user.memberNo})님의 수강신청이 완료되었습니다.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700 text-lg">총 신청 학점</span>
            <div>
              <span className="text-blue-600 font-bold text-3xl">{totalCredits}</span>
              <span className="text-gray-500 font-medium ml-1"> / {maxCredits} 학점</span>
            </div>
          </div>
        </div>

        <div className="h-[65vh] border-2 border-gray-200 rounded-lg overflow-hidden shadow-inner">
          <MyTimetable courses={courses} showRemoveButton={false} />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onGoBack}
            className="w-full md:w-auto bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-10 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            수강 내역 수정하기
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default RegistrationResult;
