import React, { useState, useEffect } from "react";
import type { User, UserRole, Department } from "../types";
import { Button, Input, Modal } from "./ui";

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack, initialRole = "student" }) => {
  // View State (login vs register)
  const [view, setView] = useState<"login" | "register">("login");

  // Login State
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Registration State
  const [regRole, setRegRole] = useState<UserRole>("student");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [idChecked, setIdChecked] = useState(false);

  const [regData, setRegData] = useState({
    m_id: "",
    m_pwd: "",
    m_name: "",
    m_email: "",
    m_phone: "",
    m_num: "",
    m_addr: "",
    dept_code: "",
    // Student specific
    stu_grade: "1", // Default to 1
    enrollment_status: "재학", // Default
    // Professor specific
    m_no: "", // used for both student no and employee no
    position: "정교수", // Default
    office_room: "",
    major_field: "",
    start_date: "",
  });

  useEffect(() => {
    if (view === "register") {
      fetch("/api/departments")
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setDepartments(data);
          } else {
            console.error("Departments data is not an array:", data);
            setDepartments([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch departments", err);
          setDepartments([]);
        });
    }
  }, [view]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "m_id") {
      setIdChecked(false);
    }
    setRegData((prev) => ({ ...prev, [field]: value }));
  };

  const checkIdDuplicate = async () => {
    if (!regData.m_id) {
      setModalMessage("아이디를 입력해주세요.");
      setIsModalOpen(true);
      return;
    }
    try {
      const response = await fetch(`/api/check-id?userId=${regData.m_id}`);
      const data = await response.json();
      if (data.exists) {
        setModalMessage("이미 사용 중인 아이디입니다.");
        setIdChecked(false);
      } else {
        setModalMessage("사용 가능한 아이디입니다.");
        setIdChecked(true);
      }
      setIsModalOpen(true);
    } catch (e) {
      console.error(e);
      setModalMessage("중복 확인 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m_id: userId, m_pwd: password }),
      });

      console.log("login response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("login error body:", errorText);
        setError(errorText || `로그인 실패 (status: ${response.status})`);
        return;
      }

      const data = await response.json();
      console.log("login success data:", data);

      localStorage.setItem("token", data.token ?? "");
      localStorage.setItem("refreshToken", data.refreshToken ?? "");

      const loggedInUser: User = {
        id: data.userId,
        memberNo: data.memberNo,
        name: data.name,
        role: (data.role ?? "student").toLowerCase() as UserRole,
        email: data.email,
        deptCode: data.deptCode,
        departmentName: data.departmentName,
        gradeLevel: data.gradeLevel,
        avatarUrl: `https://picsum.photos/seed/${data.userId}/100/100`,
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      onLogin(loggedInUser);
    } catch (err) {
      console.error("Login API call failed:", err);
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idChecked) {
      setModalMessage("아이디 중복 확인을 해주세요.");
      setIsModalOpen(true);
      return;
    }

    if (regData.m_pwd !== confirmPwd) {
      setModalMessage("비밀번호가 일치하지 않습니다.");
      setIsModalOpen(true);
      return;
    }

    const payload = {
      ...regData,
      m_email: `${emailLocal}@${emailDomain}`,
      m_type: regRole,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModalMessage("회원가입이 완료되었습니다. 로그인해주세요.");
        setIsModalOpen(true);
        setView("login");
      } else {
        const msg = await response.text();
        setModalMessage("회원가입 실패: " + msg);
        setIsModalOpen(true);
      }
    } catch (err) {
      setModalMessage("서버 연결 실패. 나중에 다시 시도해주세요.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  // ----------------------------------------------------------------
  // View: Registration
  // ----------------------------------------------------------------
  if (view === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray-light p-4 overflow-y-auto">
        <div className="w-full max-w-2xl my-8">
          <div className="flex justify-center mb-8 cursor-pointer" onClick={onBack}>
            <div className="flex items-center space-x-3">
              <svg
                className="w-10 h-10 text-brand-blue"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
              <h1 className="text-3xl font-bold text-brand-blue">학사 관리 시스템</h1>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">회원가입</h2>
            <div className="flex justify-center mb-6 border-b pb-4">
              <button
                type="button"
                onClick={() => setRegRole("student")}
                className={`px-6 py-2 mx-2 font-bold rounded-full transition-colors duration-300 ${
                  regRole === "student" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                학생 가입
              </button>
              <button
                type="button"
                onClick={() => setRegRole("professor")}
                className={`px-6 py-2 mx-2 font-bold rounded-full transition-colors duration-300 ${
                  regRole === "professor" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                교수 가입
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div key={regRole} className="fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">기본 정보</h3>
                </div>

                {/* ID with Check Button */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">아이디</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-md"
                      value={regData.m_id}
                      onChange={(e) => handleInputChange("m_id", e.target.value)}
                      required
                    />
                    <Button type="button" onClick={checkIdDuplicate} className="whitespace-nowrap bg-slate-600 hover:bg-slate-700 py-2">
                      중복확인
                    </Button>
                  </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <Input
                    label="비밀번호"
                    type="password"
                    value={regData.m_pwd}
                    onChange={(e) => handleInputChange("m_pwd", e.target.value)}
                    required
                  />
                  <Input label="비밀번호 확인" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required />
                </div>

                <Input label="이름" value={regData.m_name} onChange={(e) => handleInputChange("m_name", e.target.value)} required />

                {/* Email Split */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-slate-700">이메일</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                      value={emailLocal}
                      onChange={(e) => setEmailLocal(e.target.value)}
                      required
                    />
                    <span className="text-slate-500 font-bold">@</span>
                    <input
                      type="text"
                      className="flex-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Input
                  label="전화번호"
                  value={regData.m_phone}
                  onChange={(e) => handleInputChange("m_phone", e.target.value)}
                  placeholder="010-0000-0000"
                />
                <Input
                  label="주민등록번호"
                  value={regData.m_num}
                  onChange={(e) => handleInputChange("m_num", e.target.value)}
                  placeholder="000000-0000000"
                />
                <div className="md:col-span-2">
                  <Input label="주소" value={regData.m_addr} onChange={(e) => handleInputChange("m_addr", e.target.value)} />
                </div>

                {/* Department Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">학과</label>
                  <select
                    className="block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-md"
                    value={regData.dept_code}
                    onChange={(e) => handleInputChange("dept_code", e.target.value)}
                    required
                  >
                    <option value="">학과 선택</option>
                    {Array.isArray(departments) &&
                      departments.map((dept) => (
                        <option key={dept.deptCode} value={dept.deptCode}>
                          {dept.deptName}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="md:col-span-2 mt-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">{regRole === "student" ? "학생 정보" : "교직원 정보"}</h3>
                </div>

                {regRole === "student" && (
                  <>
                    <Input label="학번" value={regData.m_no} onChange={(e) => handleInputChange("m_no", e.target.value)} required />

                    {/* Student Grade (Default 1) */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">학년</label>
                      <select
                        className="block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-md"
                        value={regData.stu_grade}
                        onChange={(e) => handleInputChange("stu_grade", e.target.value)}
                      >
                        <option value="1">1학년</option>
                        <option value="2">2학년</option>
                        <option value="3">3학년</option>
                        <option value="4">4학년</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">학적 상태</label>
                      <select
                        className="block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-md"
                        value={regData.enrollment_status}
                        onChange={(e) => handleInputChange("enrollment_status", e.target.value)}
                      >
                        <option value="재학">재학</option>
                        <option value="휴학">휴학</option>
                        <option value="졸업">졸업</option>
                        <option value="제적">제적</option>
                      </select>
                    </div>
                  </>
                )}

                {regRole === "professor" && (
                  <>
                    <Input label="교번/사번" value={regData.m_no} onChange={(e) => handleInputChange("m_no", e.target.value)} required />

                    {/* Professor Position Select */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">직위</label>
                      <select
                        className="block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-md"
                        value={regData.position}
                        onChange={(e) => handleInputChange("position", e.target.value)}
                      >
                        <option value="정교수">정교수</option>
                        <option value="부교수">부교수</option>
                        <option value="조교수">조교수</option>
                      </select>
                    </div>

                    <Input label="연구실 (호실)" value={regData.office_room} onChange={(e) => handleInputChange("office_room", e.target.value)} />
                    <Input label="전공 분야" value={regData.major_field} onChange={(e) => handleInputChange("major_field", e.target.value)} />
                    <Input label="임용일" type="date" value={regData.start_date} onChange={(e) => handleInputChange("start_date", e.target.value)} />
                  </>
                )}
              </div>

              <div className="md:col-span-2 mt-6">
                <Button type="submit" className="w-full text-lg py-3">
                  가입하기
                </Button>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full mt-2 py-2 text-slate-600 hover:text-brand-blue text-sm font-medium"
                >
                  이미 계정이 있으신가요? 로그인하기
                </button>
              </div>
            </form>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="알림">
          <div className="p-4">{modalMessage}</div>
        </Modal>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // View: Login
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-light p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 cursor-pointer" onClick={onBack}>
          <div className="flex items-center space-x-3">
            <svg
              className="w-10 h-10 text-brand-blue"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            </svg>
            <h1 className="text-3xl font-bold text-brand-blue">학사 관리 시스템</h1>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg border border-brand-gray shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-2 gap-2 p-1 bg-brand-gray-light rounded-md">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`w-full px-4 py-2 text-sm font-bold rounded ${role === "student" ? "bg-brand-blue text-white" : "text-slate-500"}`}
              >
                학생
              </button>
              <button
                type="button"
                onClick={() => setRole("professor")}
                className={`w-full px-4 py-2 text-sm font-bold rounded ${role === "professor" ? "bg-brand-blue text-white" : "text-slate-500"}`}
              >
                교수
              </button>
            </div>

            <Input label="ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <Button type="submit" className="w-full">
              로그인
            </Button>

            <div className="text-center pt-2">
              <button type="button" onClick={() => setView("register")} className="text-sm text-slate-500 hover:text-brand-blue underline">
                계정이 없으신가요? 회원가입
              </button>
            </div>

            <div className="text-sm text-center pt-4 mt-4 border-t border-slate-200">
              <span onClick={onBack} className="font-medium text-slate-600 hover:text-brand-blue cursor-pointer">
                &larr; 홈으로 돌아가기
              </span>
            </div>
          </form>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="알림">
          <div className="p-4">{modalMessage}</div>
        </Modal>
      </div>
    </div>
  );
};

// Helper: Get user from localStorage
export const getUser = (): User | null => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

export default Auth;
