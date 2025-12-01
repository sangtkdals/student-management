import React from 'react';
import { Course } from '../types';
import { PlusCircleIcon, MinusCircleIcon, ClockIcon, LocationMarkerIcon } from './icons/Icons';

interface WishlistProps {
  courses: Course[];
  onRemoveFromWishlist: (course: Course) => void;
  onRegisterFromWishlist: (course: Course) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ courses, onRemoveFromWishlist, onRegisterFromWishlist }) => {
  return (
    <div className="flex-grow overflow-y-auto h-full bg-white">
      {courses.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">관심강의 목록이 비어있습니다.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">과목 정보</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">시간/장소</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900">{course.name} <span className="text-xs text-gray-500">({course.code})</span></p>
                          <p className="text-xs text-gray-600 mt-1">{course.professor} | {course.credits}학점</p>
                      </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center text-xs">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-500"/> {course.time}
                    </div>
                    <div className="flex items-center text-xs mt-1">
                      <LocationMarkerIcon className="h-4 w-4 mr-1 text-gray-500"/> {course.location}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onRegisterFromWishlist(course)}
                        title="수강신청"
                        className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-transform transform hover:scale-110"
                      >
                        <PlusCircleIcon className="h-7 w-7" />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(course)}
                        title="삭제"
                        className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-transform transform hover:scale-110"
                      >
                        <MinusCircleIcon className="h-7 w-7" />
                      </button>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Wishlist;
