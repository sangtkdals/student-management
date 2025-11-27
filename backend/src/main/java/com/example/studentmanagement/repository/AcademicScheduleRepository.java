package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.AcademicSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcademicScheduleRepository extends JpaRepository<AcademicSchedule, Integer> {
    // 기본 CRUD는 JpaRepository가 자동 제공
}