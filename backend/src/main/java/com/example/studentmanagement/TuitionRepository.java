package com.example.studentmanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TuitionRepository extends JpaRepository<Tuition, Integer> {

    List<Tuition> findByStuNoOrderByAcademicYearDescSemesterDesc(String stuNo);

    List<Tuition> findByPaymentStatusOrderByDueDateAsc(String paymentStatus);

    List<Tuition> findByAcademicYearAndSemester(Integer academicYear, Integer semester);

    List<Tuition> findByStuNoAndAcademicYearAndSemester(String stuNo, Integer academicYear, Integer semester);

    List<Tuition> findByPaymentStatusAndAcademicYear(String paymentStatus, Integer academicYear);

    List<Tuition> findAllByOrderByAcademicYearDescSemesterDescDueDateAsc();
}
