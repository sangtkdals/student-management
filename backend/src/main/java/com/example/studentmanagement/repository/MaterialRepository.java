package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Integer> {
    List<Material> findByCourse_CourseCode(String courseCode);
}
