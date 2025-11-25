package com.example.studentmanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByStuNo(String stuNo);
    List<Enrollment> findByCourseCode(String courseCode);
}
