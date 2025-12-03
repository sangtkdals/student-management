import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui";
import { ICONS } from "../../constants";

export const AdminDashboard: React.FC = () => {
  const adminMenus = [
    { name: "사용자 관리", path: "/admin/user-management", icon: ICONS.users },
    { name: "공지사항 관리", path: "/admin/notice-management", icon: ICONS.announcement },
    { name: "학사일정 관리", path: "/admin/schedule-management", icon: ICONS.calendar },
    { name: "휴학/복학 관리", path: "/admin/leave-management", icon: ICONS.profile },
    { name: "등록금 관리", path: "/admin/tuition-management", icon: ICONS.tuition },
    { name: "시스템 관리", path: "/admin/system-management", icon: ICONS.system },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">관리자 대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-slate-500">총 학생 수</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">1,234</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-500">총 교수 수</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">156</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-500">개설 강의 수</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">289</p>
        </Card>
      </div>

      <Card title="관리자 메뉴">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adminMenus.map((menu) => (
            <Link
              key={menu.name}
              to={menu.path}
              className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-brand-blue transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-sm"
            >
              <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                {React.cloneElement(menu.icon, { className: "h-8 w-8 text-brand-blue" })}
              </div>
              <span className="text-md font-bold text-slate-700 group-hover:text-brand-blue">{menu.name}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};
