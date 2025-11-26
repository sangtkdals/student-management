
import React, { useState, useMemo, useEffect } from 'react';
import { Course, User, AnalysisResult } from './types';
import Header from './components/Header';
import CourseSearch from './components/CourseSearch';
import RegistrationWorkspace from './components/RegistrationWorkspace';
import RegistrationSummary from './components/RegistrationSummary';
import RegistrationResult from './components/RegistrationResult';
import AnalysisModal from './components/AnalysisModal';
import { MOCK_REVIEWS } from './constants';
// import { GoogleGenAI, Type } from "@google/genai"; // Gemini API Temporarily disabled for local AI simulation

// Helper functions for time conflict checking
const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

const parseCourseTime = (time: string): { day: string; start: string; end: string } | null => {
  const parts = time.split(' ');
  if (parts.length < 2) return null;
  const day = parts[0];
  const [start, end] = parts[1].split('-');
  if (!day || !start || !end) return null;
  return { day, start, end };
};

// --- Simple Client-Side NLP Helpers ---

// Basic Korean stopwords (common particles and generic words)
const STOP_WORDS = new Set([
  '이', '가', '을', '를', '은', '는', '의', '에', '로', '으로', '과', '와', '도', '에서', '하고', '하며',
  '강의', '수업', '교수님', '교수', '수강', '학기', '내용', '부분', '정말', '진짜', '매우', '너무', '많이', 
  '그냥', '좀', '잘', '해서', '있는', '없는', '것', '거', '수', '게', '때문', '관련', '통해', '대한',
  '이다', '있다', '없다', '같다', '합니다', '입니다', '전체적으로', '개인적으로는', '아쉬운', '점도', '있었다', 
  '만족스러운', '강의였다', '다시', '들어도', '괜찮을', '다음', '학기에도', '추천하고', '싶다', '위주로', '편이다',
  '특별히', '좋지도', '나쁘지도', '않다', '가장', '제일', '어떤', '이런', '저런', '그런', '오히려', '무조건'
]);

