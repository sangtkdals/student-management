import React, { useState, useEffect } from "react";
import { AcademicSchedule } from "../../types";
import { Card, Button, Input, Modal } from "../ui";

export const AdminScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<AcademicSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Partial<AcademicSchedule> | null>(null);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/schedules");
      if (response.ok) {
        setSchedules(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSave = async () => {
    if (!selectedSchedule) return;

    const method = selectedSchedule.scheduleId ? "PUT" : "POST";
    const url = selectedSchedule.scheduleId ? `/api/schedules/${selectedSchedule.scheduleId}` : "/api/schedules";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({
          ...selectedSchedule,
          startDate: selectedSchedule.startDate ? new Date(selectedSchedule.startDate).toISOString() : null,
          endDate: selectedSchedule.endDate ? new Date(selectedSchedule.endDate).toISOString() : null,
        }),
      });

      if (response.ok) {
        await fetchSchedules();
        closeModal();
      } else {
        console.error("Failed to save schedule");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/schedules/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
          await fetchSchedules();
        }
      } catch (error) {
        console.error("Failed to delete schedule:", error);
      }
    }
  };

  const openModal = (schedule: Partial<AcademicSchedule> | null = null) => {
    const currentYear = new Date().getFullYear();
    setSelectedSchedule(
      schedule
        ? { ...schedule }
        : {
            academicYear: currentYear, // 기본값 설정
            semester: 1, // 기본값 설정
            scheduleTitle: "",
            scheduleContent: "", // 기본값 추가
            startDate: "",
            endDate: "",
            backgroundColor: "", // 기본값 추가
            recurrenceType: "", // 기본값 추가
            category: "academic",
          }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  return (
    <Card title="학사일정 관리">
      <div className="mb-4">
        <Button onClick={() => openModal()}>새 일정 추가</Button>
      </div>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-2 px-4 border-b">제목</th>
                <th className="py-2 px-4 border-b">시작일</th>
                <th className="py-2 px-4 border-b">종료일</th>
                <th className="py-2 px-4 border-b">카테고리</th>
                <th className="py-2 px-4 border-b">작업</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.scheduleId} className="text-center">
                  <td className="py-2 px-4 border-b">{schedule.scheduleTitle}</td>
                  <td className="py-2 px-4 border-b">{schedule.startDate}</td>
                  <td className="py-2 px-4 border-b">{schedule.endDate}</td>
                  <td className="py-2 px-4 border-b">{schedule.category}</td>
                  <td className="py-2 px-4 border-b">
                    <Button variant="secondary" size="sm" onClick={() => openModal(schedule)}>
                      수정
                    </Button>
                    <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDelete(schedule.scheduleId)}>
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSchedule && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedSchedule.scheduleId ? "일정 수정" : "새 일정 추가"}>
          <div className="space-y-4 p-4">
            <Input
              label="제목"
              value={selectedSchedule.scheduleTitle || ""}
              onChange={(e) => setSelectedSchedule({ ...selectedSchedule, scheduleTitle: e.target.value })}
            />
            <Input
              label="시작일"
              type="date"
              value={selectedSchedule.startDate || ""}
              onChange={(e) => setSelectedSchedule({ ...selectedSchedule, startDate: e.target.value })}
            />
            <Input
              label="종료일"
              type="date"
              value={selectedSchedule.endDate || ""}
              onChange={(e) => setSelectedSchedule({ ...selectedSchedule, endDate: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
              <select
                value={selectedSchedule.category || "academic"}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, category: e.target.value as "academic" | "holiday" | "event" })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-md"
              >
                <option value="academic">학사</option>
                <option value="holiday">휴일</option>
                <option value="event">행사</option>
              </select>
            </div>
            <textarea
              placeholder="내용"
              value={selectedSchedule.scheduleContent || ""}
              onChange={(e) => setSelectedSchedule({ ...selectedSchedule, scheduleContent: e.target.value })}
              className="block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={closeModal}>
                취소
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};
