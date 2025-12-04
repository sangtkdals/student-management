package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;

@Service
public class EnrollmentDbWriterService {

    private final EnrollmentRepository enrollmentRepository;
    private final MemberRepository memberRepository;

    public EnrollmentDbWriterService(EnrollmentRepository enrollmentRepository, MemberRepository memberRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.memberRepository = memberRepository;
    }

    @Async("enrollmentExecutor")
    @Transactional
    public void saveEnrollmentAsync(String studentNo, Course course) {
        Member student = memberRepository.findByMemberNo(studentNo)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + studentNo));

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(Date.from(Instant.now()));
        enrollment.setEnrollmentStatus("ENROLLED");
        enrollmentRepository.save(enrollment);
    }
}
