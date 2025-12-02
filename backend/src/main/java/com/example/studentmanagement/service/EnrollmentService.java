package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.exception.EnrollmentException;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final MemberRepository memberRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository, MemberRepository memberRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public void enrollCourse(String studentNo, String courseCode) {
        Member student = memberRepository.findByMemberNo(studentNo)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + studentNo));
        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new EntityNotFoundException("Course not found: " + courseCode));

        if (enrollmentRepository.existsByStudent_MemberNoAndCourse_CourseCode(studentNo, courseCode)) {
            throw new EnrollmentException("Already enrolled in this course");
        }

        long currentStudents = enrollmentRepository.countByCourse_CourseCode(courseCode);
        if (currentStudents >= course.getMaxStu()) {
            throw new EnrollmentException("Course is full");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(Date.from(Instant.now()));
        enrollment.setEnrollmentStatus("ENROLLED");
        enrollmentRepository.save(enrollment);
    }

    @Transactional
    public void cancelEnrollment(String studentNo, String courseCode) {
        Enrollment enrollment = enrollmentRepository.findByStudent_MemberNoAndCourse_CourseCode(studentNo, courseCode)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found for student " + studentNo + " in course " + courseCode));

        enrollmentRepository.delete(enrollment);
    }

    public List<Enrollment> getEnrollmentsByStudent(String studentNo) {
        return enrollmentRepository.findByStudent_MemberNo(studentNo);
    }
}
