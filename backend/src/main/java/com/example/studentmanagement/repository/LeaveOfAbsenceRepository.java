package com.example.studentmanagement.repository;
import com.example.studentmanagement.beans.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveOfAbsenceRepository extends JpaRepository<LeaveOfAbsence, Integer> {

    List<LeaveOfAbsence> findByStuNoOrderByApplicationDateDesc(String stuNo);

    List<LeaveOfAbsence> findByApprovalStatusOrderByApplicationDateDesc(String approvalStatus);

    List<LeaveOfAbsence> findByStuNoAndApprovalStatus(String stuNo, String approvalStatus);

    List<LeaveOfAbsence> findByLeaveType(String leaveType);

    List<LeaveOfAbsence> findAllByOrderByApplicationDateDesc();
}
