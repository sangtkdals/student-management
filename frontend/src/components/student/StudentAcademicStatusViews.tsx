import React from "react";
import { Card, Button } from "../ui";

// Simple Placeholder Components for other views with standard padding
const PlaceholderView: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Card title={title}>
      <div className="text-center py-16">
        <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => alert("준비 중인 기능입니다.")}>
            자세히 보기
          </Button>
        </div>
      </div>
    </Card>
  </div>
);

export const StudentLeaveApplication: React.FC = () => <PlaceholderView title="휴학 신청" desc="일반 휴학 및 군 휴학을 신청할 수 있습니다." />;
export const StudentLeaveHistory: React.FC = () => <PlaceholderView title="휴학 내역 조회" desc="신청한 휴학 처리 현황 및 과거 내역을 확인합니다." />;
export const StudentReturnApplication: React.FC = () => <PlaceholderView title="복학 신청" desc="휴학 후 복학을 신청합니다." />;
export const StudentReturnHistory: React.FC = () => <PlaceholderView title="복학 내역 조회" desc="복학 신청 처리 현황을 확인합니다." />;
