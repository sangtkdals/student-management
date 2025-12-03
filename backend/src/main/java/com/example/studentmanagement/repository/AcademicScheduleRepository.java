package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.AcademicSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicScheduleRepository extends JpaRepository<AcademicSchedule, Integer> {
}
