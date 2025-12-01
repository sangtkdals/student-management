import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../types";
import { STUDENT_MENU, PROFESSOR_MENU, ADMIN_MENU, MenuNode } from "../navigation";

const TopNavigation: React.FC<{
  user: User;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menus = user.role === "student" ? STUDENT_MENU : user.role === "professor" ? PROFESSOR_MENU : ADMIN_MENU;
  const homePath = user.role === "professor" ? "/professor" : user.role === "student" ? "/student" : "/admin/dashboard";

  const isActiveMenu = useCallback(
    (menu: MenuNode) => {
      if (menu.path && location.pathname === menu.path) return true;
      if (menu.children && menu.children.some((child) => location.pathname.startsWith(child.path))) return true;
      return false;
    },
    [location.pathname]
  );

  return (
    <header className="bg-white border-b border-brand-gray sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate(homePath)}>
            <span className="text-brand-blue mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-brand-blue tracking-tight">학사 관리 시스템</h1>
          </div>

          {/* Main Nav Links */}
          <nav className="hidden md:flex space-x-6 h-full items-center">
            <button
              onClick={() => navigate("/announcements")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/announcements" ? "text-brand-blue font-bold" : "text-slate-600 hover:text-brand-blue"
              }`}
            >
              공지사항
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/calendar" ? "text-brand-blue font-bold" : "text-slate-600 hover:text-brand-blue"
              }`}
            >
              학사일정
            </button>
            <div className="h-4 w-px bg-slate-300 my-auto"></div>

            {menus.map((menu) => (
              <div
                key={menu.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => setHoveredMenu(menu.label)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  onClick={() => {
                    if (!menu.children && menu.path) navigate(menu.path);
                  }}
                  className={`text-sm font-medium transition-colors px-2 py-1 rounded-md flex items-center ${
                    isActiveMenu(menu) ? "text-brand-blue font-bold bg-blue-50" : "text-slate-600 hover:text-brand-blue hover:bg-slate-50"
                  } ${!menu.children ? "cursor-pointer" : "cursor-default"}`}
                >
                  {menu.label}
                  {menu.children && (
                    <svg
                      className={`ml-1 h-3 w-3 transition-transform ${hoveredMenu === menu.label ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {/* Dropdown */}
                {menu.children && hoveredMenu === menu.label && (
                  <div className="absolute top-full left-0 w-48 bg-white rounded-b-md shadow-lg py-2 border border-slate-100 animate-fade-in-down z-50">
                    {menu.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(child.path);
                          setHoveredMenu(null);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                          location.pathname === child.path ? "text-brand-blue font-bold bg-blue-50" : "text-slate-600"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none py-1 px-2 rounded-full hover:bg-slate-50"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="text-right hidden sm:block mr-1">
                <div className="text-sm font-bold text-slate-800 leading-tight">{user.name}</div>
                <div className="text-xs text-slate-500 capitalize leading-tight">{user.role}</div>
              </div>
              <img className="h-9 w-9 rounded-full border border-slate-200 object-cover" src={user.avatarUrl} alt={user.name} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  내 정보 관리
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100">
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
    </header>
  );
};

export default TopNavigation;
