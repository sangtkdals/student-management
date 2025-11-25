
import React from 'react';
import { Card } from './ui';
import { MOCK_ANNOUNCEMENTS, MOCK_CALENDAR_EVENTS, ICONS } from '../constants';
import type { UserRole } from '../types';

interface LandingPageProps {
    onNavigateToAuth: (role: UserRole) => void;
}

const InfoCard = ({ icon, title, items, linkText }: { icon: React.ReactElement<any>, title: string, items: string[], linkText: string }) => (
    <div className="bg-white rounded-lg border border-brand-gray p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
            <div className="text-brand-blue">{React.cloneElement(icon, { className: "h-6 w-6" })}</div>
            <h3 className="ml-3 text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <ul className="space-y-2.5 flex-grow">
            {items.map((item, index) => (
                <li key={index} className="text-sm text-slate-600 hover:text-brand-blue cursor-pointer truncate">
                    <span className="text-brand-blue mr-2">&bull;</span> {item}
                </li>
            ))}
        </ul>
        <div className="mt-6 text-right">
            <a href="#" className="text-sm font-medium text-brand-blue hover:underline">{linkText} &rarr;</a>
        </div>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        <h1 className="text-xl font-bold text-brand-blue">학사 관리 시스템</h1>
                    </div>
                    <div>
                        <button onClick={() => onNavigateToAuth('student')} className="text-slate-600 hover:text-brand-blue font-semibold px-4 py-2 rounded-md transition-colors">로그인</button>
                    </div>
                </nav>
            </header>

            <main>
                <section className="bg-brand-blue text-white">
                     <div className="container mx-auto px-6 py-24 text-center">
                         <h2 className="text-4xl font-extrabold sm:text-5xl">
                            스마트한 대학 생활의 시작
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
                            통합 학사 관리 시스템으로 학사 정보, 강의, 성적을 한 곳에서 관리하세요.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <button
                                onClick={() => onNavigateToAuth('student')}
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-md text-brand-blue bg-white hover:bg-blue-50 transition-colors"
                            >
                                학생 로그인
                            </button>
                            <button
                                onClick={() => onNavigateToAuth('professor')}
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-blue-200 text-base font-bold rounded-md text-white hover:bg-white hover:text-brand-blue transition-colors"
                            >
                                교수 로그인
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-brand-gray-light">
                    <div className="container mx-auto px-6 py-20">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <InfoCard 
                                icon={ICONS.announcement} 
                                title="주요 공지사항" 
                                items={MOCK_ANNOUNCEMENTS.slice(0, 4).map(a => a.title)}
                                linkText="더보기"
                            />
                             <InfoCard 
                                icon={ICONS.calendar} 
                                title="학사일정" 
                                items={MOCK_CALENDAR_EVENTS.slice(0, 4).map(e => `${e.title} (${e.startDate})`)}
                                linkText="전체 일정 보기"
                            />
                             <InfoCard 
                                icon={ICONS.courses} 
                                title="Quick Menu" 
                                items={['수강신청 바로가기', '성적 조회', '증명서 발급', '도서관']}
                                linkText="전체 메뉴"
                            />
                         </div>
                    </div>
                </section>
            </main>
            
            <footer className="bg-white mt-16 border-t border-brand-gray">
                <div className="container mx-auto px-6 py-6 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} University Academic System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
