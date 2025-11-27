package com.example.studentmanagement.repository;

import com.example.studentmanagement.beans.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Integer> {
    
    // 모든 휴학 신청을 최신순으로 조회 (관리자가 볼 목록)
    @Query("SELECT la FROM LeaveApplication la ORDER BY la.applicationDate DESC")
    List<LeaveApplication> findAllOrderByApplicationDateDesc();
}