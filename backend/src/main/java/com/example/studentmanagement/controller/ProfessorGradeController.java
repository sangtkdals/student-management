package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentGradeDTO;
import com.example.studentmanagement.repository.ProfessorGradeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/professor/grades")
public class ProfessorGradeController {

    private final ProfessorGradeRepository professorGradeRepository;

    public ProfessorGradeController(ProfessorGradeRepository professorGradeRepository) {
        this.professorGradeRepository = professorGradeRepository;
    }

    @GetMapping("/{courseCode}")
    public ResponseEntity<List<StudentGradeDTO>> getStudentGrades(@PathVariable String courseCode) {
        System.out.println("교수 성적 관리 요청 들어옴: " + courseCode); 
        List<StudentGradeDTO> list = professorGradeRepository.findStudentsByCourseCode(courseCode);
        return ResponseEntity.ok(list);
    }
}