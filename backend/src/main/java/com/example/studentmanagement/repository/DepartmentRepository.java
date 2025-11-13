package com.example.studentmanagement.repository;

import com.example.studentmanagement.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    // JpaRepository를 상속받는 것만으로 기본적인 CRUD 기능이 모두 제공됩니다.
}