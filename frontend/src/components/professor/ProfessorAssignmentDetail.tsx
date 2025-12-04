import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Input, Modal } from "../ui";

export const ProfessorAssignmentDetail: React.FC = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    assignmentTitle: "",
    assignmentDesc: "",
    dueDate: "",
    attachmentPath: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAssignment(data);
      } else {
        console.error("Failed to fetch assignment");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const handleEditClick = () => {
    if (!assignment) return;
    setEditData({
      assignmentTitle: assignment.assignmentTitle,
      assignmentDesc: assignment.assignmentDesc || "",
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : "",
      attachmentPath: assignment.attachmentPath || "",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let attachmentPath = editData.attachmentPath;

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
        ...editData,
        attachmentPath: attachmentPath
      };

      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("수정되었습니다.");
        setIsModalOpen(false);
        fetchAssignment(); // Refresh
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      console.error("Save error", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("삭제되었습니다.");
        navigate(-1); // Go back
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!assignment) return <div>과제를 찾을 수 없습니다.</div>;

  return (
    <>
    <Card title="과제 상세 정보" titleAction={
        <div className="space-x-2">
            <Button size="sm" onClick={handleEditClick}>수정</Button>
            <Button size="sm" variant="secondary" className="text-red-600 hover:text-red-800" onClick={handleDelete}>삭제</Button>
        </div>
    }>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">주제</label>
          <div className="p-3 border border-slate-300 rounded-md bg-slate-50 text-sm">
            {assignment.assignmentTitle}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">내용</label>
          <div className="p-3 border border-slate-300 rounded-md bg-slate-50 text-sm min-h-[200px] whitespace-pre-wrap">
            {assignment.assignmentDesc}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">과제 기간</label>
          <div className="p-3 border border-slate-300 rounded-md bg-slate-50 text-sm">
            {assignment.registrationDate ? new Date(assignment.registrationDate).toLocaleDateString() : "-"} ~{" "}
            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">첨부파일</label>
          <div className="p-3 border border-slate-300 rounded-md bg-slate-50 text-sm">
            {assignment.attachmentPath ? (
              <a
                href={`/api/materials/download/${assignment.attachmentPath}`} 
                target="_blank"
                rel="noreferrer"
                className="text-brand-blue hover:underline"
              >
                {assignment.attachmentPath}
              </a>
            ) : (
              <span className="text-slate-400">첨부파일 없음</span>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            목록으로
          </Button>
        </div>
      </div>
    </Card>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="과제 수정">
        <form onSubmit={handleSave} className="space-y-4">
            <Input 
                label="주제" 
                value={editData.assignmentTitle} 
                onChange={(e) => setEditData({...editData, assignmentTitle: e.target.value})}
                required
            />
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">내용</label>
                <textarea 
                    className="w-full border border-slate-300 p-2 rounded-md text-sm h-32 focus:ring-brand-blue focus:border-brand-blue"
                    value={editData.assignmentDesc}
                    onChange={(e) => setEditData({...editData, assignmentDesc: e.target.value})}
                />
            </div>
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">과제 기간</label>
                <div className="flex items-center space-x-2">
                    <div className="flex-1">
                        <input 
                            type="date" 
                            className="w-full border border-slate-300 p-2 rounded-md text-sm bg-slate-100 text-slate-500"
                            value={assignment.registrationDate ? new Date(assignment.registrationDate).toISOString().split('T')[0] : ""} 
                            disabled 
                        />
                    </div>
                    <span className="text-slate-500">~</span>
                    <div className="flex-1">
                        <input 
                            type="date"
                            className="w-full border border-slate-300 p-2 rounded-md text-sm focus:ring-brand-blue focus:border-brand-blue"
                            value={editData.dueDate} 
                            onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
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
                {editData.attachmentPath && !selectedFile && (
                    <p className="text-xs text-slate-500">현재 파일: {editData.attachmentPath}</p>
                )}
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit">저장</Button>
            </div>
        </form>
    </Modal>
    </>
  );
};
