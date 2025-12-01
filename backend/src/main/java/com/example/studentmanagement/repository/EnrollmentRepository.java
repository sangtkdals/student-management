package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    // 특정 강의를 수강하는 학생 목록 조회 (성적/출석 처리에 필수)
    List<Enrollment> findByCourse_CourseCode(String courseCode);
}