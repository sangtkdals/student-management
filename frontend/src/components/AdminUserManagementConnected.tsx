import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Button } from './ui';
import { getAllUsers } from '../api/services';

interface UserData {
    id: string;
    name: string;
    role: 'student' | 'professor' | 'admin';
    email: string;
    department: string;
    avatarUrl: string;
}

export const AdminUserManagementConnected: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'professor'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await getAllUsers();

            const roleMap: { [key: string]: 'student' | 'professor' | 'admin' } = {
                'STUDENT': 'student',
                'PROFESSOR': 'professor',
                'ADMIN': 'admin'
            };

            const mappedUsers: UserData[] = data.map((user: any) => {
                const userRole = roleMap[(user.mType || user.mtype || '').toUpperCase()] || 'student';

                return {
                    id: user.mId || user.mid || '',
                    name: user.mName || user.mname || '',
                    role: userRole,
                    email: user.mEmail || user.memail || '',
                    department: user.deptCode || user.deptcode || '',
                    avatarUrl: `https://picsum.photos/seed/${user.mId || user.mid}/100`
                };
            });

            setAllUsers(mappedUsers);
        } catch (error) {
            console.error('Failed to load users:', error);
            alert('사용자 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            const matchesSearch = searchTerm === '' ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [allUsers, selectedRole, searchTerm]);

    const roleMap: { [key: string]: string } = {
        'student': '학생',
        'professor': '교수',
        'admin': '관리자',
    };

    if (isLoading) {
        return (
            <Card title="사용자 명단 조회">
                <div className="flex justify-center items-center py-12">
                    <div className="text-slate-500">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="사용자 명단 조회">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedRole('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedRole === 'all'
                                ? 'bg-brand-blue text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setSelectedRole('student')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedRole === 'student'
                                ? 'bg-brand-blue text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        학생
                    </button>
                    <button
                        onClick={() => setSelectedRole('professor')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedRole === 'professor'
                                ? 'bg-brand-blue text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        교수
                    </button>
                </div>
                <div className="flex-1 md:max-w-xs">
                    <input
                        type="text"
                        placeholder="이름, ID, 학과 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
            </div>

            <div className="mb-4 text-sm text-slate-600">
                총 <span className="font-bold text-brand-blue">{filteredUsers.length}</span>명
            </div>

            <div className="overflow-x-auto">
                <Table headers={['사진', 'ID', '이름', '역할', '소속', '이메일', '관리']}>
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-slate-700">{user.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                                    user.role === 'professor' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                }`}>
                                    {roleMap[user.role]}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{user.department || '-'}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                            <td className="px-6 py-4 text-sm">
                                <button className="text-brand-blue hover:text-brand-blue-dark font-medium">
                                    상세보기
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
        </Card>
    );
};
