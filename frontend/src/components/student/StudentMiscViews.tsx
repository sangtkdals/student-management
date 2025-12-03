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

export const StudentGraduationCheck: React.FC = () => (
  <PlaceholderView title="졸업 요건 조회" desc="졸업에 필요한 학점 및 필수 이수 과목 충족 여부를 확인합니다." />
);

export const StudentCertificateIssuance: React.FC = () => (
  <PlaceholderView title="증명서 발급" desc="재학증명서, 성적증명서 등 각종 증명서를 발급받을 수 있습니다." />
);
