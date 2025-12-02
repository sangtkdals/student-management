package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Tuition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TuitionRepository extends JpaRepository<Tuition, Integer> {

    // 학생별 등록금 조회
    List<Tuition> findByStudent_MemberNo(String studentNo);

    // 학년도 및 학기별 등록금 조회
    List<Tuition> findByAcademicYearAndSemester(Integer academicYear, Integer semester);

    // 결제 상태별 등록금 조회
    List<Tuition> findByPaymentStatus(String paymentStatus);

    // 특정 학생의 학년도, 학기 등록금 조회
    @Query("SELECT t FROM Tuition t WHERE t.student.memberNo = :studentNo AND t.academicYear = :academicYear AND t.semester = :semester")
    List<Tuition> findByStudentAndAcademicYearAndSemester(
        @Param("studentNo") String studentNo,
        @Param("academicYear") Integer academicYear,
        @Param("semester") Integer semester
    );

    // 미납 등록금 조회 (결제 상태가 '미납'인 경우)
    @Query("SELECT t FROM Tuition t WHERE t.paymentStatus = 'UNPAID' ORDER BY t.dueDate ASC")
    List<Tuition> findUnpaidTuitions();

    // 마감일이 지난 미납 등록금 조회
    @Query("SELECT t FROM Tuition t WHERE t.paymentStatus = 'UNPAID' AND t.dueDate < CURRENT_DATE ORDER BY t.dueDate ASC")
    List<Tuition> findOverdueTuitions();
}
