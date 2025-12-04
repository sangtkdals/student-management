package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.dto.ProfessorCourseResponse;
import com.example.studentmanagement.repository.ProfessorMainRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professor-new") // 👈 충돌 방지용 새 주소
public class ProfessorMainController {

    private final ProfessorMainRepository professorMainRepository;

    public ProfessorMainController(ProfessorMainRepository professorMainRepository) {
        this.professorMainRepository = professorMainRepository;
    }

    @GetMapping("/courses/{professorId}")
    public ResponseEntity<?> getProfessorCourses(@PathVariable("professorId") String professorId) {
        try {
            System.out.println("새로운 교수 컨트롤러 작동: " + professorId);

            // 1. DB에서 원본 가져오기
            List<Course> courses = professorMainRepository.findMyCourses(professorId);

            // 2. 자바에서 DTO로 변환 (안전장치 가동)
            List<ProfessorCourseResponse> responseList = courses.stream().map(c -> {
                // NULL 방지 로직
                String subjectName = (c.getSubject() != null) ? c.getSubject().getSName() : "과목명 미지정";
                int credit = (c.getSubject() != null) ? c.getSubject().getCredit() : 0;
                
                // 수강인원 조회
                int studentCount = professorMainRepository.countStudents(c.getCourseCode());

                return new ProfessorCourseResponse(
                    c.getCourseCode(),
                    subjectName,
                    c.getCourseClass(),
                    c.getClassroom(),
                    studentCount,
                    credit
                );
            }).collect(Collectors.toList());

            return ResponseEntity.ok(responseList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
}
