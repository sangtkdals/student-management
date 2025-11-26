package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByProfessor_MemberNo(String professorNo);
}