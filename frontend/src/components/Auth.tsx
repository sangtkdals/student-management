import React, { useState } from "react";
import type { User, UserRole } from "../types";
import { MOCK_USERS } from "../constants";
import { Button, Input, Modal } from "./ui";

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack, initialRole = "student" }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [saveId, setSaveId] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"register" | "forgot" | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = Object.values(MOCK_USERS).find((u) => u.id === userId && u.role === role);
    const adminUser = Object.values(MOCK_USERS).find((u) => u.id === userId && u.role === "admin");

    let isAuthenticated = false;

    if (user) {
      if (user.role === "student" && user.id === "aaa" && password === "1234") {
        isAuthenticated = true;
      } else if (user.role === "professor" && user.id === "bbb" && password === "1234") {
        isAuthenticated = true;
      }
    }

    if (isAuthenticated && user) {
      onLogin(user);
    } else if (adminUser) {
      // Admin can still log in with just ID for demo purposes
      onLogin(adminUser);
    } else {
      setError("잘못된 사용자 ID 또는 비밀번호입니다.");
    }
  };

  const openModal = (type: "register" | "forgot") => {
    setModalContent(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 cursor-pointer" onClick={onBack}>
          <h1 className="text-3xl font-bold text-brand-blue">학사 관리 시스템</h1>
        </div>
        <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-2 gap-2 p-1 bg-brand-gray-light rounded-md">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`w-full px-4 py-2 text-sm font-bold rounded transition-colors ${
                  role === "student" ? "bg-brand-blue text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
                }`}
              >
                학생
              </button>
              <button
                type="button"
                onClick={() => setRole("professor")}
                className={`w-full px-4 py-2 text-sm font-bold rounded transition-colors ${
                  role === "professor" ? "bg-brand-blue text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
                }`}
              >
                교수
              </button>
            </div>

            <Input
              label="사용자 ID"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="학생: aaa / 교수: bbb"
              required
            />
            <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="save-id"
                  name="save-id"
                  type="checkbox"
                  checked={saveId}
                  onChange={(e) => setSaveId(e.target.checked)}
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-slate-300 rounded"
                />
                <label htmlFor="save-id" className="ml-2 block text-slate-700">
                  ID 저장
                </label>
              </div>
              <div>
                <span onClick={() => openModal("forgot")} className="font-medium text-slate-600 hover:text-brand-blue cursor-pointer">
                  ID/비밀번호 찾기
                </span>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full !py-3 !text-base !font-bold">
                로그인
              </Button>
            </div>

            <div className="text-sm text-center pt-4 mt-4 border-t border-slate-200">
              <span onClick={onBack} className="font-medium text-slate-600 hover:text-brand-blue cursor-pointer">
                &larr; 홈으로 돌아가기
              </span>
            </div>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          회원이 아니신가요?{" "}
          <span onClick={() => openModal("register")} className="font-medium text-brand-blue hover:underline cursor-pointer">
            회원가입
          </span>
        </p>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent === "register" ? "회원가입" : "ID/비밀번호 찾기"}>
        <div className="text-slate-600">
          이것은 데모 버전입니다. 이 기능은 구현되지 않았습니다.
          <div className="mt-4 flex justify-end">
            <Button onClick={closeModal}>닫기</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Auth;
