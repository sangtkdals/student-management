package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.GradeDTO;
import com.example.studentmanagement.repository.GradeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:3000")
public class GradeController {

    private final GradeRepository gradeRepository;

    public GradeController(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    @GetMapping
    public ResponseEntity<List<GradeDTO>> getStudentGrades(@RequestParam("studentId") String studentId) {
        System.out.println("학생 성적 조회 요청: " + studentId);
        
        List<GradeDTO> grades = gradeRepository.findGradesByStudentId(studentId);
        
        return ResponseEntity.ok(grades);
    }
}