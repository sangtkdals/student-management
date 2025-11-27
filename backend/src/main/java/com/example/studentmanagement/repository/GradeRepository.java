package com.example.studentmanagement.repository;

import com.example.studentmanagement.dto.GradeDTO;
import com.example.studentmanagement.dto.ProfessorGradeDTO;
import com.example.studentmanagement.beans.Grade;
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
        WHERE m.m_id = :userId
        ORDER BY c.academic_year DESC, c.semester DESC
    """, nativeQuery = true)
    List<GradeDTO> findGradesByStudentId(@Param("userId") String userId);

    @Query(value = """
        SELECT 
            e.enrollment_id AS enrollmentId,
            m.m_no AS studentNo,
            m.m_name AS studentName,
            d.dept_name AS deptName,
            g.midterm_score AS midtermScore,
            g.final_score AS finalScore,
            g.assignment_score AS assignmentScore,
            g.attendance_score AS attendanceScore,
            g.total_score AS totalScore,
            g.grade_letter AS gradeLetter
        FROM enrollment e
        JOIN member m ON e.stu_no = m.m_no
        JOIN department d ON m.dept_code = d.dept_code
        LEFT JOIN grade g ON e.enrollment_id = g.enrollment_id
        WHERE e.course_code = :courseCode
        ORDER BY m.m_name ASC
    """, nativeQuery = true)
    List<ProfessorGradeDTO> findStudentsByCourseCode(@Param("courseCode") String courseCode);

    @Query(value = "SELECT * FROM grade WHERE enrollment_id = :enrollmentId", nativeQuery = true)
    Grade findByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query(value = """
        SELECT c.* FROM enrollment e
        JOIN course c ON e.course_code = c.course_code
        WHERE e.enrollment_id = :enrollmentId
    """, nativeQuery = true)
    com.example.studentmanagement.beans.Course findCourseByEnrollmentId(@Param("enrollmentId") Long enrollmentId);
}