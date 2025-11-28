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

    @GetMapping("/professor/courses")
    public List<CourseDTO> getProfessorCourses(@RequestParam("professorId") String professorId) {
        System.out.println("교수님 강의 목록 요청 (DTO): " + professorId);
        return courseRepository.findCoursesByProfessorId(professorId);
    }

    @GetMapping("/courses/professor/{professorId}")
    public ResponseEntity<?> getCoursesByProfessor(@PathVariable("professorId") String professorId) {
        try {
            System.out.println("Fetching courses for professorNo: " + professorId);
            return ResponseEntity.ok("기능 준비중"); 
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
            course.setCourseClass((String) payload.get("courseClass"));
            course.setMaxStu(getInteger(payload, "maxStudents"));
            course.setCurrentStudents(0);
            course.setClassroom((String) payload.get("classroom"));
            course.setCourseTime((String) payload.get("courseTime"));
            course.setCourseStatus("OPEN");
            
            String subjectCode = (String) payload.get("subjectCode");
            if (subjectCode != null) {
                Subject subject = subjectRepository.findById(subjectCode).orElse(null);
                course.setSubject(subject);
            }

            String professorNo = (String) payload.get("professorNo");
            if (professorNo != null) {
                Member professor = memberRepository.findById(professorNo).orElse(null); // findByMemberNo -> findById로 수정 (ID가 m_id가 아니라면 주의)
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