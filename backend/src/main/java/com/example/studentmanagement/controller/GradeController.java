package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.dto.GradeDTO;
import com.example.studentmanagement.repository.GradeRepository;
import com.example.studentmanagement.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:3000")
public class GradeController {

    private final GradeRepository gradeRepository;
    private final MemberRepository memberRepository;

    public GradeController(GradeRepository gradeRepository, MemberRepository memberRepository) {
        this.gradeRepository = gradeRepository;
        this.memberRepository = memberRepository;
    }

    @GetMapping
    public ResponseEntity<List<GradeDTO>> getStudentGrades() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentLoginId = authentication.getName();

        // 1. 로그인 ID로 Member(학생) 정보 조회
        Optional<Member> memberOptional = memberRepository.findById(studentLoginId);
        if (memberOptional.isEmpty()) {
            // Optional: throw exception or return empty list
            return ResponseEntity.status(404).body(List.of()); 
        }
        // 2. 조회된 정보에서 학번(m_no) 추출
        String studentNo = memberOptional.get().getMemberNo();
        
        System.out.println("학생 성적 조회 요청 (로그인ID: " + studentLoginId + ", 학번: " + studentNo + ")");
        
        List<GradeDTO> grades = gradeRepository.findGradesByStudentId(studentNo);
        
        return ResponseEntity.ok(grades);
    }
}
