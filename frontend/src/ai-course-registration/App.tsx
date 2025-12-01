import React, { useState, useMemo, useEffect } from "react";
import { Course, User } from "./types";
import Header from "./components/Header";
import CourseSearch from "./components/CourseSearch";
import RegistrationWorkspace from "./components/RegistrationWorkspace";
import AnalysisModal from "./components/AnalysisModal";
import { useCourseAnalysis } from "./hooks/useCourseAnalysis";
import { useEnrollment } from "./hooks/useEnrollment";
import { useCourses } from "./hooks/useCourses";
import type { User as AppUser } from "../types";

interface AppProps {
  user: AppUser;
  initialEnrolledCourses: Course[];
}

const App: React.FC<AppProps> = ({ user: appUser, initialEnrolledCourses }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);

  const showNotification = (message: string, type: "success" | "warning" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const { selectedCourses, setSelectedCourses, currentCredits, handleAddCourse, handleRemoveCourse, wishlist, setWishlist } = useEnrollment(
    initialEnrolledCourses,
    user,
    showNotification
  );

  const { isModalOpen, analyzingCourse, analysisResult, isAnalyzing, analysisError, handleAnalyzeCourse, handleCloseModal } = useCourseAnalysis();

  useEffect(() => {
    const fetchData = async (currentUser: AppUser) => {
      setLoading(true);
      try {
        const coursesResponse = await fetch("/api/courses", { credentials: "omit" });
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
          const enrollmentsResponse = await fetch(`/api/enrollments/${currentUser.memberNo}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (enrollmentsResponse.ok) {
            const enrollmentsData = await enrollmentsResponse.json();
            const enrolledCourses: Course[] = enrollmentsData.map((enrollmentDTO: any) => {
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
            });
            setSelectedCourses(enrolledCourses);
          } else {
            console.error("Failed to fetch enrolled courses");
            showNotification("수강 신청 내역을 불러오는데 실패했습니다.", "warning");
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

  const { searchTerm, setSearchTerm, filterType, setFilterType, filteredCourses } = useCourses(allCourses);

  const handleAddToWishlist = async (courseToAdd: Course) => {
    if (selectedCourses.some((c) => c.courseCode === courseToAdd.courseCode)) {
      showNotification("이미 신청한 과목은 관심강의에 추가할 수 없습니다.", "warning");
      return;
    }
    if (wishlist.some((c) => c.courseCode === courseToAdd.courseCode)) {
      showNotification("이미 관심강의에 추가된 과목입니다.", "warning");
      return;
    }
    setWishlist((prev) => [...prev, courseToAdd]);
    showNotification(`'${courseToAdd.subjectName}'을(를) 관심강의에 추가했습니다.`, "success");
  };

  const handleRemoveFromWishlist = async (courseToRemove: Course) => {
    setWishlist((prev) => prev.filter((c) => c.courseCode !== courseToRemove.courseCode));
  };

  const handleRegisterFromWishlist = (courseToRegister: Course) => {
    handleAddCourse(courseToRegister);
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
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
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
          <p className="text-gray-700">
            사용자 정보를 불러올 수 없습니다. <br /> 새로고침하거나 관리자에게 문의하세요.
          </p>
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
      <main className="flex-grow container mx-auto p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CourseSearch
            courses={filteredCourses}
            onAddCourse={handleAddCourse}
            onAddInterestedCourse={handleAddToWishlist}
            onAnalyzeCourse={handleAnalyzeCourse}
            selectedCourseIds={new Set(selectedCourses.map((c) => c.courseCode))}
            wishlistCourseIds={new Set(wishlist.map((c) => c.courseCode))}
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
