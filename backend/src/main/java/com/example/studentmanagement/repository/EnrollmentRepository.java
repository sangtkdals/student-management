package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
}