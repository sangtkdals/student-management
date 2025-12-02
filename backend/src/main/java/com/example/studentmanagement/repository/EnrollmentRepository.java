package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByCourse_CourseCode(String courseCode);
}
