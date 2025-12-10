import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import type { User, UserRole, Course } from "./types";

// Components
import Auth from "./components/Auth";
import LandingPage from "./components/LandingPage";
import AppRoutes from "./routes";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [authRole, setAuthRole] = useState<UserRole>("student");
  const navigate = useNavigate();

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    if (loggedInUser.role === "student") {
      navigate("/student");
    } else if (loggedInUser.role === "professor") {
      navigate("/professor");
    } else if (loggedInUser.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setEnrolledCourses([]);
    setAuthRole("student");
    navigate("/");
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (user?.memberNo && user.role === 'student') {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`/api/enrollments/${user.memberNo}`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            const courses: Course[] = data.map((enrollmentDTO: any) => {
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
            setEnrolledCourses(courses);
          } else {
            console.error("Failed to fetch enrollments");
            setEnrolledCourses([]);
          }
        } catch (error) {
          console.error("Error fetching enrollments:", error);
          setEnrolledCourses([]);
        }
      }
    };
    fetchEnrollments();
  }, [user]);

  return (
    <>
      {user ? (
        <AppRoutes user={user} onLogout={handleLogout} enrolledCourses={enrolledCourses} />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onNavigateToAuth={(role) => {
                  setAuthRole(role);
                  navigate(`/auth/${role}`);
                }}
              />
            }
          />
          <Route path="/auth/:role" element={<Auth onLogin={handleLogin} onBack={() => navigate("/")} initialRole={authRole} />} />
          <Route
            path="*"
            element={
              <LandingPage
                onNavigateToAuth={(role) => {
                  setAuthRole(role);
                  navigate(`/auth/${role}`);
                }}
              />
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
