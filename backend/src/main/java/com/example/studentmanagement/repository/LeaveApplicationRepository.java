package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Integer> {

    // 학생별 휴학 신청 조회
    List<LeaveApplication> findByStudent_MemberNo(String studentNo);

    // 승인 상태별 조회
    List<LeaveApplication> findByApprovalStatus(String approvalStatus);

    // 승인 대기 중인 신청 조회 (최신순)
    @Query("SELECT la FROM LeaveApplication la WHERE la.approvalStatus = 'PENDING' ORDER BY la.applicationDate DESC")
    List<LeaveApplication> findPendingApplications();

    // 승인된 신청 조회
    @Query("SELECT la FROM LeaveApplication la WHERE la.approvalStatus = 'APPROVED' ORDER BY la.approvalDate DESC")
    List<LeaveApplication> findApprovedApplications();

    // 거절된 신청 조회
    @Query("SELECT la FROM LeaveApplication la WHERE la.approvalStatus = 'REJECTED' ORDER BY la.approvalDate DESC")
    List<LeaveApplication> findRejectedApplications();

    // 특정 학생의 승인 대기 중인 신청
    @Query("SELECT la FROM LeaveApplication la WHERE la.student.memberNo = :studentNo AND la.approvalStatus = 'PENDING'")
    List<LeaveApplication> findPendingByStudent(@Param("studentNo") String studentNo);

    // 휴학 유형별 조회
    List<LeaveApplication> findByLeaveType(String leaveType);

    // 특정 기간의 신청 조회
    @Query("SELECT la FROM LeaveApplication la WHERE la.startYear = :year AND la.startSemester = :semester")
    List<LeaveApplication> findByStartPeriod(@Param("year") Integer year, @Param("semester") Integer semester);
}