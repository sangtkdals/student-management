import React, { useState } from 'react';
import type { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants'; // MOCK_USERS가 User 타입을 따른다고 가정
import { Button, Input, Modal } from './ui';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack, initialRole = 'student' }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'register' | 'forgot' | null>(null);

  // 회원가입 State
  const [regUserId, setRegUserId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regMajor, setRegMajor] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Backend Login 시도 (구조 예시)
    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });

        if (response.ok) {
            const data = await response.json();
            
            // types.ts의 User 인터페이스에 맞춰 데이터 매핑
            const adaptedUser: User = {
                id: data.userId,                 // m_id
                memberNo: data.memberNo || data.userId, // m_no (필수)
                name: data.name,                 // m_name
                role: data.role as UserRole,     // m_type
                email: data.email || `${data.userId}@university.ac.kr`,
                deptCode: data.deptCode || "UNKNOWN", // deptCode (필수)
                
                // 선택적 필드 매핑
                departmentName: data.major || data.departmentName, 
                avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            };
            onLogin(adaptedUser);
            return;
        }
    } catch (err) {
        console.warn("Backend login failed, falling back to mock data.");
    }

    // 2. Mock Login (상수 데이터 기반)
    // MOCK_USERS의 타입이 any일 수 있으므로 안전하게 접근
    const usersArray = Object.values(MOCK_USERS) as any[]; 
    const user = usersArray.find(u => u.id === userId && u.role === role);
    const adminUser = usersArray.find(u => u.id === userId && u.role === 'admin'); // 관리자 우회 로그인용
    
    let isAuthenticated = false;

    if (user) {
        // 데모용 하드코딩 비밀번호 체크
        if (password === '1234') {
            isAuthenticated = true;
        }
    }

    if (isAuthenticated && user) {
        // Mock 데이터가 types.ts의 User 필수 필드를 누락했을 경우를 대비한 방어 코드
        const safeUser: User = {
            ...user,
            memberNo: user.memberNo || user.id, // memberNo가 없으면 id로 대체
            deptCode: user.deptCode || 'DEPT_000', // deptCode가 없으면 더미 값
            email: user.email || `${user.id}@test.ac.kr`
        };
        onLogin(safeUser);
    } else if (adminUser && password === '1234') {
        const safeAdmin: User = {
             ...adminUser,
            memberNo: adminUser.memberNo || adminUser.id,
            deptCode: adminUser.deptCode || 'ADMIN_DEPT',
            email: adminUser.email || 'admin@test.ac.kr'
        };
        onLogin(safeAdmin);
    } else {
        setError('잘못된 사용자 ID 또는 비밀번호입니다. (데모 비번: 1234)');
    }
  };

  // ... handleRegister 및 나머지 UI 코드는 이전과 동일 ...
  // (생략: 모달, 폼 렌더링 부분은 types.ts 영향을 덜 받으므로 기존 코드 유지)
  
  const openModal = (type: 'register' | 'forgot') => {
    setModalContent(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
      // ... 기존 JSX 유지 ...
      <div className="min-h-screen flex items-center justify-center bg-brand-gray-light p-4">
        {/* UI 렌더링 코드는 위 로직 변경에 영향받지 않음 */}
        <div className="w-full max-w-md">
            <div className="text-center mb-8 cursor-pointer" onClick={onBack}>
             <h1 className="text-3xl font-bold text-brand-blue">학사 관리 시스템</h1>
            </div>
            <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                     {/* ... Role 선택 버튼들 ... */}
                     <div className="grid grid-cols-2 gap-2 p-1 bg-brand-gray-light rounded-md">
                        <button type="button" onClick={() => setRole('student')} className={`w-full px-4 py-2 text-sm font-bold rounded ${role === 'student' ? 'bg-brand-blue text-white' : 'text-slate-500'}`}>학생</button>
                        <button type="button" onClick={() => setRole('professor')} className={`w-full px-4 py-2 text-sm font-bold rounded ${role === 'professor' ? 'bg-brand-blue text-white' : 'text-slate-500'}`}>교수</button>
                     </div>
                     
                     <Input label="ID" value={userId} onChange={e => setUserId(e.target.value)} />
                     <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                     
                     {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                     
                     <Button type="submit" className="w-full">로그인</Button>

                     <div className="text-sm text-center pt-4 mt-4 border-t border-slate-200">
                        <span onClick={onBack} className="font-medium text-slate-600 hover:text-brand-blue cursor-pointer">&larr; 홈으로 돌아가기</span>
                    </div>
                </form>
            </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="알림">
            <div className="p-4">기능 준비중입니다.</div>
        </Modal>
      </div>
  );
};

export default Auth;