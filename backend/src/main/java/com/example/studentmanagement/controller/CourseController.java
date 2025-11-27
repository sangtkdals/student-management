package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.CourseDTO;
import com.example.studentmanagement.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/professor/courses")
    public List<CourseDTO> getProfessorCourses(@RequestParam("professorId") String professorId) {
        return courseRepository.findCoursesByProfessorId(professorId);
    }
}