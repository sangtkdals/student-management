package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.CourseSchedule;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.dto.ProfessorCourseResponse;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.ProfessorMainRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professor-new") 
public class ProfessorMainController {

    private final ProfessorMainRepository professorMainRepository;
    private final MemberRepository memberRepository;

    public ProfessorMainController(ProfessorMainRepository professorMainRepository, MemberRepository memberRepository) {
        this.professorMainRepository = professorMainRepository;
        this.memberRepository = memberRepository;
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getProfessorCourses() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String professorLoginId = authentication.getName();
            
            // 1. 로그인 ID로 Member(교수) 정보 조회
            Optional<Member> memberOptional = memberRepository.findById(professorLoginId);
            if (memberOptional.isEmpty()) {
                return ResponseEntity.status(404).body("교수 정보를 찾을 수 없습니다.");
            }
            // 2. 조회된 정보에서 교번(m_no) 추출
            String professorNo = memberOptional.get().getMemberNo();
            System.out.println("교수 강의 목록 조회 (로그인ID: " + professorLoginId + ", 교번: " + professorNo + ")");

            // 3. 교번으로 강의 목록 조회
            List<Course> courses = professorMainRepository.findMyCourses(professorNo);

            // 2. 자바에서 DTO로 변환 (안전장치 가동)
            List<ProfessorCourseResponse> responseList = courses.stream().map(c -> {
                // NULL 방지 로직
                String subjectName = (c.getSubject() != null) ? c.getSubject().getSName() : "과목명 미지정";
                int credit = (c.getSubject() != null) ? c.getSubject().getCredit() : 0;
                
                // 수강인원 조회
                int studentCount = professorMainRepository.countStudents(c.getCourseCode());

                // 강의 시간 포맷팅
                String courseTime = c.getCourseSchedules().stream()
                    .map(s -> {
                        String day = "";
                        switch (s.getDayOfWeek()) {
                            case 1: day = "월"; break;
                            case 2: day = "화"; break;
                            case 3: day = "수"; break;
                            case 4: day = "목"; break;
                            case 5: day = "금"; break;
                            case 6: day = "토"; break;
                            case 7: day = "일"; break;
                        }
                        return day + " " + s.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) + 
                               "-" + s.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"));
                    })
                    .collect(Collectors.joining(", "));

                return new ProfessorCourseResponse(
                    c.getCourseCode(),
                    subjectName,
                    c.getCourseClass(),
                    c.getClassroom(),
                    studentCount,
                    credit,
                    courseTime
                );
            }).collect(Collectors.toList());

            return ResponseEntity.ok(responseList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }

    @GetMapping("/courses/{courseCode}/students")
    public ResponseEntity<?> getStudentsByCourse(@PathVariable("courseCode") String courseCode) {
        try {
            List<Member> students = professorMainRepository.findStudentsByCourse(courseCode);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
}
