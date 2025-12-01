import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, Input } from "../ui";
import type { AcademicSchedule } from "../../types";

export const AdminScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<AcademicSchedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: new Date().getFullYear(),
    semester: 1,
    title: "",
    content: "",
    startDate: "",
    endDate: "",
    backgroundColor: "#3B82F6",
    recurrenceType: "NONE"
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("/api/schedules");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleAdd = () => {
    setFormData({
      academicYear: new Date().getFullYear(),
      semester: 1,
      title: "",
      content: "",
      startDate: "",
      endDate: "",
      backgroundColor: "#3B82F6",
      recurrenceType: "NONE"
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post("/api/schedules", formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSchedules();
      setIsModalOpen(false);
      alert("일정이 추가되었습니다.");
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("저장 실패");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/schedules/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchSchedules();
        alert("삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert("삭제 실패");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="학사일정 관리">
        <div className="mb-4 flex justify-end">
          <Button onClick={handleAdd}>일정 추가</Button>
        </div>

        <Table headers={["학년도", "학기", "제목", "시작일", "종료일", "관리"]}>
          {schedules.map((schedule) => (
            <tr key={schedule.scheduleId}>
              <td className="px-6 py-4 text-sm">{schedule.academicYear}</td>
              <td className="px-6 py-4 text-sm">{schedule.semester}</td>
              <td className="px-6 py-4 text-sm font-medium">{schedule.title}</td>
              <td className="px-6 py-4 text-sm">{schedule.startDate}</td>
              <td className="px-6 py-4 text-sm">{schedule.endDate}</td>
              <td className="px-6 py-4 text-sm">
                <Button variant="secondary" onClick={() => handleDelete(schedule.scheduleId)}>
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </Table>

        {/* 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[500px]">
              <h3 className="text-xl font-bold mb-4">일정 추가</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="학년도"
                  type="number"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: Number(e.target.value)})}
                />
                <Input
                  label="학기"
                  type="number"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                />
              </div>

              <Input
                label="제목"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">내용</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="일정 내용을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="시작일"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
                <Input
                  label="종료일"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
                <Button onClick={handleSave}>저장</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
