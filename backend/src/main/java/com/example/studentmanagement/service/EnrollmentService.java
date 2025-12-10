package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.exception.EnrollmentException;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
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
    private final RedisTemplate<String, Object> redisTemplate;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository, MemberRepository memberRepository, @Qualifier("redisTemplate") RedisTemplate<String, Object> redisTemplate) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.memberRepository = memberRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public void enrollCourse(String studentNo, String courseCode) {
        // 1. Redis Set을 이용한 중복 신청 확인 (DB 조회보다 빠름)
        String enrollmentKey = "enrollment:" + courseCode;
        if (Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(enrollmentKey, studentNo))) {
            throw new EnrollmentException("Already enrolled in this course");
        }

        // 2. Redis에서 캐시된 최대 수강 인원 정보 조회
        String maxStuKey = "course:max_stu:" + courseCode;
        String maxStuStr = (String) redisTemplate.opsForValue().get(maxStuKey);
        if (maxStuStr == null) {
            // 캐시가 없는 경우 (예외적인 상황), DB에서 조회하고 캐시에 저장
            Course course = courseRepository.findById(courseCode)
                    .orElseThrow(() -> new EntityNotFoundException("Course not found: " + courseCode));
            maxStuStr = String.valueOf(course.getMaxStu());
            redisTemplate.opsForValue().set(maxStuKey, maxStuStr);
        }
        int maxStu = Integer.parseInt(maxStuStr);


        // 3. Redis INCR을 이용한 원자적 인원 증가 및 정원 확인
        String countKey = "course:count:" + courseCode;
        Long currentStudents = redisTemplate.opsForValue().increment(countKey);

        if (currentStudents != null && currentStudents > maxStu) {
            // 정원 초과 시, 카운터 원복 및 예외 발생
            redisTemplate.opsForValue().decrement(countKey);
            throw new EnrollmentException("Course is full");
        }

        // 4. Redis Set에 학생 추가
        redisTemplate.opsForSet().add(enrollmentKey, (String) studentNo);

        // 5. DB 저장을 비동기로 처리하여 사용자 응답 속도 향상
        Course course = new Course();
        course.setCourseCode(courseCode);
        saveEnrollmentAsync(studentNo, course);
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
