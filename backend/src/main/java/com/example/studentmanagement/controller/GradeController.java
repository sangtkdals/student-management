package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.GradeDTO;
import com.example.studentmanagement.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
// ★ 여기서 3000번 포트를 허용해줍니다! (이게 핵심)
@CrossOrigin(origins = "http://localhost:3000") 
public class GradeController {

    @Autowired
    private GradeRepository gradeRepository;

    @GetMapping("/grades")
    public List<GradeDTO> getGrades(@RequestParam("studentId") String studentId) {
        System.out.println("성적 조회 요청 들어옴: " + studentId);
        return gradeRepository.findGradesByStudentId(studentId);
    }
}