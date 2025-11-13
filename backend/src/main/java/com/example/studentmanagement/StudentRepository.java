package com.example.studentmanagement;

import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository를 상속받기만 하면 기본적인 DB 작업 메소드(findAll, findById, save 등)를 자동으로 사용할 수 있게 됨
public interface StudentRepository extends JpaRepository<Student, Long> {
    // <Student, Long> 의미: "Student 엔티티를 다루고, 그 엔티티의 ID 타입은 Long이다"
}