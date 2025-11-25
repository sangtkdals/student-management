import React, { useState } from 'react';
import type { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { Button, Input, Modal } from './ui';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack, initialRole = 'student' }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Registration State
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regData, setRegData] = useState({
    m_id: '',
    m_pwd: '',
    m_name: '',
    m_email: '',
    m_phone: '',
    m_num: '',
    m_addr: '',
    dept_code: '',
    // Student specific
    stu_grade: '',
    enrollment_status: '재학', // Default
    // Professor specific
    m_no: '', // used for both student no and employee no
    position: '',
    office_room: '',
    major_field: '',
    start_date: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setRegData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });

        if (response.ok) {
            const data = await response.json();
            const adaptedUser: User = {
                id: data.userId,
                memberNo: data.memberNo || data.userId,
                name: data.name,
                role: data.role.toLowerCase() as UserRole,
                email: data.email || `${data.userId}@university.ac.kr`,
                deptCode: data.deptCode || "UNKNOWN",
                departmentName: data.departmentName || "Unknown Dept",
                avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            };
            onLogin(adaptedUser);
            return;
        } else {
            const errorText = await response.text();
            console.warn("Backend login failed:", errorText);
            // Fallthrough to mock if backend fails (optional, but good for dev)
        }
    } catch (err) {
        console.warn("Backend connection failed, trying mock login.");
    }

    // Mock Login Fallback
    const usersArray = Object.values(MOCK_USERS) as any[]; 
    const user = usersArray.find(u => u.id === userId && u.role === role);
    const adminUser = usersArray.find(u => u.id === userId && u.role === 'admin');
    
    let isAuthenticated = false;
    if (user && password === '1234') isAuthenticated = true;

    if (isAuthenticated && user) {
        const safeUser: User = {
            ...user,
            memberNo: user.memberNo || user.id,
            deptCode: user.deptCode || 'DEPT_000',
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
        setError('로그인 실패: ID 또는 비밀번호를 확인하세요.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
        ...regData,
        m_type: regRole
    };

    try {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setModalMessage("회원가입이 완료되었습니다. 로그인해주세요.");
            setIsModalOpen(true);
            setView('login');
        } else {
            const msg = await response.text();
            setModalMessage("회원가입 실패: " + msg);
            setIsModalOpen(true);
        }
    } catch (err) {
        setModalMessage("서버 연결 실패. 나중에 다시 시도해주세요.");
        setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  if (view === 'register') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-gray-light p-4 overflow-y-auto">
            <div className="w-full max-w-2xl my-8">
                <div className="text-center mb-8 cursor-pointer" onClick={onBack}>
                    <h1 className="text-3xl font-bold text-brand-blue">회원가입</h1>
                </div>
                <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
                    <div className="flex justify-center mb-6 border-b pb-4">
                        <button 
                            type="button"
                            onClick={() => setRegRole('student')}
                            className={`px-6 py-2 mx-2 font-bold rounded-full transition-colors duration-300 ${regRole === 'student' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                            학생 가입
                        </button>
                        <button 
                            type="button"
                            onClick={() => setRegRole('professor')}
                            className={`px-6 py-2 mx-2 font-bold rounded-full transition-colors duration-300 ${regRole === 'professor' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                            교수 가입
                        </button>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div key={regRole} className="fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">기본 정보</h3>
                            </div>
                            <Input label="아이디" value={regData.m_id} onChange={e => handleInputChange('m_id', e.target.value)} required />
                            <Input label="비밀번호" type="password" value={regData.m_pwd} onChange={e => handleInputChange('m_pwd', e.target.value)} required />
                            <Input label="이름" value={regData.m_name} onChange={e => handleInputChange('m_name', e.target.value)} required />
                            <Input label="이메일" type="email" value={regData.m_email} onChange={e => handleInputChange('m_email', e.target.value)} required />
                            <Input label="전화번호" value={regData.m_phone} onChange={e => handleInputChange('m_phone', e.target.value)} placeholder="010-0000-0000" />
                            <Input label="주민등록번호" value={regData.m_num} onChange={e => handleInputChange('m_num', e.target.value)} placeholder="000000-0000000" />
                            <div className="md:col-span-2">
                                <Input label="주소" value={regData.m_addr} onChange={e => handleInputChange('m_addr', e.target.value)} />
                            </div>
                            <Input label="학과 코드" value={regData.dept_code} onChange={e => handleInputChange('dept_code', e.target.value)} placeholder="예: CS01" />

                            <div className="md:col-span-2 mt-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                    {regRole === 'student' ? '학생 정보' : '교직원 정보'}
                                </h3>
                            </div>

                            {regRole === 'student' && (
                                <>
                                    <Input label="학번" value={regData.m_no} onChange={e => handleInputChange('m_no', e.target.value)} required />
                                    <Input label="학년" type="number" value={regData.stu_grade} onChange={e => handleInputChange('stu_grade', e.target.value)} />
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">학적 상태</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                            value={regData.enrollment_status}
                                            onChange={e => handleInputChange('enrollment_status', e.target.value)}
                                        >
                                            <option value="재학">재학</option>
                                            <option value="휴학">휴학</option>
                                            <option value="졸업">졸업</option>
                                            <option value="제적">제적</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {regRole === 'professor' && (
                                <>
                                    <Input label="교번/사번" value={regData.m_no} onChange={e => handleInputChange('m_no', e.target.value)} required />
                                    <Input label="직위" value={regData.position} onChange={e => handleInputChange('position', e.target.value)} placeholder="예: 정교수, 조교수" />
                                    <Input label="연구실 (호실)" value={regData.office_room} onChange={e => handleInputChange('office_room', e.target.value)} />
                                    <Input label="전공 분야" value={regData.major_field} onChange={e => handleInputChange('major_field', e.target.value)} />
                                    <Input label="임용일" type="date" value={regData.start_date} onChange={e => handleInputChange('start_date', e.target.value)} />
                                </>
                            )}
                        </div>

                        <div className="md:col-span-2 mt-6">
                            <Button type="submit" className="w-full text-lg py-3">가입하기</Button>
                            <button 
                                type="button" 
                                onClick={() => setView('login')}
                                className="w-full mt-2 py-2 text-slate-600 hover:text-brand-blue text-sm font-medium"
                            >
                                이미 계정이 있으신가요? 로그인하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title="알림">
                <div className="p-4">{modalMessage}</div>
            </Modal>
        </div>
      );
  }

  // Login View
  return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray-light p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8 cursor-pointer" onClick={onBack}>
             <h1 className="text-3xl font-bold text-brand-blue">학사 관리 시스템</h1>
            </div>
            <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                     <div className="grid grid-cols-2 gap-2 p-1 bg-brand-gray-light rounded-md">
                        <button type="button" onClick={() => setRole('student')} className={`w-full px-4 py-2 text-sm font-bold rounded ${role === 'student' ? 'bg-brand-blue text-white' : 'text-slate-500'}`}>학생</button>
                        <button type="button" onClick={() => setRole('professor')} className={`w-full px-4 py-2 text-sm font-bold rounded ${role === 'professor' ? 'bg-brand-blue text-white' : 'text-slate-500'}`}>교수</button>
                     </div>
                     
                     <Input label="ID" value={userId} onChange={e => setUserId(e.target.value)} />
                     <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                     
                     {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                     
                     <Button type="submit" className="w-full">로그인</Button>

                     <div className="text-center pt-2">
                        <button 
                            type="button" 
                            onClick={() => setView('register')}
                            className="text-sm text-slate-500 hover:text-brand-blue underline"
                        >
                            계정이 없으신가요? 회원가입
                        </button>
                     </div>

                     <div className="text-sm text-center pt-4 mt-4 border-t border-slate-200">
                        <span onClick={onBack} className="font-medium text-slate-600 hover:text-brand-blue cursor-pointer">&larr; 홈으로 돌아가기</span>
                    </div>
                </form>
            </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="알림">
            <div className="p-4">{modalMessage}</div>
        </Modal>
      </div>
  );
};

export default Auth;
