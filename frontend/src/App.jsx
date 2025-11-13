import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // 학생 목록 데이터를 저장할 상태 변수. 초기값은 빈 배열.
  const [students, setStudents] = useState([]);
  // 로딩 상태를 표시할 상태 변수.
  const [loading, setLoading] = useState(true);
  // 에러 메시지를 저장할 상태 변수.
  const [error, setError] = useState(null);

  // useEffect: 컴포넌트가 처음 화면에 렌더링될 때 딱 한 번 실행됨
  useEffect(() => {
    // 백엔드 API로부터 학생 데이터를 가져오는 함수
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students"); // API 호출
        if (!response.ok) {
          // 응답이 성공(200번대)이 아니면 에러를 발생시킴
          throw new Error(`API 호출 실패: ${response.status}`);
        }
        const data = await response.json(); // 응답을 JSON 형태로 변환
        setStudents(data); // 받아온 데이터로 students 상태 업데이트
      } catch (e) {
        setError(e.message); // 에러가 발생하면 error 상태 업데이트
        console.error("데이터를 가져오는 중 에러 발생:", e);
      } finally {
        setLoading(false); // 성공하든 실패하든 로딩 상태를 false로 변경
      }
    };

    fetchStudents(); // 함수 실행
  }, []); // []는 이펙트가 마운트될 때 한 번만 실행되도록 함

  return (
    <div className="App">
      <header className="App-header">
        <h1>학사 관리 시스템</h1>
        <h2>학생 목록</h2>

        {/* 로딩 중일 때 표시할 내용 */}
        {loading && <p>데이터를 불러오는 중...</p>}

        {/* 에러가 발생했을 때 표시할 내용 */}
        {error && <p style={{ color: "red" }}>에러: {error}</p>}

        {/* 로딩이 끝나고 에러가 없을 때 학생 목록을 표시 */}
        {!loading && !error && (
          <table border="1" style={{ margin: "20px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>전공</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <li key={student.id}>
                  {student.name} ({student.major})
                </li>
              ))}
            </tbody>
          </table>
        )}
      </header>
    </div>
  );
}

export default App;
