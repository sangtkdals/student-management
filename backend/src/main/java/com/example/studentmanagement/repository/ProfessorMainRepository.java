package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProfessorMainRepository extends JpaRepository<Course, String> {

    @Query("SELECT DISTINCT c FROM Course c LEFT JOIN FETCH c.subject LEFT JOIN FETCH c.courseSchedules WHERE c.professor.memberNo = :professorId ORDER BY c.courseCode DESC")
    List<Course> findMyCourses(@Param("professorId") String professorId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.courseCode = :courseCode")
    int countStudents(@Param("courseCode") String courseCode);

    @Query("SELECT s FROM Member s JOIN Enrollment e ON s.memberNo = e.student.memberNo WHERE e.course.courseCode = :courseCode")
    List<Member> findStudentsByCourse(@Param("courseCode") String courseCode);
}
