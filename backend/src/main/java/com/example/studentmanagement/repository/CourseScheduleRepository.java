package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.CourseSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Integer> {
}
