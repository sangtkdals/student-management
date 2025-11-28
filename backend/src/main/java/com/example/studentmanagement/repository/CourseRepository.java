package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.dto.CourseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {

    @Query(value = """
        SELECT 
            c.course_code AS courseCode,
            s.s_name AS subjectName,
            c.course_class AS courseClass,
            c.course_time AS courseTime,
            c.classroom AS classroom,
            (SELECT COUNT(*) FROM enrollment e WHERE e.course_code = c.course_code) AS currentStudents
        FROM course c
        JOIN subject s ON c.s_code = s.s_code
        JOIN member m ON c.professor_no = m.m_no
        WHERE m.m_id = :professorId
        ORDER BY c.course_code DESC
    """, nativeQuery = true)
    List<CourseDTO> findCoursesByProfessorId(@Param("professorId") String professorId);

    List<Course> findByProfessor_MemberNo(String professorNo);
}