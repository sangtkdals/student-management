import React, { useState, useEffect } from 'react';
import { Card, Button } from './ui';
import { getAllAnnouncements, createAnnouncement, deleteAnnouncement } from '../api/services';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
}

export const AdminAnnouncementManagementConnected: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', author: '관리자' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await getAllAnnouncements();

            const mappedAnnouncements: Announcement[] = data.map((ann: any) => ({
                id: String(ann.postId || ann.postid || ann.id),
                title: ann.title || '',
                content: ann.content || '',
                author: ann.author || '관리자',
                date: ann.postDate || ann.postdate || new Date().toISOString().split('T')[0]
            }));

            // 최신순 정렬
            mappedAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setAnnouncements(mappedAnnouncements);
        } catch (error) {
            console.error('Failed to load announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            await createAnnouncement({
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                author: newAnnouncement.author
            });

            setNewAnnouncement({ title: '', content: '', author: '관리자' });
            setIsCreating(false);
            alert('공지사항이 등록되었습니다.');
            await loadAnnouncements();
        } catch (error) {
            console.error('Failed to create announcement:', error);
            alert('공지사항 등록에 실패했습니다.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteAnnouncement(parseInt(id));
                await loadAnnouncements();
            } catch (error) {
                console.error('Failed to delete announcement:', error);
                alert('공지사항 삭제에 실패했습니다.');
            }
        }
    };

    if (loading) {
        return (
            <Card title="공지사항 관리">
                <div className="flex justify-center items-center h-32">
                    <div className="text-slate-600">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card title="공지사항 관리">
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                        총 <span className="font-bold text-brand-blue">{announcements.length}</span>개의 공지사항
                    </p>
                    <Button onClick={() => setIsCreating(!isCreating)}>
                        {isCreating ? '취소' : '새 공지 작성'}
                    </Button>
                </div>

                {isCreating && (
                    <div className="mb-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">새 공지사항 작성</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                                <input
                                    type="text"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="공지사항 제목을 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">작성자</label>
                                <input
                                    type="text"
                                    value={newAnnouncement.author}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, author: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="작성자"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">내용</label>
                                <textarea
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    placeholder="공지사항 내용을 입력하세요"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                                >
                                    취소
                                </button>
                                <Button onClick={handleCreate}>등록하기</Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {announcements.length > 0 ? announcements.map(ann => (
                        <div key={ann.id} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{ann.title}</h3>
                                    <p className="text-sm text-slate-600 mb-2">{ann.content}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span>작성자: {ann.author}</span>
                                        <span>•</span>
                                        <span>{ann.date}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleDelete(ann.id)}
                                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-slate-500">
                            등록된 공지사항이 없습니다.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
