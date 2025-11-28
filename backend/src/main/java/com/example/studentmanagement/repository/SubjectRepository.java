package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, String> {
}
