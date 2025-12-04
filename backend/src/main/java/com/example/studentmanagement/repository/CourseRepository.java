package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Course;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {
    
    @Override
    @EntityGraph(attributePaths = {"subject", "professor", "subject.department"})
    List<Course> findAll();

    List<Course> findByProfessor_MemberNo(String memberNo);

    List<Course> findBySubject_Department_DeptNameAndSubject_sNameContaining(String deptName, String sName);

    List<Course> findBySubject_Department_DeptNameAndCourseCodeContaining(String deptName, String courseCode);
    
    List<Course> findBySubject_Department_DeptName(String deptName);

    List<Course> findBySubject_sNameContaining(String sName);

    List<Course> findByCourseCodeContaining(String courseCode);
}
