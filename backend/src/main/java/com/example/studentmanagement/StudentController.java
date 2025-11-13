package com.example.studentmanagement;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentController {

    private final StudentRepository studentRepository;

    // 생성자를 통해 Spring이 자동으로 StudentRepository를 주입해줌 (의존성 주입)
    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // GET /api/students 요청이 오면 이 메소드가 실행됨
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        // Repository를 사용해 DB에 있는 모든 학생 정보를 조회하여 반환
        return studentRepository.findAll();
    }
}