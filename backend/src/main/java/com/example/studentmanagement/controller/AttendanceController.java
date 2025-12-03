package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Attendance;
import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.repository.AttendanceRepository;
import com.example.studentmanagement.repository.EnrollmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AttendanceController(AttendanceRepository attendanceRepository, EnrollmentRepository enrollmentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAttendance(@RequestParam String courseCode, @RequestParam Integer week) {
        // 1. Get all enrollments for the course
        List<Enrollment> enrollments = enrollmentRepository.findByCourse_CourseCode(courseCode);

        // 2. Get existing attendance records for the course and week
        List<Attendance> attendanceList = attendanceRepository.findByEnrollment_Course_CourseCodeAndPeriod(courseCode, week);
        
        // Map attendance by enrollment ID for easy lookup
        Map<Integer, Attendance> attendanceMap = attendanceList.stream()
                .collect(Collectors.toMap(a -> a.getEnrollment().getEnrollmentId(), a -> a));

        // 3. Merge data
        List<Map<String, Object>> result = new ArrayList<>();
        for (Enrollment e : enrollments) {
            Map<String, Object> item = new HashMap<>();
            item.put("studentId", e.getStudent().getMemberNo());
            item.put("studentName", e.getStudent().getName());
            item.put("enrollmentId", e.getEnrollmentId());
            
            Attendance a = attendanceMap.get(e.getEnrollmentId());
            if (a != null) {
                item.put("attendanceId", a.getAttendanceId());
                item.put("status", a.getAttendanceStatus());
                item.put("remark", a.getRemark());
            } else {
                item.put("attendanceId", null);
                item.put("status", ""); // Default empty or 'Present' if preferred
                item.put("remark", "");
            }
            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> saveAttendance(@RequestBody List<Map<String, Object>> attendanceData, 
                                            @RequestParam Integer week) {
        try {
            List<Attendance> toSave = new ArrayList<>();
            for (Map<String, Object> data : attendanceData) {
                Integer enrollmentId = (Integer) data.get("enrollmentId");
                String status = (String) data.get("status");
                String remark = (String) data.get("remark");
                
                if (enrollmentId == null) continue;

                // Check if record exists
                Attendance attendance = attendanceRepository.findByEnrollment_EnrollmentIdAndPeriod(enrollmentId, week)
                        .orElse(new Attendance());

                if (attendance.getAttendanceId() == null) {
                    // New record, need to set enrollment
                    Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);
                    if (enrollment == null) continue;
                    attendance.setEnrollment(enrollment);
                    attendance.setPeriod(week);
                }
                
                attendance.setAttendanceDate(new Date()); // Set to current date or pass date
                attendance.setAttendanceStatus(status);
                attendance.setRemark(remark);
                
                toSave.add(attendance);
            }
            
            attendanceRepository.saveAll(toSave);
            return ResponseEntity.ok("Attendance saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error saving attendance: " + e.getMessage());
        }
    }
}
