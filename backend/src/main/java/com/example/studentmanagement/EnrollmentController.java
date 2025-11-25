package com.example.studentmanagement;

import com.example.studentmanagement.dto.EnrollmentRequest;
import com.example.studentmanagement.dto.EnrollmentResponse;
import com.example.studentmanagement.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<EnrollmentResponse>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @GetMapping("/student/{stuNo}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudent(@PathVariable String stuNo) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudentNo(stuNo));
    }

    @GetMapping("/course/{courseCode}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByCourse(@PathVariable String courseCode) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourseCode(courseCode));
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponse> createEnrollment(@RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.createEnrollment(request));
    }

    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Integer enrollmentId) {
        enrollmentService.deleteEnrollment(enrollmentId);
        return ResponseEntity.ok().build();
    }
}
