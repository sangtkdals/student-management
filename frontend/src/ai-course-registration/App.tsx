import React, { useState, useEffect } from "react";
import { Course, User } from "./types";
import Header from "./components/Header";
import CourseSearch from "./components/CourseSearch";
import RegistrationWorkspace from "./components/RegistrationWorkspace";
import AnalysisModal from "./components/AnalysisModal";
import { useEnrollment } from "./hooks/useEnrollment";
import { useCourses } from "./hooks/useCourses";
import type { User as AppUser } from "../types";
import { MOCK_REVIEWS } from "./constants";

// ================================
// AI 분석용 키워드 처리 유틸
// ================================
const STOP_WORDS = new Set([
  "이", "가", "을", "를", "은", "는", "의", "에", "로", "으로", "과", "와", "도", "에서", "하고", "하며",
  "강의", "수업", "교수님", "교수", "수강", "학기", "내용", "부분", "정말", "진짜", "매우", "너무", "많이",
  "그냥", "좀", "잘", "해서", "있는", "없는", "것", "거", "수", "게", "때문", "관련", "통해", "대한",
  "이다", "있다", "없다", "같다", "합니다", "입니다", "전체적으로", "개인적으로는", "아쉬운", "점도", "있었다",
  "만족스러운", "강의였다", "다시", "들어도", "괜찮을", "다음", "학기에도", "추천하고", "싶다", "위주로", "편이다",
  "특별히", "좋지도", "나쁘지도", "않다", "가장", "제일", "어떤", "이런", "저런", "그런", "오히려", "무조건",
]);

const analyzeKeywords = (texts: string[], topN = 5): string[] => {
  const wordCounts: Record<string, number> = {};

  texts.forEach((text) => {
    if (!text || typeof text !== "string") return;
    const words = text.replace(/[^\w\s가-힣]/g, " ").split(/\s+/);

    words.forEach((word) => {
      if (word.length < 2) return;

      let cleanWord = word;
      if (
        ["은", "는", "이", "가", "을", "를", "도", "의", "에", "로"].some((p) =>
          cleanWord.endsWith(p)
        )
      ) {
        cleanWord = cleanWord.slice(0, -1);
      }

      if (cleanWord.length < 2) return;
      if (STOP_WORDS.has(cleanWord) || STOP_WORDS.has(word)) return;

      wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
    });
  });

  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
};

