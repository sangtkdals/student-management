package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    List<Assignment> findByCourseCode(String courseCode);
}
