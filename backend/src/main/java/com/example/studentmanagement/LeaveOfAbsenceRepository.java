package com.example.studentmanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveOfAbsenceRepository extends JpaRepository<LeaveOfAbsence, Long> {

    // 특정 학생의 모든 휴학/복학 신청 내역 조회 (최신순)
    List<LeaveOfAbsence> findByStudentIdOrderByApplicationDateDesc(Long studentId);

    // 특정 학생의 특정 타입 신청 내역 조회 (휴학 또는 복학)
    List<LeaveOfAbsence> findByStudentIdAndTypeOrderByApplicationDateDesc(Long studentId, String type);

    // 특정 학생의 특정 상태 신청 내역 조회
    List<LeaveOfAbsence> findByStudentIdAndStatusOrderByApplicationDateDesc(Long studentId, String status);

    // 특정 학생의 특정 타입 및 상태 신청 내역 조회
    List<LeaveOfAbsence> findByStudentIdAndTypeAndStatus(Long studentId, String type, String status);
}
