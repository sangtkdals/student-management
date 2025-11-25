import React, { useState } from 'react';
import type { User, UserRole } from '../types';
import { Button, Input, Modal } from './ui';
import { getUserById } from '../api/services';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack, initialRole = 'student' }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [saveId, setSaveId] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'register' | 'forgot' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 백엔드 API로 사용자 정보 조회
      const userData = await getUserById(userId);

      // 백엔드가 반환하는 필드명이 소문자이므로 any 타입으로 처리
      const userDataAny = userData as any;

      // 비밀번호 필드가 없으면 (백엔드가 보안상 반환하지 않을 수 있음)
      // DB에 있는 사용자라면 로그인 성공으로 간주
      // 실제로는 백엔드에 로그인 API를 만들어야 하지만, 임시로 이렇게 처리

      // 역할 확인
      const userRole = (userDataAny.mtype || userDataAny.mType)?.toLowerCase() as UserRole;

      if (userRole === role) {
        // User 객체 생성 (소문자 필드명 사용)
        const user: User = {
          id: userDataAny.mid || userDataAny.mId,
          name: userDataAny.mname || userDataAny.mName,
          role: userRole,
          email: userDataAny.memail || userDataAny.mEmail || '',
          department: userDataAny.deptCode || '',
          avatarUrl: '',
        };

        onLogin(user);
      } else {
        setError(`선택하신 역할(${role})과 계정의 역할(${userRole})이 일치하지 않습니다.`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 중 오류가 발생했습니다. 사용자 ID를 확인해주세요.');
    } finally {
      setIsLoading(false);
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
        <div className="text-center mb-8 cursor-pointer" onClick={onBack}>
          <h1 className="text-3xl font-bold text-brand-blue">학사 관리 시스템</h1>
        </div>
        <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-3 gap-2 p-1 bg-brand-gray-light rounded-md">
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
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`w-full px-4 py-2 text-sm font-bold rounded transition-colors ${role === 'admin' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  관리자
                </button>
            </div>

            <Input label="사용자 ID" type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="학생: aaa / 교수: bbb / 관리자: admin001" required />
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
              <Button type="submit" className="w-full !py-3 !text-base !font-bold" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
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
            회원이 아니신가요?{' '}
            <span onClick={() => openModal('register')} className="font-medium text-brand-blue hover:underline cursor-pointer">
                회원가입
            </span>
        </p>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent === 'register' ? '회원가입' : 'ID/비밀번호 찾기'}>
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