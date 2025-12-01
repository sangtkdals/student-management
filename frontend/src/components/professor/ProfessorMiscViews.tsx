import React, { useState, useEffect } from "react";
import type { User, Course } from "../../types";
import { Card, Table, Button } from "../ui";
import { ProfessorVisualTimetable } from "./ProfessorVisualTimetable";

export const ProfessorCourseMaterials: React.FC<{ user: User }> = ({ user }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.memberNo) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.courseName || c.subject?.sName || c.courseCode,
          }));
          setMyCourses(mappedCourses);
          if (mappedCourses.length > 0) setCourse(mappedCourses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, [user.memberNo]);

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!course) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/materials/course/${course.courseCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setMaterials(data);
        }
      } catch (error) {
        console.error("Failed to fetch materials", error);
      }
    };
    fetchMaterials();
  }, [course]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !course) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseCode", course.courseCode);

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/materials/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("업로드 완료");
        // Refresh list
        const res = await fetch(`http://localhost:8080/api/materials/course/${course.courseCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setMaterials(await res.json());
      } else {
        alert("업로드 실패");
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("오류가 발생했습니다.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/materials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setMaterials(materials.filter((m) => m.materialId !== id));
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <Card title="강의 자료 관리">
      <div className="space-y-6">
        {/* Course Selector */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-4">
            <label className="font-bold text-slate-700">강의 선택:</label>
            <select
              className="p-2 border border-slate-300 rounded-md text-sm"
              value={course?.courseCode || ""}
              onChange={(e) => {
                const selected = myCourses.find((c) => c.courseCode === e.target.value);
                if (selected) setCourse(selected);
              }}
            >
              {myCourses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.subjectName} ({c.courseCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={!course || uploading} />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer inline-flex items-center px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-brand-blue-dark transition-colors ${
                !course || uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "업로드 중..." : "+ 자료 업로드"}
            </label>
          </div>
        </div>

        {materials.length > 0 ? (
          <Table headers={["파일명", "업로드 일시", "관리"]}>
            {materials.map((m) => (
              <tr key={m.materialId}>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  <a
                    href={`http://localhost:8080/api/materials/download/${m.filepath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-blue hover:underline"
                  >
                    {m.filename}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{m.uploadDate ? new Date(m.uploadDate).toLocaleDateString() : "-"}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-red-600 hover:text-red-800 font-bold" onClick={() => handleDelete(m.materialId)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
            <p className="text-slate-500 mb-4">등록된 강의 자료가 없습니다.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export const ProfessorAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState([{ id: 1, title: "중간고사 대체 과제", deadline: "2024-04-20", submitted: 25, total: 30 }]);

  const handleCreate = () => {
    const title = prompt("과제 제목을 입력하세요:");
    if (title) {
      setAssignments([...assignments, { id: Date.now(), title, deadline: "2024-05-01", submitted: 0, total: 30 }]);
    }
  };

  return (
    <Card
      title="과제 관리"
      titleAction={
        <Button size="sm" onClick={handleCreate}>
          + 과제 등록
        </Button>
      }
    >
      {assignments.length > 0 ? (
        <Table headers={["과제명", "마감일", "제출 현황", "관리"]}>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td className="px-6 py-4 text-sm font-medium text-slate-800">{a.title}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{a.deadline}</td>
              <td className="px-6 py-4 text-sm text-brand-blue font-bold">
                {a.submitted} / {a.total}
              </td>
              <td className="px-6 py-4 text-sm">
                <button className="text-brand-blue hover:underline mr-3">채점하기</button>
                <button className="text-red-600 hover:text-red-800" onClick={() => setAssignments(assignments.filter((item) => item.id !== a.id))}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
          <p className="text-slate-500 mb-4">진행 중인 과제가 없습니다.</p>
        </div>
      )}
    </Card>
  );
};

export const ProfessorLectureMyTimetable: React.FC<{ user: User }> = ({ user }) => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/courses/professor/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.courseName || c.subject?.sName || c.courseCode,
          }));
          setMyCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch professor courses", error);
      }
    };
    if (user.memberNo) {
      fetchCourses();
    }
  }, [user.memberNo]);

  return (
    <Card title="전체 강의 시간표 (2024년 1학기)">
      <div className="pt-8 px-4">
        <ProfessorVisualTimetable courses={myCourses} />
      </div>
    </Card>
  );
};
