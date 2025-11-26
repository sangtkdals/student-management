package com.example.studentmanagement.repository;
import com.example.studentmanagement.beans.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {

    List<Course> findByProfessorNo(String professorNo);

    @Query("SELECT c FROM Course c WHERE c.sCode = :sCode")
    List<Course> findBySCode(@Param("sCode") String sCode);

    List<Course> findByAcademicYearAndSemester(Integer academicYear, Integer semester);

    List<Course> findByCourseStatus(String courseStatus);

    List<Course> findByProfessorNoAndAcademicYearAndSemester(String professorNo, Integer academicYear, Integer semester);

    List<Course> findAllByOrderByCourseCodeAsc();
}
