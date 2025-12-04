import React, { useState } from "react";
import { Card, Button, Input } from "../ui";

export const StudentCertificateRequest: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    certificateType: "재학증명서",
    purpose: ""
  });

  const certificateTypes = [
    "재학증명서",
    "졸업증명서",
    "졸업예정증명서",
    "휴학증명서",
    "제적증명서",
    "성적증명서",
    "교육비납입증명서",
    "장학금수혜증명서"
  ];

  const handleSubmit = () => {
    if (!formData.purpose.trim()) {
      alert("발급 목적을 입력하세요.");
      return;
    }

    alert(`${formData.certificateType}가 발급되었습니다.\n발급 목적: ${formData.purpose}`);
    setIsModalOpen(false);
    setFormData({ certificateType: "재학증명서", purpose: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="증명서 발급">
        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-4">
            필요한 증명서를 선택하고 발급 목적을 입력하여 즉시 발급받을 수 있습니다.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>증명서 발급</Button>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="font-bold text-slate-800 mb-3">발급 가능한 증명서</h3>
          <div className="grid grid-cols-2 gap-3">
            {certificateTypes.map((type) => (
              <div key={type} className="flex items-center text-sm text-slate-700">
                <span className="w-2 h-2 bg-brand-blue rounded-full mr-2"></span>
                {type}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 발급 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-xl font-bold mb-4">증명서 발급</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">증명서 종류</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                value={formData.certificateType}
                onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
              >
                {certificateTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <Input
              label="발급 목적"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="예: 취업, 장학금 신청 등"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button onClick={handleSubmit}>발급</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
