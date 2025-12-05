import React, { useState, useEffect } from "react";
import { Table, Button, Card } from "../ui"; // UI 컴포넌트 경로 확인 필요

// 강의 공지사항용 데이터 타입 (DB 컬럼과 일치)
interface CourseNotice {
  noticeId: number;
  title: string;
  content: string;
  writerId: string;
  createdAt: string;
  viewCount: number;
}

// 부모에게서 받아올 정보
interface Props {
  courseCode: string;       // "CSE4002_01" 같은 강의 코드
  courseName: string;
  userRole: string;         // "PROFESSOR" or "STUDENT"
  writerId?: string;        // 글쓴이 ID (교수님일 때만 필요)
}

export const CourseNoticeBoard: React.FC<Props> = ({ courseCode, courseName, userRole, writerId }) => {
  const [notices, setNotices] = useState<CourseNotice[]>([]);
  const [mode, setMode] = useState<"list" | "write" | "detail">("list");
  const [selectedNotice, setSelectedNotice] = useState<CourseNotice | null>(null);

  // 글쓰기 폼 입력값
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 1. 공지사항 목록 불러오기
  const fetchNotices = async () => {
    if (!courseCode) return;
    
    try {
      const token = localStorage.getItem("token");
      // 백엔드 API (나중에 만들 것) 호출
      const res = await fetch(`http://localhost:8080/api/course-notices/${courseCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setNotices(await res.json());
      } else {
        // 백엔드가 아직 없을 때를 대비한 빈 배열 처리
        console.log("공지 로딩 실패 (백엔드 미구현 시 정상)"); 
        setNotices([]); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  // courseCode가 바뀌면 목록 다시 불러오기
  useEffect(() => {
    fetchNotices();
  }, [courseCode]);

  // 2. 공지사항 등록하기 (교수님 전용)
  const handleWrite = async () => {
    if (!title || !content) return alert("제목과 내용을 모두 입력해주세요.");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/course-notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseCode: courseCode,
          writerId: writerId,
          title: title,
          content: content,
        }),
      });

      if (res.ok) {
        alert("공지사항이 등록되었습니다.");
        setTitle("");
        setContent("");
        setMode("list"); // 목록 화면으로 복귀
        fetchNotices();  // 목록 갱신
      } else {
        alert("등록 실패 (백엔드 연결 필요)");
      }
    } catch (e) {
      console.error(e);
      alert("오류 발생");
    }
  };

  // 3. 화면 렌더링
  return (
    <div className="mt-6">
      {mode === "list" ? (
        <Card title={`강의 공지사항 (${courseName || courseCode})`}>
          {/* 교수님에게만 글쓰기 버튼 노출 */}
          {userRole === "PROFESSOR" && (
            <div className="flex justify-end mb-4">
              <Button size="sm" onClick={() => setMode("write")}>
                새 공지 작성
              </Button>
            </div>
          )}

          <Table headers={["번호", "제목", "작성자", "작성일", "조회"]}>
            {notices.length > 0 ? (
              notices.map((n, idx) => (
                <tr 
                  key={n.noticeId} 
                  className="hover:bg-slate-50 cursor-pointer"
                  
                  onClick={() => {
                    setSelectedNotice(n);
                    setMode("detail");
                  }}
                >
                  <td className="px-4 py-3 text-center text-sm text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{n.title}</td>
                  <td className="px-4 py-3 text-center text-sm text-slate-600">{n.writerId}</td>
                  <td className="px-4 py-3 text-center text-sm text-slate-500">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-slate-500">{n.viewCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </Table>
        </Card>
        ) : mode === "detail" && selectedNotice ? (
        <Card title="공지사항 상세">
          <div className="p-4">
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedNotice.title}</h3>
              <div className="flex justify-between text-sm text-slate-500">
                <div className="flex space-x-4">
                  <span> 작성자: {selectedNotice.writerId}</span>
                  <span> 작성일: {selectedNotice.createdAt ? new Date(selectedNotice.createdAt).toLocaleDateString() : "-"}</span>
                </div>
                <span>조회수: {selectedNotice.viewCount}</span>
              </div>
            </div>
            <div className="min-h-[200px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedNotice.content}
            </div>
            <div className="flex justify-end mt-8 pt-4 border-t border-slate-200">
              <Button variant="secondary" onClick={() => setMode("list")}>
                목록으로
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card title="새 공지사항 작성">
          <div className="space-y-4 p-2">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">제목</label>
              <input
                className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="공지 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">내용</label>
              <textarea
                className="w-full border border-slate-300 rounded p-2 h-64 resize-none focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="공지 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="secondary" onClick={() => setMode("list")}>
                취소
              </Button>
              <Button variant="primary" onClick={handleWrite}>
                등록하기
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};