// 강의 분석 요약을 좀 더 다양하게 만드는 헬퍼
const buildSummary = (params: {
  courseName?: string;
  professorName?: string;
  avgRating: number;
  keywords: string[];
  totalCount: number;
  positiveCount: number;
  negativeCount: number;
}) => {
  const {
    courseName,
    professorName,
    avgRating,
    keywords,
    totalCount,
    positiveCount,
    negativeCount,
  } = params;

  const courseLabel = courseName ? `'${courseName}' 강의는 ` : "";
  const profLabel = professorName ? `(${professorName} 교수) ` : "";

  const keywordStr = keywords.length ? keywords.slice(0, 3).join(", ") : "";
  const has = (kw: string) => keywords.some((k) => k.includes(kw));

  const themes: string[] = [];
  if (has("과제")) themes.push("과제 양과 난이도");
  if (has("시험") || has("범위")) themes.push("시험 범위와 난이도");
  if (has("설명") || has("이해")) themes.push("설명 방식과 이해도");
  if (has("속도") || has("빨라")) themes.push("수업 진행 속도");
  if (has("출석")) themes.push("출석 관리");
  if (has("공지")) themes.push("공지 타이밍");

  const baseInfo = `${courseLabel}${profLabel}학생 ${totalCount}명의 수강평을 기준으로 분석한 결과, 평균 평점은 ${avgRating.toFixed(
    1
  )}점입니다. 긍정적인 평가가 ${positiveCount}건, 부정적인 평가가 ${negativeCount}건으로 집계되었습니다. `;

  const keywordInfo = keywordStr
    ? `리뷰에서 자주 등장하는 키워드는 ${keywordStr} 등입니다. `
    : "";

  const themeInfo = themes.length
    ? `특히 ${themes.join(", ")}에 대한 언급이 많았습니다. `
    : "";

  const rand = Math.random();
  let ratingSentence = "";

  if (avgRating >= 4.2) {
    if (rand < 0.33) {
      ratingSentence =
        "전반적으로 강하게 추천할 만한 강의로, 대부분의 학생이 만족감을 표현했습니다.";
    } else if (rand < 0.66) {
      ratingSentence =
        "수업 내용과 운영 방식 모두에 대한 호평이 많아, 전공자라면 한 번쯤 꼭 들어볼 만한 강의입니다.";
    } else {
      ratingSentence =
        "강의 난이도와 내용 구성이 잘 맞아떨어졌다는 의견이 많았으며, 재수강 의향도 높은 편입니다.";
    }
  } else if (avgRating >= 3.5) {
    if (rand < 0.33) {
      ratingSentence =
        "대체로 만족도가 높은 편이지만, 세부적인 부분에서는 아쉬움을 남긴다는 의견도 일부 존재합니다.";
    } else if (rand < 0.66) {
      ratingSentence =
        "강의 자체는 좋은 편이지만, 학생에 따라 체감 난이도나 과제 부담에 대한 의견이 조금씩 갈리고 있습니다.";
    } else {
      ratingSentence =
        "수업의 장점이 분명하지만, 몇 가지 개선되면 더 좋은 강의가 될 수 있다는 피드백이 함께 보입니다.";
    }
  } else if (avgRating >= 3.0) {
    if (rand < 0.33) {
      ratingSentence =
        "전반적으로 무난한 편이지만, 강의 스타일이나 평가 방식에 대해 호불호가 갈릴 수 있는 강의입니다.";
    } else if (rand < 0.66) {
      ratingSentence =
        "필요한 내용은 다루고 있으나, 수업 집중도나 전달력 측면에서 아쉬움을 느낀 학생들도 있습니다.";
    } else {
      ratingSentence =
        "수업을 따라가는데 큰 문제는 없지만, 기대했던 것보다는 평범했다는 의견이 적지 않습니다.";
    }
  } else {
    if (rand < 0.33) {
      ratingSentence =
        "불만족 의견이 상대적으로 많은 편이므로, 수강 전에 다른 학생들의 수강후기를 충분히 참고하는 것이 좋겠습니다.";
    } else if (rand < 0.66) {
      ratingSentence =
        "강의 구성이나 평가 방식에 개선이 필요하다는 피드백이 여러 건 확인되었습니다.";
    } else {
      ratingSentence =
        "현재 수강생들의 만족도가 다소 낮은 편으로, 대체 강의를 함께 고려해보는 것도 한 가지 방법입니다.";
    }
  }

  return baseInfo + keywordInfo + themeInfo + ratingSentence;
};

// ================================
// App 컴포넌트
// ================================
interface AppProps {
  user: AppUser;
  initialEnrolledCourses: Course[];
}

