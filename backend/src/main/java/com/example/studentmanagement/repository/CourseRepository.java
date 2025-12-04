package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Course;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {
    
    @Override
    @EntityGraph(attributePaths = {"subject", "professor"})
    List<Course> findAll();

    List<Course> findByProfessor_MemberNo(String memberNo);
}
