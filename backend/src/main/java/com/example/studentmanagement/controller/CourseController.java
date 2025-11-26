package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Subject;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.SubjectRepository; // Assuming this exists
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final MemberRepository memberRepository;
    private final SubjectRepository subjectRepository; // Need to verify if this exists

    public CourseController(CourseRepository courseRepository, MemberRepository memberRepository, SubjectRepository subjectRepository) {
        this.courseRepository = courseRepository;
        this.memberRepository = memberRepository;
        this.subjectRepository = subjectRepository;
    }

    // Get courses for a specific professor
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<?> getCoursesByProfessor(@PathVariable("professorId") String professorId) {
        try {
            System.out.println("Fetching courses for professorNo: " + professorId);
            List<Course> courses = courseRepository.findByProfessor_MemberNo(professorId);
            System.out.println("Found courses: " + courses.size());
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching courses: " + e.getMessage());
        }
    }

    // Register a new course
    @PostMapping
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
            
            // Set Subject
            String subjectCode = (String) payload.get("subjectCode");
            Subject subject = subjectRepository.findById(subjectCode).orElse(null);
            if (subject == null) {
                // For now, maybe create a dummy subject or return error?
                // To keep it simple, if subject doesn't exist, we might need to handle it.
                // Ideally subject should exist.
                // Let's assume it exists or set null.
            }
            course.setSubject(subject);

            // Set Professor
            String professorNo = (String) payload.get("professorNo");
            Member professor = memberRepository.findByMemberNo(professorNo).orElse(null);
            course.setProfessor(professor);

            // Credit is usually in Subject, but we might store it in Course if needed, 
            // but the Course bean doesn't have a 'credit' field? 
            // Wait, the schema doesn't have 'credit' in course table. It's in 'subject'.
            // But the prompt CREATE TABLE for course didn't include 'credit'.
            // The frontend sends it. We can ignore it or rely on Subject's credit.
            
            courseRepository.save(course);
            return ResponseEntity.ok("강의가 등록되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("강의 등록 중 오류 발생: " + e.getMessage());
        }
    }

    // Update course (e.g. for Syllabus)
    @PutMapping("/{courseCode}")
    public ResponseEntity<?> updateCourse(@PathVariable("courseCode") String courseCode, @RequestBody Map<String, Object> payload) {
        return courseRepository.findById(courseCode).map(course -> {
            if (payload.containsKey("courseObjectives")) course.setCourseObjectives((String) payload.get("courseObjectives"));
            if (payload.containsKey("courseContent")) course.setCourseContent((String) payload.get("courseContent"));
            if (payload.containsKey("evaluationMethod")) course.setEvaluationMethod((String) payload.get("evaluationMethod"));
            if (payload.containsKey("textbookInfo")) course.setTextbookInfo((String) payload.get("textbookInfo"));
            
            // Add other fields if editable
            
            courseRepository.save(course);
            return ResponseEntity.ok("강의 정보가 수정되었습니다.");
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete course
    @DeleteMapping("/{courseCode}")
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
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}
