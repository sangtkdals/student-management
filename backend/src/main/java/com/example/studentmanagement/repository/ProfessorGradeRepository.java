package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.dto.StudentGradeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProfessorGradeRepository extends JpaRepository<Enrollment, Integer> {

    // [핵심 기능] 교수님 화면에 뿌릴 DTO 데이터 가져오기
    @Query("SELECT new com.example.studentmanagement.dto.StudentGradeDTO(" +
           "g.gradeId, m.memberNo, m.name, d.deptName, m.email, " + 
           "g.midtermScore, g.finalScore, g.assignmentScore, g.attendanceScore, g.totalScore) " +
           "FROM Enrollment e " +
           "JOIN e.student m " +
           "LEFT JOIN m.department d " +
           "LEFT JOIN Grade g ON g.enrollment.enrollmentId = e.enrollmentId " +
           "WHERE e.course.courseCode = :courseCode")
    List<StudentGradeDTO> findStudentsByCourseCode(@Param("courseCode") String courseCode);
}