
import React from 'react';

interface RegistrationSummaryProps {
  currentCredits: number;
  maxCredits: number;
  onRegister: () => void;
}

const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({ currentCredits, maxCredits, onRegister }) => {
  const creditPercentage = maxCredits > 0 ? (currentCredits / maxCredits) * 100 : 0;

  return (
    <footer className="sticky bottom-0 bg-white shadow-top z-10 border-t border-gray-200">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto flex-grow flex items-center justify-center md:justify-start gap-4">
          <div className="font-semibold text-gray-700">
            신청 학점: <span className="text-blue-600 font-bold text-lg">{currentCredits}</span> / {maxCredits}
          </div>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${creditPercentage}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={onRegister}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          수강신청
        </button>
      </div>
    </footer>
  );
};

export default RegistrationSummary;
