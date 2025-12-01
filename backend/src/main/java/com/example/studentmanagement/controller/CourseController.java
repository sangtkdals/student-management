package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Subject;
import com.example.studentmanagement.dto.CourseDTO;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseRepository courseRepository;
    private final MemberRepository memberRepository;
    private final SubjectRepository subjectRepository;

    public CourseController(CourseRepository courseRepository, MemberRepository memberRepository, SubjectRepository subjectRepository) {
        this.courseRepository = courseRepository;
        this.memberRepository = memberRepository;
        this.subjectRepository = subjectRepository;
    }

    // 프론트엔드(ProfessorStudentManagement)에서 사용하는 DTO 반환 엔드포인트
    @GetMapping("/professor/courses")
    public List<CourseDTO> getProfessorCourses(@RequestParam("professorId") String professorId) {
        return courseRepository.findCoursesByProfessorId(professorId);
    }

    // [수정] 프론트엔드(ProfessorHome, MyLectures)에서 호출하는 엔드포인트 구현 연결
    @GetMapping("/courses/professor/{professorId}")
    public ResponseEntity<?> getCoursesByProfessor(@PathVariable("professorId") String professorId) {
        try {
            // "기능 준비중" 대신 실제 로직 연결
            // DTO가 아닌 엔티티 리스트가 필요한 경우라면 courseRepository.findByProfessor_MemberNo(professorId) 등을 호출
            // 여기서는 위와 동일한 DTO 로직을 재사용하거나 Repository에 맞는 메서드를 호출하면 됩니다.
            return ResponseEntity.ok(courseRepository.findCoursesByProfessorId(professorId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> payload) {
        try {
            String courseCode = (String) payload.get("courseCode");
            if (courseRepository.existsById(courseCode)) {
                return ResponseEntity.badRequest().body("이미 존재하는 강의 코드입니다.");
            }

            Course course = new Course();
            course.setCourseCode(courseCode);
            course.setAcademicYear(getInteger(payload, "academicYear"));
            course.setSemester(getInteger(payload, "semester"));
            
            // 이름 우선순위: courseName > subjectName
            String name = (String) payload.get("courseName");
            if (name == null || name.isEmpty()) {
                name = (String) payload.get("subjectName");
            }
            course.setCourseName(name);
            
            course.setCourseClass((String) payload.get("courseClass"));
            course.setMaxStu(getInteger(payload, "maxStudents"));
            course.setCurrentStudents(0);
            course.setClassroom((String) payload.get("classroom"));
            course.setCourseTime((String) payload.get("courseTime"));
            course.setCourseStatus("OPEN");
            
            // [해결] merge 브랜치의 과목 생성 로직 채택
            // 프론트엔드에서 보낸 학점(credit) 정보를 반영하기 위함
            String subjectCode = (String) payload.get("subjectCode");
            Subject subject = null;

            if (subjectCode != null) {
                subject = subjectRepository.findById(subjectCode).orElse(null);
                
                // 과목이 없으면 새로 생성 (merge 브랜치 로직)
                if (subject == null) {
                    subject = new Subject();
                    subject.setSCode(subjectCode);
                    subject.setSName((String) payload.get("subjectName"));
                    subject.setCredit(getInteger(payload, "credit")); // 학점 저장
                    subjectRepository.save(subject);
                }
                
                course.setSubject(subject);
            }

            String professorNo = (String) payload.get("professorNo");
            if (professorNo != null) {
                Member professor = memberRepository.findById(professorNo).orElse(null);
                course.setProfessor(professor);
            }

            courseRepository.save(course);
            return ResponseEntity.ok("강의가 등록되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("강의 등록 중 오류 발생: " + e.getMessage());
        }
    }

    @PutMapping("/courses/{courseCode}")
    public ResponseEntity<?> updateCourse(@PathVariable("courseCode") String courseCode, @RequestBody Map<String, Object> payload) {
        return courseRepository.findById(courseCode).map(course -> {
            if (payload.containsKey("courseObjectives")) course.setCourseObjectives((String) payload.get("courseObjectives"));
            if (payload.containsKey("courseContent")) course.setCourseContent((String) payload.get("courseContent"));
            if (payload.containsKey("evaluationMethod")) course.setEvaluationMethod((String) payload.get("evaluationMethod"));
            if (payload.containsKey("textbookInfo")) course.setTextbookInfo((String) payload.get("textbookInfo"));
            
            courseRepository.save(course);
            return ResponseEntity.ok("강의 정보가 수정되었습니다.");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/courses/{courseCode}")
    public ResponseEntity<?> deleteCourse(@PathVariable("courseCode") String courseCode) {
        if (courseRepository.existsById(courseCode)) {
            courseRepository.deleteById(courseCode);
            return ResponseEntity.ok("강의가 삭제되었습니다.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private Integer getInteger(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        if (value instanceof Number) return ((Number) value).intValue();
        if (value instanceof String) {
            try { return Integer.parseInt((String) value); } 
            catch (NumberFormatException e) { return null; }
        }
        return null;
    }
}