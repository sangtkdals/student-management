package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.Tuition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TuitionRepository extends JpaRepository<Tuition, Integer> {

    // 학생별 등록금 내역 조회
    @Query("SELECT t FROM Tuition t WHERE t.student.memberNo = :studentNo ORDER BY t.academicYear DESC, t.semester DESC")
    List<Tuition> findByStudentNo(@Param("studentNo") String studentNo);

    // 학기별 등록금 내역 조회
    @Query("SELECT t FROM Tuition t WHERE t.academicYear = :year AND t.semester = :semester ORDER BY t.student.memberNo")
    List<Tuition> findByYearAndSemester(@Param("year") Integer year, @Param("semester") Integer semester);

    // 납부상태별 조회
    @Query("SELECT t FROM Tuition t WHERE t.paymentStatus = :status ORDER BY t.academicYear DESC, t.semester DESC")
    List<Tuition> findByPaymentStatus(@Param("status") String status);

    // 전체 등록금 목록 조회 (실제 납부금액 기준 오름차순 정렬)
    @Query("SELECT t FROM Tuition t ORDER BY (t.tuitionAmount - t.scholarshipAmount) ASC")
    List<Tuition> findAllOrderByPaymentAmount();
}
