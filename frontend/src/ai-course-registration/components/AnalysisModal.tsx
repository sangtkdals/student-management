
import React from 'react';
import { Course, AnalysisResult } from '../types';
import { BrainIcon } from './icons/Icons';
import StarRating from './StarRating';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, course, analysis, isAnalyzing, error }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center p-10">
          <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-700">AI가 강의평을 분석 중입니다...</p>
          <p className="text-sm text-gray-500">텍스트 마이닝 및 감정 분석 진행 중</p>
        </div>
      );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center">
                <p className="text-xl font-bold text-red-600">분석 실패</p>
                <p className="mt-2 text-gray-600">{error}</p>
            </div>
        );
    }

    if (analysis) {
      return (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📝 AI 요약</h3>
            <p className="text-gray-700 bg-purple-50 border border-purple-100 p-4 rounded-lg leading-relaxed shadow-sm">
              {analysis.summary}
            </p>
          </div>

          {analysis.keywords && analysis.keywords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">🔑 핵심 키워드</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">👍</span>
                긍정 리뷰
              </h3>
              <ul className="space-y-3">
                {analysis.pros.map((pro, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">👎</span>
                부정 리뷰
              </h3>
              <ul className="space-y-3">
                {analysis.cons.map((con, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">⭐ 종합 평점</h3>
            <div className="flex items-center gap-3">
                <StarRating rating={analysis.rating} />
                <div className="flex items-baseline">
                    <span className="font-bold text-gray-900 text-2xl">{analysis.rating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">/ 5.0</span>
                </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="analysis-modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full bg-opacity-20">
                <BrainIcon className="h-6 w-6 text-white" />
            </div>
            <h2 id="analysis-modal-title" className="text-xl font-bold text-white">
              AI 강의 분석: {course?.name}
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {renderContent()}

        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl text-right">
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
