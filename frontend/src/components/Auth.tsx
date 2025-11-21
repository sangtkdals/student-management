import React, { useState } from 'react';
import type { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { Button, Input, Modal } from './ui';

interface AuthProps {
  onLogin: (user: User) => void;
  initialRole?: UserRole;
}

const Auth: React.FC<AuthProps> = ({ onLogin, initialRole = 'student' }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [saveId, setSaveId] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'register' | 'forgot' | null>(null);

  // Register State
  const [regUserId, setRegUserId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regMajor, setRegMajor] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Try Backend Login
    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });

        if (response.ok) {
            const user = await response.json();
            // Backend user object adaptation
            const adaptedUser: User = {
                id: user.userId,
                name: user.name,
                role: user.role as UserRole,
                email: `${user.userId}@example.com`, // Mock email
                department: user.major || 'Unknown',
                avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" // Default avatar
            };
            onLogin(adaptedUser);
            return;
        }
    } catch (err) {
        console.error("Backend login failed, trying mock login", err);
    }

    // 2. Fallback to Mock Login (Legacy Support)
    const user = Object.values(MOCK_USERS).find(u => u.id === userId && u.role === role);
    const adminUser = Object.values(MOCK_USERS).find(u => u.id === userId && u.role === 'admin');
    
    let isAuthenticated = false;

    if (user) {
        if (user.role === 'student' && user.id === 'aaa' && password === '1234') {
            isAuthenticated = true;
        } else if (user.role === 'professor' && user.id === 'bbb' && password === '1234') {
            isAuthenticated = true;
        }
    }

    if (isAuthenticated && user) {
        onLogin(user);
    } else if (adminUser) { // Admin can still log in with just ID for demo purposes
        onLogin(adminUser);
    } else {
        setError('잘못된 사용자 ID 또는 비밀번호입니다.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const response = await fetch('http://localhost:8080/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  userId: regUserId,
                  password: regPassword,
                  name: regName,
                  role: regRole,
                  major: regRole === 'student' ? regMajor : ''
              })
          });

          if (response.ok) {
              alert('회원가입이 완료되었습니다. 로그인해주세요.');
              closeModal();
          } else {
              const errorMsg = await response.text();
              alert(`회원가입 실패: ${errorMsg}`);
          }
      } catch (err) {
          alert('회원가입 중 오류가 발생했습니다.');
          console.error(err);
      }
  };

  const openModal = (type: 'register' | 'forgot') => {
    setModalContent(type);
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">학사 관리 시스템</h1>
        </div>
        <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-2 gap-2 p-1 bg-brand-gray-light rounded-md">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`w-full px-4 py-2 text-sm font-bold rounded transition-colors ${role === 'student' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  학생
                </button>
                <button
                  type="button"
                  onClick={() => setRole('professor')}
                  className={`w-full px-4 py-2 text-sm font-bold rounded transition-colors ${role === 'professor' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  교수
                </button>
            </div>

            <Input label="사용자 ID" type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="학생: aaa / 교수: bbb" required />
            <Input label="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input id="save-id" name="save-id" type="checkbox" checked={saveId} onChange={e => setSaveId(e.target.checked)} className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-slate-300 rounded" />
                <label htmlFor="save-id" className="ml-2 block text-slate-700">ID 저장</label>
              </div>
              <div>
                <span onClick={() => openModal('forgot')} className="font-medium text-slate-600 hover:text-brand-blue cursor-pointer">
                  ID/비밀번호 찾기
                </span>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full !py-3 !text-base !font-bold">로그인</Button>
            </div>
          </form>
        </div>
         <p className="text-center text-sm text-slate-500 mt-6">
            회원이 아니신가요?{' '}
            <span onClick={() => openModal('register')} className="font-medium text-brand-blue hover:underline cursor-pointer">
                회원가입
            </span>
        </p>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent === 'register' ? '회원가입' : 'ID/비밀번호 찾기'}>
        {modalContent === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 bg-brand-gray-light rounded-md mb-4">
                    <button
                        type="button"
                        onClick={() => setRegRole('student')}
                        className={`w-full px-4 py-2 text-sm font-bold rounded transition-colors ${regRole === 'student' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        학생
                    </button>
                    <button
                        type="button"
                        onClick={() => setRegRole('professor')}
                        className={`w-full px-4 py-2 text-sm font-bold rounded transition-colors ${regRole === 'professor' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        교수
                    </button>
                </div>

                <Input label="아이디" value={regUserId} onChange={e => setRegUserId(e.target.value)} required />
                <Input label="비밀번호" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                <Input label="이름" value={regName} onChange={e => setRegName(e.target.value)} required />
                
                {regRole === 'student' && (
                    <Input label="전공" value={regMajor} onChange={e => setRegMajor(e.target.value)} required />
                )}

                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={closeModal} type="button">취소</Button>
                    <Button type="submit">가입하기</Button>
                </div>
            </form>
        ) : (
            <div className="text-slate-600">
                이 기능은 아직 구현되지 않았습니다. 관리자에게 문의하세요.
                <div className="mt-4 flex justify-end">
                    <Button onClick={closeModal}>닫기</Button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Auth;