const App: React.FC<AppProps> = ({ user: appUser, initialEnrolledCourses }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "warning" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // AI 분석 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzingCourse, setAnalyzingCourse] = useState<Course | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    pros: string[];
    cons: string[];
    rating: number;
    keywords: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "warning" | "error"
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // 수강신청 훅
  const {
    selectedCourses,
    setSelectedCourses,
    currentCredits,
    handleAddCourse,
    handleRemoveCourse,
    wishlist,
    setWishlist,
  } = useEnrollment(initialEnrolledCourses, user, showNotification);

  // 과목 + 수강내역 fetch
  useEffect(() => {
    const fetchData = async (currentUser: AppUser) => {
      setLoading(true);
      try {
        const coursesResponse = await fetch("/api/courses", {
          credentials: "omit",
        });
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses");

        const coursesData = await coursesResponse.json();

        const transformedCourses: Course[] = coursesData.map((dto: any) => ({
          courseCode: dto.courseCode,
          academicYear: dto.academicYear,
          semester: dto.semester,
          subjectCode: dto.sCode,
          courseClass: dto.courseClass,
          professorNo: dto.professorNo,
          maxStudents: dto.maxStu,
          classroom: dto.classroom,
          courseSchedules: dto.schedules,
          status: dto.courseStatus,
          currentStudents: dto.currentStu,
          subjectName: dto.subjectName,
          professorName: dto.professorName,
          credit: dto.credit,
          subject: {
            sCode: dto.sCode,
            sName: dto.subjectName,
            credit: dto.credit,
            subjectType: "Unknown",
            dept_code: "Unknown",
          },
        }));

        setAllCourses(transformedCourses);

        const token = localStorage.getItem("token");
        if (token) {
          const enrollmentsResponse = await fetch(
            `/api/enrollments/${currentUser.memberNo}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (enrollmentsResponse.ok) {
            const enrollmentsData = await enrollmentsResponse.json();
            const enrolledCourses: Course[] = enrollmentsData.map(
              (enrollmentDTO: any) => {
                const courseDTO = enrollmentDTO.course;
                return {
                  courseCode: courseDTO.courseCode,
                  academicYear: courseDTO.academicYear,
                  semester: courseDTO.semester,
                  subjectCode: courseDTO.sCode,
                  courseClass: courseDTO.courseClass,
                  professorNo: courseDTO.professorNo,
                  maxStudents: courseDTO.maxStu,
                  classroom: courseDTO.classroom,
                  courseSchedules: courseDTO.schedules || [],
                  status: courseDTO.courseStatus,
                  currentStudents: courseDTO.currentStu,
                  subjectName: courseDTO.subjectName,
                  professorName: courseDTO.professorName,
                  credit: courseDTO.credit,
                  subject: {
                    sCode: courseDTO.sCode,
                    sName: courseDTO.subjectName,
                    credit: courseDTO.credit,
                    subjectType: "Unknown",
                    dept_code: "Unknown",
                  },
                };
              }
            );
            setSelectedCourses(enrolledCourses);
          } else {
            console.error("Failed to fetch enrolled courses");
            showNotification(
              "수강 신청 내역을 불러오는데 실패했습니다.",
              "warning"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("데이터를 불러오는데 실패했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (appUser) {
      setUser({
        studentId: appUser.memberNo,
        name: appUser.name,
        major: appUser.departmentName || "컴퓨터공학과",
        year: 3,
        maxCredits: 18,
      });
      fetchData(appUser);
    }
  }, [appUser, setSelectedCourses]);

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filteredCourses,
  } = useCourses(allCourses);

  // 관심 강의 처리
  const handleAddToWishlist = async (courseToAdd: Course) => {
    if (selectedCourses.some((c) => c.courseCode === courseToAdd.courseCode)) {
      showNotification(
        "이미 신청한 과목은 관심강의에 추가할 수 없습니다.",
        "warning"
      );
      return;
    }
    if (wishlist.some((c) => c.courseCode === courseToAdd.courseCode)) {
      showNotification("이미 관심강의에 추가된 과목입니다.", "warning");
      return;
    }
    setWishlist((prev) => [...prev, courseToAdd]);
    showNotification(
      `'${courseToAdd.subjectName}'을(를) 관심강의에 추가했습니다.`,
      "success"
    );
  };

  const handleRemoveFromWishlist = async (courseToRemove: Course) => {
    setWishlist((prev) =>
      prev.filter((c) => c.courseCode !== courseToRemove.courseCode)
    );
  };

  const handleRegisterFromWishlist = (courseToRegister: Course) => {
    handleAddCourse(courseToRegister);
  };

  // ======== AI 분석 로직 (constants.ts 기반) ========
  const handleAnalyzeCourse = async (course: Course) => {
    setAnalyzingCourse(course);
    setIsModalOpen(true);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      // ★ 여기서 ID 매칭이 중요함 ★
      // 1) MOCK_REVIEWS 구조 예시:
      // { course_id: 1, review_text: "...", rating: 5 }
      // 2) Course 구조:
      // { courseCode: "CSE4001", subjectCode: "CSE4001", ... }
      //
      // 가장 깔끔한 방법은 MOCK_REVIEWS에도 courseCode를 맞춰주는 것:
      // { courseCode: "CSE4001", reviewText: "...", rating: 5 }
      //
      // 그 경우 아래 한 줄만 써도 됨:
      // const relevantReviews = MOCK_REVIEWS.filter(r => r.courseCode === course.courseCode);

      const relevantReviews = MOCK_REVIEWS.filter((r: any) => {
        // 네 데이터 구조에 맞춰서 이 부분은 한 가지 방식만 남기면 됨
        if (r.courseCode && typeof r.courseCode === "string") {
          // courseCode가 문자열이라면: "CSE4001"
          return (
            r.courseCode === course.courseCode ||
            r.courseCode === course.subjectCode
          );
        }
        if (typeof r.course_id === "number") {
          // 만약 course_id: 1,2,3 이런 숫자면,
          // allCourses에서 인덱스로 매핑해도 됨
          const idx = allCourses.findIndex(
            (c) => c.courseCode === course.courseCode
          );
          return r.course_id === idx + 1;
        }
        return false;
      });

      if (relevantReviews.length === 0) {
        setAnalysisResult({
          summary:
            "아직 등록된 수강평이 없어 분석할 데이터가 부족합니다. 첫 번째 리뷰를 남겨주세요!",
          pros: ["데이터 부족"],
          cons: ["데이터 부족"],
          rating: 0,
          keywords: [],
        });
        return;
      }

      const totalRating = relevantReviews.reduce(
        (sum: number, r: any) => sum + (r.rating ?? 0),
        0
      );
      const avgRating = totalRating / relevantReviews.length;

      const texts: string[] = relevantReviews
        .map((r: any) => r.reviewText ?? r.review_text ?? "")
        .filter(
          (t: any) => typeof t === "string" && t.trim().length > 0
        );

      const keywords = analyzeKeywords(texts);

      const positiveCount = relevantReviews.filter(
        (r: any) => (r.rating ?? 0) >= 4
      ).length;
      const negativeCount = relevantReviews.filter(
        (r: any) => (r.rating ?? 0) <= 2
      ).length;

      // ★ 여기서 buildSummary 실제로 사용 ★
      const summary = buildSummary({
        courseName: course.subjectName,
        professorName: course.professorName,
        avgRating,
        keywords,
        totalCount: relevantReviews.length,
        positiveCount,
        negativeCount,
      });

      const shuffled = [...relevantReviews].sort(() => Math.random() - 0.5);

      const pros = shuffled
        .filter((r: any) => (r.rating ?? 0) >= 4)
        .map((r: any) => r.reviewText ?? r.review_text)
        .filter(
          (t: any) => typeof t === "string" && t.trim().length > 0
        )
        .slice(0, 3);

      const cons = shuffled
        .filter((r: any) => (r.rating ?? 0) <= 2)
        .map((r: any) => r.reviewText ?? r.review_text)
        .filter(
          (t: any) => typeof t === "string" && t.trim().length > 0
        )
        .slice(0, 3);

      setAnalysisResult({
        summary,
        pros: pros.length ? pros : ["특별한 장점이 언급되지 않았습니다."],
        cons: cons.length ? cons : ["특별한 단점이 언급되지 않았습니다."],
        rating: avgRating,
        keywords,
      });
    } catch (err) {
      console.error("강의 분석 실패:", err);
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
    success: "bg-green-500",
    warning: "bg-yellow-500 text-gray-800",
    error: "bg-red-500",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            데이터를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류</h2>
          <p className="text-gray-700">
            사용자 정보를 불러올 수 없습니다. <br /> 새로고침하거나
            관리자에게 문의하세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {notification && (
        <div
          className={`fixed top-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-out ${typeClasses[notification.type]}`}
        >
          {notification.message}
        </div>
      )}
      <Header user={user} />
      <main className="flex-grow container mx-auto p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CourseSearch
            courses={filteredCourses}
            onAddCourse={handleAddCourse}
            onAddInterestedCourse={handleAddToWishlist}
            onAnalyzeCourse={handleAnalyzeCourse}
            selectedCourseIds={new Set(
              selectedCourses.map((c) => c.courseCode)
            )}
            wishlistCourseIds={new Set(
              wishlist.map((c) => c.courseCode)
            )}
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
