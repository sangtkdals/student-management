import React, { useState } from "react";
import type { User } from "../../types";
import { Card, Button, Input } from "../ui";
import axios from "axios";

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { newPassword, confirmPassword, ...restFormData } = formData;

    // 1. 비밀번호 일치 확인 유효성 검사
    if (newPassword && newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    
    setIsLoading(true); // 로딩 시작

    // 2. 서버로 전송할 데이터 구성
    const updatePayload = {
      ...restFormData,
      // newPassword가 비어있지 않은 경우에만 전송 데이터에 포함
      ...(newPassword && { newPassword: newPassword }),
    };

    try {
      // 3. API 호출
      const response = await axios.post('/api/profile', updatePayload);

      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert("정보가 성공적으로 수정되었습니다.");
      }
      
      // 실제 앱에서는 성공 시 user state를 업데이트해야 화면에 반영됨
      // 예: onUpdateSuccess(updatedUserData);

      // Reset password fields and exit edit mode
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setIsEditing(false);
      
    } catch (error) {
      // 오류 응답 처리 (4xx, 5xx)
      if (axios.isAxiosError(error) && error.response) {
        alert(`업데이트 실패: ${error.response.data.error || '알 수 없는 오류가 발생했습니다.'}`);
      } else {
        // 네트워크 오류 등
        alert("서버 연결에 실패했습니다.");
        console.error("API 호출 오류:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <Card title="개인 정보 관리" titleAction={!isEditing && <Button onClick={() => setIsEditing(true)}>정보 수정</Button>}>
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6 md:mb-0 shrink-0">
            <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full object-cover border-4 border-brand-gray-light shadow-sm" />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
              <p className="text-sm text-slate-500">{user.role === "student" ? "학생" : user.role === "professor" ? "교수" : "관리자"}</p>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-grow space-y-6">
            {isEditing ? (
              // EDIT MODE
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
                <div className="md:col-span-2 border-b pb-2 mb-2">
                  <h4 className="font-bold text-brand-blue text-sm uppercase tracking-wider">기본 정보 (수정 불가)</h4>
                </div>
                <Input label="이름" value={user.name} disabled readOnly className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                <Input label="소속" value={user.department} disabled readOnly className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                <Input label="아이디" value={user.id} disabled readOnly className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                <Input
                  label={user.role === "professor" ? "교번" : "학번"}
                  value={user.memberNo}
                  disabled
                  readOnly
                  className="bg-slate-100 text-slate-500 cursor-not-allowed"
                />

                <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                  <h4 className="font-bold text-brand-blue text-sm uppercase tracking-wider">연락처 및 거주지</h4>
                </div>
                <Input label="이메일" name="email" value={formData.email} onChange={handleChange} placeholder="example@university.ac.kr" />
                <Input label="전화번호" name="phone" value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" />
                <div className="md:col-span-2">
                  <Input label="거주지 (주소)" name="address" value={formData.address} onChange={handleChange} placeholder="주소를 입력하세요" />
                </div>

                <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                  <h4 className="font-bold text-brand-blue text-sm uppercase tracking-wider">보안</h4>
                </div>
                <Input
                  label="새 비밀번호"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="변경 시에만 입력"
                />
                <Input
                  label="새 비밀번호 확인"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호 재입력"
                />

                <div className="md:col-span-2 flex justify-end space-x-3 pt-6 border-t mt-2">
                  <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
                    취소
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? '저장 중...' : '저장하기'}
                  </Button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="border-b border-slate-100 pb-2 col-span-1 md:col-span-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">기본 정보</h4>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">이름</span>
                  <span className="block text-base font-semibold text-slate-800">{user.name}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">소속</span>
                  <span className="block text-base font-semibold text-slate-800">{user.department}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">아이디</span>
                  <span className="block text-base font-semibold text-slate-800">{user.id}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">{user.role === "professor" ? "교번" : "학번"}</span>
                  <span className="block text-base font-semibold text-slate-800">{user.memberNo}</span>
                </div>

                <div className="border-b border-slate-100 pb-2 col-span-1 md:col-span-2 mt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">연락처 및 상세 정보</h4>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <span className="block text-xs font-medium text-slate-500 mb-1">이메일</span>
                  <span className="block text-base text-slate-800">{user.email}</span>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <span className="block text-xs font-medium text-slate-500 mb-1">전화번호</span>
                  <span className="block text-base text-slate-800">{user.phone || "-"}</span>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <span className="block text-xs font-medium text-slate-500 mb-1">거주지 (주소)</span>
                  <span className="block text-base text-slate-800">{user.address || "-"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
