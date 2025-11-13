import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("서버로부터 메시지를 기다리는 중...");

  useEffect(() => {
    // Docker 환경에서는 브라우저가 직접 backend 컨테이너에 접근할 수 없으므로,
    // 호스트 머신에 노출된 8080 포트를 통해 API를 호출해야 합니다.
    fetch("/api/hello") // vite.config.js 프록시 설정 덕분에 '/api/hello'만으로 요청 가능
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("API 호출 오류:", error);
        setMessage("서버에 연결할 수 없습니다. 백엔드 로그를 확인해주세요.");
      });
  }, []);

  return (
    <>
      <h1>학사 관리 시스템</h1>
      <div className="card">
        <p>{message}</p>
      </div>
    </>
  );
}

export default App;
