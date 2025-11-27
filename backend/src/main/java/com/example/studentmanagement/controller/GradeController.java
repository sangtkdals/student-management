package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.GradeDTO;
import com.example.studentmanagement.dto.ProfessorGradeDTO; 
import com.example.studentmanagement.dto.GradeUpdateRequest; 
import com.example.studentmanagement.repository.GradeRepository;
import com.example.studentmanagement.service.GradeService;   
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;              
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class GradeController {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private GradeService gradeService;

    @GetMapping("/grades")
    public List<GradeDTO> getGrades(@RequestParam("studentId") String studentId) {
        System.out.println("학생 성적 조회 요청: " + studentId);
        return gradeRepository.findGradesByStudentId(studentId);
    }

    @GetMapping("/professor/grades")
    public List<ProfessorGradeDTO> getProfessorGrades(@RequestParam("courseCode") String courseCode) {
        System.out.println("교수님 강의 조회 요청: " + courseCode);
        return gradeRepository.findStudentsByCourseCode(courseCode);
    }

    @PutMapping("/professor/grades")
    public ResponseEntity<?> updateGrade(@RequestBody GradeUpdateRequest request) {
        System.out.println("성적 저장 요청: " + request);
        gradeService.updateStudentGrade(request);
        return ResponseEntity.ok("성적이 성공적으로 반영되었습니다.");
    }
}