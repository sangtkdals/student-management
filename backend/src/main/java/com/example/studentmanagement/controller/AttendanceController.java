package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Attendance;
import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.repository.AttendanceRepository;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MemberRepository memberRepository;

    public AttendanceController(AttendanceRepository attendanceRepository, EnrollmentRepository enrollmentRepository, MemberRepository memberRepository) {
        this.attendanceRepository = attendanceRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.memberRepository = memberRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAttendance(@RequestParam("courseCode") String courseCode, @RequestParam("week") Integer week) {
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
                                            @RequestParam("week") Integer week) {
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

    @GetMapping("/student")
    public ResponseEntity<?> getStudentAttendance() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentLoginId = authentication.getName();

        // 1. 로그인 ID로 Member(학생) 정보 조회
        Optional<Member> memberOptional = memberRepository.findById(studentLoginId);
        if (memberOptional.isEmpty()) {
            return ResponseEntity.status(404).body("학생 정보를 찾을 수 없습니다.");
        }
        // 2. 조회된 정보에서 학번(m_no) 추출
        String studentNo = memberOptional.get().getMemberNo();

        List<Attendance> attendanceList = attendanceRepository.findByEnrollment_Student_MemberNo(studentNo);
        
        // Group by Course
        Map<String, List<Attendance>> groupedByCourse = attendanceList.stream()
                .collect(Collectors.groupingBy(a -> a.getEnrollment().getCourse().getSubject().getSName())); 

        // Need to return also course details, so maybe grouping by Course Object or just mapping to DTO
        List<Map<String, Object>> result = new ArrayList<>();
        
        // We might want to list all enrolled courses even if no attendance recorded yet?
        // But for now, let's just show what we have in attendance table or fetch enrollments first.
        // Fetching enrollments first is better to show courses with 0 attendance records.
        
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_MemberNo(studentNo); // Assuming this method exists or similar
        
        for (Enrollment enrollment : enrollments) {
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("courseName", enrollment.getCourse().getSubject().getSName());
            courseData.put("courseCode", enrollment.getCourse().getCourseCode());
            
            List<Attendance> courseAttendance = attendanceList.stream()
                    .filter(a -> a.getEnrollment().getEnrollmentId().equals(enrollment.getEnrollmentId()))
                    .sorted(Comparator.comparing(Attendance::getPeriod))
                    .collect(Collectors.toList());
            
            List<Map<String, Object>> records = courseAttendance.stream().map(a -> {
                Map<String, Object> rec = new HashMap<>();
                rec.put("attendanceId", a.getAttendanceId());
                rec.put("period", a.getPeriod());
                rec.put("status", a.getAttendanceStatus());
                rec.put("date", a.getAttendanceDate());
                rec.put("remark", a.getRemark());
                return rec;
            }).collect(Collectors.toList());
            
            courseData.put("attendance", records);
            result.add(courseData);
        }

        return ResponseEntity.ok(result);
    }
}
