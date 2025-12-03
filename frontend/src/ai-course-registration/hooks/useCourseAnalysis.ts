import { useState } from "react";
import { Course, AnalysisResult } from "../types";
import { MOCK_REVIEWS } from "../constants";

// --- Simple Client-Side NLP Helpers ---

// Basic Korean stopwords (common particles and generic words)
const STOP_WORDS = new Set([
  "이",
  "가",
  "을",
  "를",
  "은",
  "는",
  "의",
  "에",
  "로",
  "으로",
  "과",
  "와",
  "도",
  "에서",
  "하고",
  "하며",
  "강의",
  "수업",
  "교수님",
  "교수",
  "수강",
  "학기",
  "내용",
  "부분",
  "정말",
  "진짜",
  "매우",
  "너무",
  "많이",
  "그냥",
  "좀",
  "잘",
  "해서",
  "있는",
  "없는",
  "것",
  "거",
  "수",
  "게",
  "때문",
  "관련",
  "통해",
  "대한",
  "이다",
  "있다",
  "없다",
  "같다",
  "합니다",
  "입니다",
  "전체적으로",
  "개인적으로는",
  "아쉬운",
  "점도",
  "있었다",
  "만족스러운",
  "강의였다",
  "다시",
  "들어도",
  "괜찮을",
  "다음",
  "학기에도",
  "추천하고",
  "싶다",
  "위주로",
  "편이다",
  "특별히",
  "좋지도",
  "나쁘지도",
  "않다",
  "가장",
  "제일",
  "어떤",
  "이런",
  "저런",
  "그런",
  "오히려",
  "무조건",
]);

// Extract top occurring words from an array of text strings
const analyzeKeywords = (texts: string[]): string[] => {
  const wordCounts: Record<string, number> = {};

  texts.forEach((text) => {
    const words = text.replace(/[^\w\s가-힣]/g, " ").split(/\s+/);
    words.forEach((word) => {
      if (word.length < 2) return;
      let cleanWord = word;
      if (["은", "는", "이", "가", "을", "를", "도", "의", "에", "로"].some((p) => cleanWord.endsWith(p))) {
        cleanWord = cleanWord.slice(0, -1);
      }
      if (cleanWord.length < 2 || STOP_WORDS.has(cleanWord) || STOP_WORDS.has(word)) return;
      wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
    });
  });

  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

export const useCourseAnalysis = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzingCourse, setAnalyzingCourse] = useState<Course | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzeCourse = async (course: Course) => {
    setAnalyzingCourse(course);
    setIsModalOpen(true);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const relevantReviews = MOCK_REVIEWS.filter((r) => r.course_id === course.id);

      if (relevantReviews.length === 0) {
        setAnalysisResult({
          summary: "아직 등록된 수강평이 없어 분석할 데이터가 부족합니다. 첫 번째 리뷰를 남겨주세요!",
          pros: ["데이터 부족"],
          cons: ["데이터 부족"],
          rating: 0,
          keywords: [],
        });
        return;
      }

      const totalRating = relevantReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / relevantReviews.length;
      const allReviewText = relevantReviews.map((r) => r.review_text);
      const keywords = analyzeKeywords(allReviewText);

      let summary = "";
      const keywordStr = keywords.length > 0 ? `'${keywords.slice(0, 3).join("', '")}'` : "";

      if (avgRating >= 4.0) {
        summary = `학생들의 만족도가 매우 높은 강의(평점 ${avgRating.toFixed(1)})입니다. ${
          keywordStr ? `주로 ${keywordStr} 등의 키워드가 긍정적으로 언급되고 있으며, ` : ""
        }전반적으로 추천하는 의견이 지배적입니다.`;
      } else if (avgRating >= 3.0) {
        summary = `대체로 무난한 평가(평점 ${avgRating.toFixed(1)})를 받고 있습니다. ${
          keywordStr ? `수강생들은 ${keywordStr} 등을 주요 특징으로 꼽았습니다. ` : ""
        }개인 성향에 따라 호불호가 갈릴 수 있으니 참고하세요.`;
      } else {
        summary = `수강생들의 불만이 다소 있는 강의(평점 ${avgRating.toFixed(1)})로 분석됩니다. ${
          keywordStr ? `특히 ${keywordStr} 관련하여 개선이 필요하다는 의견이 있습니다. ` : ""
        }수강 신청 전 신중한 고려가 필요해 보입니다.`;
      }

      const shuffledReviews = [...relevantReviews].sort(() => Math.random() - 0.5);
      const pros = shuffledReviews
        .filter((r) => r.rating >= 4)
        .map((r) => r.review_text)
        .slice(0, 3);
      const cons = shuffledReviews
        .filter((r) => r.rating <= 2)
        .map((r) => r.review_text)
        .slice(0, 3);

      setAnalysisResult({
        summary: summary,
        pros: pros.length > 0 ? pros : ["특별한 장점이 언급되지 않았습니다."],
        cons: cons.length > 0 ? cons : ["특별한 단점이 언급되지 않았습니다."],
        rating: avgRating,
        keywords: keywords,
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

  return {
    isModalOpen,
    analyzingCourse,
    analysisResult,
    isAnalyzing,
    analysisError,
    handleAnalyzeCourse,
    handleCloseModal,
  };
};
