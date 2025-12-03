package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Grade;
import com.example.studentmanagement.dto.GradeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Integer> {

    @Query(value = """
        SELECT 
            g.grade_id AS gradeId,
            c.academic_year AS year,
            c.semester AS semester,
            s.s_code AS courseCode,
            s.s_name AS courseName,
            s.credit AS credit,
            g.grade_letter AS gradeLetter,
            g.grade_point AS gradePoint
        FROM grade g
        JOIN enrollment e ON g.enrollment_id = e.enrollment_id
        JOIN course c ON e.course_code = c.course_code
        JOIN subject s ON c.s_code = s.s_code
        JOIN member m ON e.stu_no = m.m_no 
        WHERE m.m_no = :studentId
        ORDER BY c.academic_year DESC, c.semester DESC
    """, nativeQuery = true)
    List<GradeDTO> findGradesByStudentId(@Param("studentId") String studentId);
}