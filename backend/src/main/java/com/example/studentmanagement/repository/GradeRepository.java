package com.example.studentmanagement.repository;
import com.example.studentmanagement.beans.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Integer> {
    Optional<Grade> findByEnrollmentId(Integer enrollmentId);
}