// Extract top occurring words from an array of text strings
const analyzeKeywords = (texts: string[]): string[] => {
  const wordCounts: Record<string, number> = {};

  texts.forEach(text => {
    // Remove special chars and split by whitespace
    const words = text.replace(/[^\w\s가-힣]/g, ' ').split(/\s+/);
    
    words.forEach(word => {
      if (word.length < 2) return; // Skip single characters
      
      // Basic trimming of particles for better aggregation (Naive approach)
      let cleanWord = word;
      if (['은', '는', '이', '가', '을', '를', '도', '의', '에', '로'].some(p => cleanWord.endsWith(p))) {
          cleanWord = cleanWord.slice(0, -1);
      }
      
      if (cleanWord.length < 2) return;
      if (STOP_WORDS.has(cleanWord) || STOP_WORDS.has(word)) return;

      wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
    });
  });

  // Sort by frequency and take top 5
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

// --------------------------------------


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [wishlist, setWishlist] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [page, setPage] = useState<'registration' | 'result'>('registration');
  const [loading, setLoading] = useState(true);

  // AI Analysis Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzingCourse, setAnalyzingCourse] = useState<Course | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const showNotification = (message: string, type: 'success' | 'warning' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const tempMockUser: User = { studentId: '20211234', name: '홍길동', major: '컴퓨터공학과', year: 3, maxCredits: 18 };
        const tempMockCourses: Course[] = [
          // Use professor names that match the CSV data for better simulation
          { id: 1, code: 'CSE4001', name: '소프트웨어 공학', professor: '홍길동', credits: 3, time: '월 10:00-11:50', location: 'IT-501', type: 'Major Requirement', capacity: 50, enrolled: 45 },
          { id: 2, code: 'CSE4002', name: '데이터베이스 시스템', professor: '김영희', credits: 3, time: '화 13:00-14:50', location: 'IT-502', type: 'Major Requirement', capacity: 60, enrolled: 58 },
          { id: 3, code: 'CSE3010', name: '알고리즘 분석', professor: '이철수', credits: 3, time: '수 09:00-10:50', location: 'IT-403', type: 'Major Requirement', capacity: 40, enrolled: 30 },
          { id: 4, code: 'CSE3021', name: '운영체제', professor: '박민수', credits: 3, time: '목 15:00-16:50', location: 'IT-501', type: 'Major Elective', capacity: 45, enrolled: 45 },
          { id: 5, code: 'CSE4033', name: '인공지능', professor: '조민재', credits: 3, time: '금 10:00-11:50', location: 'IT-601', type: 'Major Elective', capacity: 35, enrolled: 25 },
          { id: 6, code: 'GED1001', name: '글쓰기와 의사소통', professor: '최수진', credits: 2, time: '월 13:00-14:50', location: '인문-201', type: 'General Elective', capacity: 100, enrolled: 95 },
          { id: 7, code: 'CSE2010', name: '자료구조', professor: '오지훈', credits: 3, time: '월 15:00-16:50', location: 'IT-401', type: 'Major Requirement', capacity: 50, enrolled: 10 },
          { id: 8, code: 'CSE2020', name: '객체지향프로그래밍', professor: '윤예린', credits: 3, time: '화 10:00-11:50', location: 'IT-402', type: 'Major Requirement', capacity: 50, enrolled: 35 },
          { id: 9, code: 'CSE3030', name: '컴퓨터네트워크', professor: '조교수', credits: 3, time: '수 13:00-14:50', location: 'IT-503', type: 'Major Elective', capacity: 45, enrolled: 40 },
          { id: 10, code: 'CSE3040', name: '웹프로그래밍', professor: '윤교수', credits: 3, time: '목 09:00-10:50', location: 'IT-505', type: 'Major Elective', capacity: 40, enrolled: 38 },
          { id: 11, code: 'CSE4050', name: '컴퓨터비전', professor: '장교수', credits: 3, time: '금 13:00-14:50', location: 'IT-602', type: 'Major Elective', capacity: 30, enrolled: 15 },
          { id: 12, code: 'CSE4060', name: '캡스톤디자인I', professor: '김교수', credits: 3, time: '금 15:00-16:50', location: 'IT-701', type: 'Major Requirement', capacity: 30, enrolled: 28 },
          { id: 13, code: 'GED1002', name: '실용영어회화', professor: 'Smith', credits: 2, time: '화 09:00-10:50', location: '어학-101', type: 'General Elective', capacity: 20, enrolled: 18 },
          { id: 14, code: 'GED1003', name: '심리학개론', professor: '임교수', credits: 2, time: '수 15:00-16:50', location: '사회-301', type: 'General Elective', capacity: 80, enrolled: 70 },
          { id: 15, code: 'GED1004', name: '4차산업혁명과미래', professor: '류교수', credits: 2, time: '목 13:00-14:50', location: '공학-105', type: 'General Elective', capacity: 100, enrolled: 100 },
          { id: 16, code: 'CSE3050', name: '모바일앱프로그래밍', professor: '송교수', credits: 3, time: '월 09:00-10:50', location: 'IT-504', type: 'Major Elective', capacity: 35, enrolled: 20 },
          { id: 17, code: 'CSE2030', name: '컴퓨터구조', professor: '양교수', credits: 3, time: '화 15:00-16:50', location: 'IT-404', type: 'Major Requirement', capacity: 55, enrolled: 40 },
          { id: 18, code: 'CSE4070', name: '빅데이터분석', professor: '황교수', credits: 3, time: '수 10:00-11:50', location: 'IT-603', type: 'Major Elective', capacity: 40, enrolled: 35 },
          { id: 19, code: 'CSE4080', name: '정보보안개론', professor: '서교수', credits: 3, time: '목 10:00-11:50', location: 'IT-502', type: 'Major Elective', capacity: 45, enrolled: 42 },
          { id: 20, code: 'GED1005', name: '축구와전술', professor: '손교수', credits: 2, time: '금 09:00-10:50', location: '체육-101', type: 'General Elective', capacity: 30, enrolled: 5 },
        ];
        setUser(tempMockUser);
        setAllCourses(tempMockCourses);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showNotification('데이터를 불러오는데 실패했습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesType = filterType === 'All' || course.type === filterType;
      const matchesSearch = searchTerm === '' ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [allCourses, searchTerm, filterType]);

  const currentCredits = useMemo(() => {
    return selectedCourses.reduce((sum, course) => sum + course.credits, 0);
  }, [selectedCourses]);

  const handleAddCourse = async (courseToAdd: Course) => {
    if (!user) return;
    if (selectedCourses.some(c => c.id === courseToAdd.id)) {
      showNotification('이미 신청한 과목입니다.', 'warning');
      return;
    }
    if (currentCredits + courseToAdd.credits > user.maxCredits) {
      showNotification('최대 수강 가능 학점을 초과합니다.', 'error');
      return;
    }

    const newCourseTimeInfo = parseCourseTime(courseToAdd.time);
    if (newCourseTimeInfo) {
      for (const selectedCourse of selectedCourses) {
        const selectedCourseTimeInfo = parseCourseTime(selectedCourse.time);
        if (selectedCourseTimeInfo && newCourseTimeInfo.day === selectedCourseTimeInfo.day) {
          const newStartTime = timeToMinutes(newCourseTimeInfo.start);
          const newEndTime = timeToMinutes(newCourseTimeInfo.end);
          const selectedStartTime = timeToMinutes(selectedCourseTimeInfo.start);
          const selectedEndTime = timeToMinutes(selectedCourseTimeInfo.end);
          if (newStartTime < selectedEndTime && newEndTime > selectedStartTime) {
            showNotification(`'${selectedCourse.name}' 과목과 시간이 겹칩니다.`, 'error');
            return;
          }
        }
      }
    }
    
    setSelectedCourses(prev => [...prev, courseToAdd]);
    setWishlist(prev => prev.filter(c => c.id !== courseToAdd.id));
    showNotification(`'${courseToAdd.name}'을(를) 신청했습니다.`, 'success');
  };

  const handleRemoveCourse = async (courseToRemove: Course) => {
    setSelectedCourses(prev => prev.filter(c => c.id !== courseToRemove.id));
  };

  const handleAddToWishlist = async (courseToAdd: Course) => {
    if (selectedCourses.some(c => c.id === courseToAdd.id)) {
      showNotification('이미 신청한 과목은 관심강의에 추가할 수 없습니다.', 'warning');
      return;
    }
    if (wishlist.some(c => c.id === courseToAdd.id)) {
      showNotification('이미 관심강의에 추가된 과목입니다.', 'warning');
      return;
    }
    setWishlist(prev => [...prev, courseToAdd]);
    showNotification(`'${courseToAdd.name}'을(를) 관심강의에 추가했습니다.`, 'success');
  };
  
  const handleRemoveFromWishlist = async (courseToRemove: Course) => {
    setWishlist(prev => prev.filter(c => c.id !== courseToRemove.id));
  };
  
  const handleRegisterFromWishlist = (courseToRegister: Course) => {
    handleAddCourse(courseToRegister);
  };
  
  const handleRegister = () => {
    if (selectedCourses.length === 0) {
      showNotification('신청할 과목을 선택해주세요.', 'warning');
      return;
    }
    setPage('result');
  };

  const handleGoBack = () => {
    setPage('registration');
  }

  /**
   * [AI Integration Update]
   * 
   * 사용자님의 요청에 따라 단순 시뮬레이션이 아닌 '실제 데이터 기반의 클라이언트 사이드 분석'으로 업그레이드했습니다.
   * 
   * 동작 원리:
   * 1. CSV에서 불러온 데이터를 해당 강의(course_id)에 맞게 필터링합니다.
   * 2. 텍스트 마이닝(Text Mining): 리뷰 텍스트 전체를 분석하여 자주 등장하는 '핵심 키워드'를 추출합니다.
   * 3. 동적 요약(Dynamic Summary): 평균 평점과 추출된 키워드를 조합하여 상황에 맞는 분석 멘트를 생성합니다.
   * 
   * 이 구조는 추후 실제 Python/LSTM 백엔드가 연결되었을 때, 응답받은 JSON 데이터를 그대로 활용할 수 있는 구조입니다.
   */
  const handleAnalyzeCourse = async (course: Course) => {
    setAnalyzingCourse(course);
    setIsModalOpen(true);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      // Simulate network delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Fetch reviews from local "Database" (MOCK_REVIEWS in constants.ts)
      const relevantReviews = MOCK_REVIEWS.filter(r => r.course_id === course.id);

      if (relevantReviews.length === 0) {
        setAnalysisResult({
          summary: "아직 등록된 수강평이 없어 분석할 데이터가 부족합니다. 첫 번째 리뷰를 남겨주세요!",
          pros: ["데이터 부족"],
          cons: ["데이터 부족"],
          rating: 0,
          keywords: []
        });
        return;
      }

      // 2. Sentiment Analysis & Text Mining
      const totalRating = relevantReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / relevantReviews.length;

      // Extract keywords from all reviews for this course
      const allReviewText = relevantReviews.map(r => r.review_text);
      const keywords = analyzeKeywords(allReviewText);

      // 3. Generate Dynamic Summary based on Analysis
      let summary = "";
      const keywordStr = keywords.length > 0 
        ? `'${keywords.slice(0, 3).join("', '")}'` 
        : '';

      if (avgRating >= 4.0) {
        summary = `학생들의 만족도가 매우 높은 강의(평점 ${avgRating.toFixed(1)})입니다. ` +
                  (keywordStr ? `주로 ${keywordStr} 등의 키워드가 긍정적으로 언급되고 있으며, ` : "") +
                  `전반적으로 추천하는 의견이 지배적입니다.`;
      } else if (avgRating >= 3.0) {
        summary = `대체로 무난한 평가(평점 ${avgRating.toFixed(1)})를 받고 있습니다. ` +
                  (keywordStr ? `수강생들은 ${keywordStr} 등을 주요 특징으로 꼽았습니다. ` : "") +
                  `개인 성향에 따라 호불호가 갈릴 수 있으니 참고하세요.`;
      } else {
        summary = `수강생들의 불만이 다소 있는 강의(평점 ${avgRating.toFixed(1)})로 분석됩니다. ` +
                  (keywordStr ? `특히 ${keywordStr} 관련하여 개선이 필요하다는 의견이 있습니다. ` : "") +
                  `수강 신청 전 신중한 고려가 필요해 보입니다.`;
      }

      // 4. Pros/Cons Classification
      // Shuffle to show different reviews each time
      const shuffledReviews = [...relevantReviews].sort(() => Math.random() - 0.5);

      const pros = shuffledReviews
        .filter(r => r.rating >= 4)
        .map(r => r.review_text)
        .slice(0, 3);

      const cons = shuffledReviews
        .filter(r => r.rating <= 2)
        .map(r => r.review_text)
        .slice(0, 3);

      // 5. Final Result Construction
      setAnalysisResult({
        summary: summary,
        pros: pros.length > 0 ? pros : ["특별한 장점이 언급되지 않았습니다."],
        cons: cons.length > 0 ? cons : ["특별한 단점이 언급되지 않았습니다."],
        rating: avgRating,
        keywords: keywords
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisError("강의 분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAnalyzingCourse(null);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  const typeClasses = {
      success: 'bg-green-500',
      warning: 'bg-yellow-500 text-gray-800',
      error: 'bg-red-500',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-600 mb-4">오류</h2>
                <p className="text-gray-700">사용자 정보를 불러올 수 없습니다. <br /> 새로고침하거나 관리자에게 문의하세요.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {notification && (
        <div className={`fixed top-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-out ${typeClasses[notification.type]}`}>
            {notification.message}
        </div>
      )}
      <Header user={user} />
      {page === 'registration' ? (
        <>
          <main className="flex-grow container mx-auto p-4 lg:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CourseSearch
                courses={filteredCourses}
                onAddCourse={handleAddCourse}
                onAddInterestedCourse={handleAddToWishlist}
                onAnalyzeCourse={handleAnalyzeCourse}
                selectedCourseIds={new Set(selectedCourses.map(c => c.id))}
                wishlistCourseIds={new Set(wishlist.map(c => c.id))}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
              />
              <RegistrationWorkspace
                courses={selectedCourses}
                wishlist={wishlist}
                onRemoveCourse={handleRemoveCourse}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onRegisterFromWishlist={handleRegisterFromWishlist}
              />
            </div>
          </main>
          <RegistrationSummary
              currentCredits={currentCredits}
              maxCredits={user.maxCredits}
              onRegister={handleRegister}
          />
        </>
      ) : (
        <RegistrationResult
          user={user}
          courses={selectedCourses}
          totalCredits={currentCredits}
          maxCredits={user.maxCredits}
          onGoBack={handleGoBack}
        />
      )}
      <AnalysisModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={analyzingCourse}
        analysis={analysisResult}
        isAnalyzing={isAnalyzing}
        error={analysisError}
      />
    </div>
  );
};

export default App;
