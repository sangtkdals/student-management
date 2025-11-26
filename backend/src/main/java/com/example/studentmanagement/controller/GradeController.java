package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.GradeResponse;
import com.example.studentmanagement.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @GetMapping
    public ResponseEntity<List<GradeResponse>> getAllGrades() {
        return ResponseEntity.ok(gradeService.getAllGrades());
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<GradeResponse> getGradeByEnrollment(@PathVariable Integer enrollmentId) {
        return gradeService.getGradeByEnrollmentId(enrollmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
