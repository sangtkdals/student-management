import React, { useState, useEffect } from "react";
import type { User } from "../../types";
import { Card, Table } from "../ui";

interface AttendanceRecord {
  attendanceId: number;
  period: number;
  status: string;
  date: string;
  remark: string;
}

interface CourseAttendance {
  courseName: string;
  courseCode: string;
  attendance: AttendanceRecord[];
}

export const StudentAttendance: React.FC<{ user: User }> = ({ user }) => {
  const [attendanceData, setAttendanceData] = useState<CourseAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        // Using user.memberNo as studentId.
        const response = await fetch(`http://localhost:8080/api/attendance/student?studentId=${user.memberNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setAttendanceData(data);
        } else {
          console.error("Failed to fetch attendance");
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.memberNo) {
      fetchAttendance();
    }
  }, [user.memberNo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card title="내 출결 조회">
      {attendanceData.length === 0 ? (
        <p className="text-center py-4 text-slate-500">수강 중인 강의가 없거나 출결 기록이 없습니다.</p>
      ) : (
        <div className="space-y-8">
          {attendanceData.map((course) => (
            <div key={course.courseCode} className="border rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-800">{course.courseName} <span className="text-sm font-normal text-slate-500">({course.courseCode})</span></h3>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                    <Table headers={["주차", "날짜", "상태", "비고"]}>
                        {course.attendance.length > 0 ? (
                            course.attendance.map((record) => (
                                <tr key={record.attendanceId || `week-${record.period}`}>
                                    <td className="px-6 py-4 text-sm text-center">{record.period}주차</td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        {record.date ? new Date(record.date).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            record.status === '출석' ? 'bg-green-100 text-green-700' :
                                            record.status === '결석' ? 'bg-red-100 text-red-700' :
                                            record.status === '지각' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {record.status || "-"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">{record.remark || "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-slate-500">출결 기록이 없습니다.</td>
                            </tr>
                        )}
                    </Table>
                </div>
                
                {/* Attendance Summary */}
                <div className="mt-4 flex gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    <span>출석: {course.attendance.filter(a => a.status === '출석').length}</span>
                    <span>지각: {course.attendance.filter(a => a.status === '지각').length}</span>
                    <span>결석: {course.attendance.filter(a => a.status === '결석').length}</span>
                    <span>공결: {course.attendance.filter(a => a.status === '공결').length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
