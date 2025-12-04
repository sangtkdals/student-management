import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, Course } from "../../types";
import { Card, Table, Button, Modal, Input } from "../ui";
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
        const response = await fetch(`/api/courses/professor/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.subjectName || c.courseName || c.subject?.sName || c.courseCode,
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
        const response = await fetch(`/api/materials/course/${course.courseCode}`, {
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
      const response = await fetch(`/api/materials/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("업로드 완료");
        // Refresh list
        const res = await fetch(`/api/materials/course/${course.courseCode}`, {
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
      const response = await fetch(`/api/materials/${id}`, {
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
                  {c.subjectName}
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
                    href={`/api/materials/download/${m.filepath}`}
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

export const ProfessorAssignments: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    assignmentId: 0,
    assignmentTitle: "",
    assignmentDesc: "",
    dueDate: "",
    attachmentPath: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.memberNo) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/professor-new/courses/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.subjectName || c.courseName || c.subject?.sName || c.courseCode,
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

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!course) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/assignments?courseCode=${course.courseCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAssignments(data);
        }
      } catch (error) {
        console.error("Failed to fetch assignments", error);
      }
    };
    fetchAssignments();
  }, [course]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentAssignment({
        assignmentId: 0,
        assignmentTitle: "",
        assignmentDesc: "",
        dueDate: new Date().toISOString().split('T')[0],
        attachmentPath: "",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (assign: any) => {
    setIsEditing(true);
    setCurrentAssignment({
        assignmentId: assign.assignmentId,
        assignmentTitle: assign.assignmentTitle,
        assignmentDesc: assign.assignmentDesc || "",
        dueDate: assign.dueDate ? new Date(assign.dueDate).toISOString().split('T')[0] : "",
        attachmentPath: assign.attachmentPath || "",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      const token = localStorage.getItem("token");
      
      let attachmentPath = currentAssignment.attachmentPath;

      if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const uploadRes = await fetch("/api/assignments/upload", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData
          });
          if (uploadRes.ok) {
              const data = await uploadRes.json();
              attachmentPath = data.filename;
          } else {
              alert("파일 업로드 실패");
              return;
          }
      }

      const payload = {
        courseCode: course.courseCode,
        assignmentTitle: currentAssignment.assignmentTitle,
        assignmentDesc: currentAssignment.assignmentDesc,
        dueDate: new Date(currentAssignment.dueDate),
        attachmentPath: attachmentPath
      };
      
      let response;
      if (isEditing) {
        response = await fetch(`/api/assignments/${currentAssignment.assignmentId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`/api/assignments`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        alert(isEditing ? "수정되었습니다." : "등록되었습니다.");
        setIsModalOpen(false);
        // Refresh
        const res = await fetch(`/api/assignments?courseCode=${course.courseCode}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setAssignments(await res.json());
      } else {
        alert("저장 실패");
      }
    } catch (error) {
      console.error("Save error", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/assignments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setAssignments(assignments.filter((a) => a.assignmentId !== id));
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="space-y-4">
    <Card
      title="과제 관리"
      titleAction={
        <Button size="sm" onClick={handleOpenCreate}>
          + 과제 등록
        </Button>
      }
    >
      <div className="mb-6 pb-4 border-b border-slate-200 flex items-center space-x-4">
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
              {c.subjectName}
            </option>
          ))}
        </select>
      </div>

      {assignments.length > 0 ? (
        <div className="overflow-x-auto border border-brand-gray rounded-lg">
          <table className="min-w-full w-full divide-y divide-brand-gray">
            <thead className="bg-brand-gray-light">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-gray-dark uppercase tracking-wider">
                  제목
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-brand-gray-dark uppercase tracking-wider">
                  과제 기간
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray">
              {assignments.map((a) => (
                <tr key={a.assignmentId}>
                  <td className="px-6 py-3 text-sm font-medium text-slate-800 align-middle text-left">
                    <button 
                        onClick={() => navigate(`/professor/assignments/${a.assignmentId}`)}
                        className="hover:text-brand-blue hover:underline text-left"
                    >
                        {a.assignmentTitle}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 align-middle text-center w-64">
                    {a.registrationDate ? new Date(a.registrationDate).toLocaleDateString() : "-"} ~ {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
          <p className="text-slate-500 mb-4">등록된 과제가 없습니다.</p>
        </div>
      )}
    </Card>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "과제 수정" : "과제 등록"}>
        <form onSubmit={handleSave} className="space-y-4">
            <Input 
                label="주제" 
                value={currentAssignment.assignmentTitle} 
                onChange={(e) => setCurrentAssignment({...currentAssignment, assignmentTitle: e.target.value})}
                required
            />
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">내용</label>
                <textarea 
                    className="w-full border border-slate-300 p-2 rounded-md text-sm h-32 focus:ring-brand-blue focus:border-brand-blue"
                    value={currentAssignment.assignmentDesc}
                    onChange={(e) => setCurrentAssignment({...currentAssignment, assignmentDesc: e.target.value})}
                />
            </div>
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">과제 기간</label>
                <div className="flex items-center space-x-2">
                    <div className="flex-1">
                        <input 
                            type="date" 
                            className="w-full border border-slate-300 p-2 rounded-md text-sm bg-slate-100 text-slate-500"
                            value={new Date().toISOString().split('T')[0]} 
                            disabled 
                        />
                    </div>
                    <span className="text-slate-500">~</span>
                    <div className="flex-1">
                        <input 
                            type="date"
                            className="w-full border border-slate-300 p-2 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue"
                            value={currentAssignment.dueDate} 
                            onChange={(e) => setCurrentAssignment({...currentAssignment, dueDate: e.target.value})}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">첨부파일</label>
                <input 
                    type="file" 
                    className="w-full border border-slate-300 p-2 rounded-md text-sm"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                {currentAssignment.attachmentPath && !selectedFile && (
                    <p className="text-xs text-slate-500">현재 파일: {currentAssignment.attachmentPath}</p>
                )}
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit">{isEditing ? "수정" : "등록"}</Button>
            </div>
        </form>
    </Modal>
    </div>
  );
};

export const ProfessorLectureMyTimetable: React.FC<{ user: User }> = ({ user }) => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/courses/professor/${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedCourses = data.map((c: any) => ({
            ...c,
            subjectName: c.subjectName || c.courseName || c.subject?.sName || c.courseCode,
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
