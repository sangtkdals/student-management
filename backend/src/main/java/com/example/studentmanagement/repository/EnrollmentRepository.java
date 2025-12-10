package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.beans.Course;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    
    List<Enrollment> findByCourse_CourseCode(String courseCode);

    boolean existsByStudent_MemberNoAndCourse_CourseCode(String studentNo, String courseCode);

    Optional<Enrollment> findByStudent_MemberNoAndCourse_CourseCode(String studentNo, String courseCode);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course c JOIN FETCH c.subject JOIN FETCH c.professor WHERE e.student.memberNo = :studentNo")
    List<Enrollment> findByStudent_MemberNo(@Param("studentNo") String studentNo);

    @Query("SELECT e.course FROM Enrollment e " +
           "JOIN FETCH e.course.subject " +
           "JOIN FETCH e.course.professor " +
           "LEFT JOIN FETCH e.course.courseSchedules " +
           "WHERE e.student.memberNo = :studentNo")
    List<Course> findCoursesByStudentNoWithDetails(@Param("studentNo") String studentNo);

    List<Enrollment> findAllByCourse_CourseCodeIn(List<String> courseCodes);
    
    long countByCourse_CourseCode(String courseCode);

    @Transactional
    void deleteByCourse_CourseCode(String courseCode);
}
