package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.dto.EnrollmentDTO;
import com.example.studentmanagement.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<List<EnrollmentDTO>> getEnrollments(@PathVariable String studentId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(studentId);
        List<EnrollmentDTO> enrollmentDTOs = enrollments.stream()
                .map(EnrollmentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(enrollmentDTOs);
    }

    @PostMapping
    public ResponseEntity<?> enrollCourse(@RequestBody Map<String, String> payload) {
        try {
            String studentId = payload.get("studentId");
            String courseCode = payload.get("courseCode");
            enrollmentService.enrollCourse(studentId, courseCode);
            return ResponseEntity.ok().body("Successfully enrolled.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> cancelEnrollment(@RequestBody Map<String, String> payload) {
        try {
            String studentId = payload.get("studentId");
            String courseCode = payload.get("courseCode");
            enrollmentService.cancelEnrollment(studentId, courseCode);
            return ResponseEntity.ok().body("Successfully canceled enrollment.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
