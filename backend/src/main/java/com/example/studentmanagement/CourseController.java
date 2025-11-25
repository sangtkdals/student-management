package com.example.studentmanagement;

import com.example.studentmanagement.dto.CourseRequest;
import com.example.studentmanagement.dto.CourseResponse;
import com.example.studentmanagement.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{courseCode}")
    public ResponseEntity<CourseResponse> getCourseByCourseCode(@PathVariable String courseCode) {
        try {
            return ResponseEntity.ok(courseService.getCourseByCourseCode(courseCode));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/professor/{professorNo}")
    public ResponseEntity<List<CourseResponse>> getCoursesByProfessorNo(@PathVariable String professorNo) {
        return ResponseEntity.ok(courseService.getCoursesByProfessorNo(professorNo));
    }

    @GetMapping("/year/{year}/semester/{semester}")
    public ResponseEntity<List<CourseResponse>> getCoursesByYearAndSemester(
            @PathVariable Integer year, @PathVariable Integer semester) {
        return ResponseEntity.ok(courseService.getCoursesByYearAndSemester(year, semester));
    }

    @PutMapping("/{courseCode}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable String courseCode, @RequestBody CourseRequest request) {
        try {
            return ResponseEntity.ok(courseService.updateCourse(courseCode, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{courseCode}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String courseCode) {
        try {
            courseService.deleteCourse(courseCode);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{courseCode}/enroll")
    public ResponseEntity<CourseResponse> enrollStudent(@PathVariable String courseCode) {
        try {
            return ResponseEntity.ok(courseService.enrollStudent(courseCode));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/{courseCode}/drop")
    public ResponseEntity<CourseResponse> dropStudent(@PathVariable String courseCode) {
        try {
            return ResponseEntity.ok(courseService.dropStudent(courseCode));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
