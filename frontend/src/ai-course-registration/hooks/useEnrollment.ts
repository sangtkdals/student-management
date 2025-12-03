import { useState, useMemo, useEffect } from "react";
import { Course, User } from "../types";

// Helper function for time conflict checking
const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

export const useEnrollment = (
  initialEnrolledCourses: Course[],
  user: User | null,
  showNotification: (message: string, type: "success" | "warning" | "error") => void
) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(initialEnrolledCourses);
  const [wishlist, setWishlist] = useState<Course[]>([]); // Wishlist might be better in its own hook, but let's keep it here for now to simplify.

  useEffect(() => {
    setSelectedCourses(initialEnrolledCourses);
  }, [initialEnrolledCourses]);

  const currentCredits = useMemo(() => {
    return selectedCourses.reduce((sum, course) => sum + (course.credit || 0), 0);
  }, [selectedCourses]);

  const handleAddCourse = async (courseToAdd: Course) => {
    if (!user) return;

    if (selectedCourses.some((c) => c.courseCode === courseToAdd.courseCode)) {
      showNotification("이미 신청한 과목입니다.", "warning");
      return;
    }
    if (user.maxCredits && courseToAdd.credit && currentCredits + courseToAdd.credit > user.maxCredits) {
      showNotification("최대 수강 가능 학점을 초과합니다.", "error");
      return;
    }

    if (courseToAdd.courseSchedules) {
      for (const newSchedule of courseToAdd.courseSchedules) {
        for (const selectedCourse of selectedCourses) {
          if (selectedCourse.courseSchedules) {
            for (const existingSchedule of selectedCourse.courseSchedules) {
              if (newSchedule.dayOfWeek === existingSchedule.dayOfWeek) {
                const newStartTime = timeToMinutes(newSchedule.startTime);
                const newEndTime = timeToMinutes(newSchedule.endTime);
                const existingStartTime = timeToMinutes(existingSchedule.startTime);
                const existingEndTime = timeToMinutes(existingSchedule.endTime);
                if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
                  showNotification(`'${selectedCourse.subjectName}' 과목과 시간이 겹칩니다.`, "error");
                  return;
                }
              }
            }
          }
        }
      }
    }

    if (window.confirm(`'${courseToAdd.subjectName}' 과목을 수강 신청하시겠습니까?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch("/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ studentId: user.studentId, courseCode: courseToAdd.courseCode }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "수강 신청에 실패했습니다.");
        }
        setSelectedCourses((prev) => [...prev, courseToAdd]);
        setWishlist((prev) => prev.filter((c) => c.courseCode !== courseToAdd.courseCode));
        showNotification(`'${courseToAdd.subjectName}'을(를) 신청했습니다.`, "success");
      } catch (error: any) {
        showNotification(error.message, "error");
      }
    }
  };

  const handleRemoveCourse = async (courseToRemove: Course) => {
    if (!user) return;
    // We can add a confirmation here too if needed. For now, let's omit it.
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch("/api/enrollments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ studentId: user.studentId, courseCode: courseToRemove.courseCode }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "수강 취소에 실패했습니다.");
      }
      setSelectedCourses((prev) => prev.filter((c) => c.courseCode !== courseToRemove.courseCode));
      showNotification(`'${courseToRemove.subjectName}'을(를) 취소했습니다.`, "success");
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  return {
    selectedCourses,
    setSelectedCourses,
    currentCredits,
    handleAddCourse,
    handleRemoveCourse,
    wishlist,
    setWishlist,
  };
};
