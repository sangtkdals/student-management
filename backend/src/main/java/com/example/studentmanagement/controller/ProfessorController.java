package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentGradeDTO;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professor")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfessorController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private GradeService gradeService;

    @GetMapping("/courses/{courseCode}/students")
    public ResponseEntity<List<StudentGradeDTO>> getCourseStudents(@PathVariable String courseCode) {
        List<StudentGradeDTO> students = enrollmentRepository.findStudentsByCourseCode(courseCode);
        return ResponseEntity.ok(students);
    }

    @PutMapping("/grades")
    public ResponseEntity<?> updateGrades(@RequestBody List<StudentGradeDTO> grades) {
        try {
            System.out.println("성적 저장 요청 받음: " + grades.size() + "명");
            gradeService.updateGrades(grades);
            return ResponseEntity.ok("성적이 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("저장 실패: " + e.getMessage());
        }
    }
}