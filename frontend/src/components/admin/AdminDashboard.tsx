import React from "react";
import { Card } from "../ui";

export const AdminDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  </div>
);
