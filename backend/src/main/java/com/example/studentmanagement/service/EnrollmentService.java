package com.example.studentmanagement.service;

import com.example.studentmanagement.Enrollment;
import com.example.studentmanagement.EnrollmentRepository;
import com.example.studentmanagement.dto.EnrollmentRequest;
import com.example.studentmanagement.dto.EnrollmentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public List<EnrollmentResponse> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(EnrollmentResponse::from)
                .collect(Collectors.toList());
    }

    public List<EnrollmentResponse> getEnrollmentsByStudentNo(String stuNo) {
        return enrollmentRepository.findByStuNo(stuNo).stream()
                .map(EnrollmentResponse::from)
                .collect(Collectors.toList());
    }

    public List<EnrollmentResponse> getEnrollmentsByCourseCode(String courseCode) {
        return enrollmentRepository.findByCourseCode(courseCode).stream()
                .map(EnrollmentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentResponse createEnrollment(EnrollmentRequest request) {
        Enrollment enrollment = new Enrollment();
        enrollment.setStuNo(request.getStuNo());
        enrollment.setCourseCode(request.getCourseCode());
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setEnrollmentStatus("ENROLLED");

        Enrollment saved = enrollmentRepository.save(enrollment);
        return EnrollmentResponse.from(saved);
    }

    @Transactional
    public void deleteEnrollment(Integer enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}
