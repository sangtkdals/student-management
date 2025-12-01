package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findByEnrollment_Course_CourseCodeAndPeriod(String courseCode, Integer period);
    Optional<Attendance> findByEnrollment_EnrollmentIdAndPeriod(Integer enrollmentId, Integer period);
}
