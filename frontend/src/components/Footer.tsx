import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-gray mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:justify-between md:items-center">
          <div className="text-sm text-slate-500">&copy; {new Date().getFullYear()} University Academic System. All rights reserved.</div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">
              개인정보처리방침
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">
              이용약관
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-brand-blue">
              연락처
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
