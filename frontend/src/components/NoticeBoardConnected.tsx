import React, { useState, useEffect } from 'react';
import { Card } from './ui';
import { getAllAnnouncements } from '../api/services';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
}

export const NoticeBoardConnected: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setIsLoading(true);
            const data = await getAllAnnouncements();

            const mappedAnnouncements: Announcement[] = data.map((ann: any) => ({
                id: String(ann.postId || ann.postid || ann.id),
                title: ann.title || '',
                content: ann.content || '',
                author: ann.author || '관리자',
                date: ann.postDate || ann.postdate || new Date().toISOString().split('T')[0]
            }));

            // 최신순으로 정렬
            mappedAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setAnnouncements(mappedAnnouncements);
        } catch (error) {
            console.error('Failed to load announcements:', error);
            // 실패 시 빈 배열 유지
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Card title="공지사항">
                <div className="flex justify-center items-center py-12">
                    <div className="text-slate-500">로딩 중...</div>
                </div>
            </Card>
        );
    }

    if (announcements.length === 0) {
        return (
            <Card title="공지사항">
                <div className="text-center py-12 text-slate-500">
                    등록된 공지사항이 없습니다.
                </div>
            </Card>
        );
    }

    return (
        <Card title="공지사항">
            <ul className="divide-y divide-slate-200">
                {announcements.map(ann => (
                    <li key={ann.id} className="py-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">{ann.title}</h3>
                            <span className="text-sm text-slate-500">{ann.date}</span>
                        </div>
                        <p className="mt-2 text-slate-600">{ann.content}</p>
                        <p className="mt-2 text-xs text-slate-400">게시자: {ann.author}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
};
