package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.CourseSchedule;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Department;
import com.example.studentmanagement.beans.Subject;
import com.example.studentmanagement.dto.CourseDTO;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.CourseScheduleRepository;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final MemberRepository memberRepository;
    private final SubjectRepository subjectRepository;
    private final CourseScheduleRepository courseScheduleRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final DepartmentRepository departmentRepository;

    public CourseController(CourseRepository courseRepository, MemberRepository memberRepository,
            SubjectRepository subjectRepository, CourseScheduleRepository courseScheduleRepository,
            EnrollmentRepository enrollmentRepository, DepartmentRepository departmentRepository) {
        this.courseRepository = courseRepository;
        this.memberRepository = memberRepository;
        this.subjectRepository = subjectRepository;
        this.courseScheduleRepository = courseScheduleRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.departmentRepository = departmentRepository;
    }

    // Get all courses for student registration
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        List<CourseDTO> courseDTOs = courses.stream()
                .map(course -> {
                    int currentStudents = (int) enrollmentRepository.countByCourse_CourseCode(course.getCourseCode());
                    String professorName = course.getProfessor() != null ? course.getProfessor().getName() : "N/A";
                    List<CourseSchedule> schedules = course.getCourseSchedules();
                    int credit = course.getSubject() != null ? course.getSubject().getCredit() : 0;
                    return new CourseDTO(course, currentStudents, professorName, schedules, credit);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDTOs);
    }

    // Get courses for a specific professor
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<?> getCoursesByProfessor(@PathVariable("professorId") String professorId) {
        try {
            System.out.println("Fetching courses for professorNo: " + professorId);
            List<Course> courses = courseRepository.findByProfessor_MemberNo(professorId);
            List<CourseDTO> courseDTOs = courses.stream()
                .map(course -> {
                    int currentStudents = (int) enrollmentRepository.countByCourse_CourseCode(course.getCourseCode());
                    String professorName = course.getProfessor() != null ? course.getProfessor().getName() : "N/A";
                    List<CourseSchedule> schedules = course.getCourseSchedules();
                    int credit = course.getSubject() != null ? course.getSubject().getCredit() : 0;
                    return new CourseDTO(course, currentStudents, professorName, schedules, credit);
                })
                .collect(Collectors.toList());
            System.out.println("Found courses: " + courses.size());
            return ResponseEntity.ok(courseDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching courses: " + e.getMessage());
        }
    }

    // Register a new course
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> payload) {
        try {
            String professorNo = (String) payload.get("professorNo");
            Member professor = memberRepository.findByMemberNo(professorNo).orElse(null);
            
            if (professor == null) {
                return ResponseEntity.badRequest().body("Professor not found");
            }

            // Determine Department (from payload or professor)
            String selectedDeptCode = (String) payload.get("deptCode");
            Department department = null;
            if (selectedDeptCode != null && !selectedDeptCode.isEmpty()) {
                department = departmentRepository.findById(selectedDeptCode).orElse(null);
            }
            if (department == null) {
                department = professor.getDepartment();
            }
            
            // Auto-generate Subject Code: [DeptCode] + [A-Z] + [4 Digits]
            String deptCodeStr = department != null ? department.getDeptCode() : "GEN";
            Random random = new Random();
            char randomChar = (char) ('A' + random.nextInt(26));
            int randomNum = random.nextInt(10000);
            String subjectCode = String.format("%s%c%04d", deptCodeStr, randomChar, randomNum);

            // Auto-generate Course Code: [SubjectCode] + "_" + [Order 01~99]
            int courseCount = courseRepository.findByProfessor_MemberNo(professorNo).size();
            int order = courseCount + 1;
            String courseCode = String.format("%s_%02d", subjectCode, order);

            if (courseRepository.existsById(courseCode)) {
                return ResponseEntity.badRequest().body("이미 존재하는 강의 코드입니다.");
            }

            Course course = new Course();
            course.setCourseCode(courseCode);
            course.setAcademicYear(getInteger(payload, "academicYear"));
            course.setSemester(getInteger(payload, "semester"));
            
            course.setCourseClass((String) payload.get("courseClass"));
            course.setMaxStu(getInteger(payload, "maxStudents"));
            course.setClassroom((String) payload.get("classroom"));
            course.setCourseStatus("OPEN");
            
            // Create new subject
            Subject subject = new Subject();
            subject.setSCode(subjectCode);
            subject.setSName((String) payload.get("subjectName"));
            subject.setCredit(getInteger(payload, "credit"));
            subject.setDepartment(department); // Assign selected or professor's dept
            subjectRepository.save(subject);
            
            course.setSubject(subject);
            course.setProfessor(professor);

            courseRepository.save(course);

            // Save course schedules
            if (payload.containsKey("courseSchedules")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> schedules = (List<Map<String, Object>>) payload.get("courseSchedules");
                for (Map<String, Object> scheduleMap : schedules) {
                    CourseSchedule schedule = new CourseSchedule();
                    schedule.setCourse(course);
                    schedule.setDayOfWeek(getInteger(scheduleMap, "dayOfWeek"));
                    schedule.setStartTime(LocalTime.parse((String) scheduleMap.get("startTime")));
                    schedule.setEndTime(LocalTime.parse((String) scheduleMap.get("endTime")));
                    courseScheduleRepository.save(schedule);
                }
            }
            
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
