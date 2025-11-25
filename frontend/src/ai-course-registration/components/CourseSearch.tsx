import React from 'react';
import { Course } from '../types';
import { SearchIcon, PlusCircleIcon, StarIcon, BrainIcon } from './icons/Icons';

interface CourseSearchProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onAddInterestedCourse: (course: Course) => void;
  onAnalyzeCourse: (course: Course) => void;
  selectedCourseIds: Set<number>;
  wishlistCourseIds: Set<number>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({ courses, onAddCourse, onAddInterestedCourse, onAnalyzeCourse, selectedCourseIds, wishlistCourseIds, searchTerm, setSearchTerm, filterType, setFilterType }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[75vh]">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800 mb-4">강의 검색</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="과목명, 교수명, 과목코드 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="All">전체</option>
            <option value="Major Requirement">전공필수</option>
            <option value="Major Elective">전공선택</option>
            <option value="General Elective">교양</option>
          </select>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">과목 정보</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">기능</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length > 0 ? courses.map(course => {
              const isSelected = selectedCourseIds.has(course.id);
              const isInWishlist = wishlistCourseIds.has(course.id);
              const isFull = course.enrolled >= course.capacity;
              const registrationDisabled = isSelected || isFull;
              const wishlistDisabled = isSelected || isInWishlist;

              return (
                <tr key={course.id} className={`hover:bg-blue-50 transition-colors duration-200 ${isSelected ? 'bg-gray-100 text-gray-400' : ''}`}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-blue-700">{course.name} <span className="text-xs text-gray-500">({course.code})</span></p>
                        <p className="text-xs text-gray-600 mt-1">{course.professor} | {course.credits}학점 | {course.type}</p>
                        <p className="text-xs text-gray-600 mt-1">{course.time} | {course.location}</p>
                         <p className={`text-xs mt-1 font-medium ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                            인원: {course.enrolled}/{course.capacity}
                        </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onAnalyzeCourse(course)}
                          title="AI 강의 분석"
                          className="p-2 rounded-full text-purple-500 hover:bg-purple-100 transition-transform transform hover:scale-110"
                        >
                          <BrainIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => onAddInterestedCourse(course)}
                          disabled={wishlistDisabled}
                          title="관심강의 추가"
                          className={`p-2 rounded-full transition-transform transform hover:scale-110 ${
                            wishlistDisabled ? 'cursor-not-allowed opacity-40' : 'text-yellow-500 hover:bg-yellow-100'
                          }`}
                        >
                          <StarIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => onAddCourse(course)}
                          disabled={registrationDisabled}
                          title="수강신청"
                          className={`p-2 rounded-full transition-transform transform hover:scale-110 ${
                            registrationDisabled ? 'cursor-not-allowed opacity-40' : 'text-green-500 hover:bg-green-100'
                          }`}
                        >
                          <PlusCircleIcon className="h-7 w-7" />
                        </button>
                    </div>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={2} className="text-center py-10 text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseSearch;