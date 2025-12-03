package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.LeaveApplication;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveApplicationDTO {
    private Integer applicationId;
    private String studentNo;
    private String studentName;
    private String leaveType;
    private Integer startYear;
    private Integer startSemester;
    private Integer endYear;
    private Integer endSemester;
    private String applicationReason;
    private Date applicationDate;
    private String approvalStatus;
    private Date approvalDate;
    private String approverNo;
    private String approverName;
    private String rejectReason;

    // Entity -> DTO 변환 생성자
    public LeaveApplicationDTO(LeaveApplication leaveApplication, String studentName, String approverName) {
        this.applicationId = leaveApplication.getApplicationId();
        this.studentNo = leaveApplication.getStudent() != null ? leaveApplication.getStudent().getMemberNo() : null;
        this.studentName = studentName;
        this.leaveType = leaveApplication.getLeaveType();
        this.startYear = leaveApplication.getStartYear();
        this.startSemester = leaveApplication.getStartSemester();
        this.endYear = leaveApplication.getEndYear();
        this.endSemester = leaveApplication.getEndSemester();
        this.applicationReason = leaveApplication.getApplicationReason();
        this.applicationDate = leaveApplication.getApplicationDate();
        this.approvalStatus = leaveApplication.getApprovalStatus();
        this.approvalDate = leaveApplication.getApprovalDate();
        this.approverNo = leaveApplication.getApprover() != null ? leaveApplication.getApprover().getMemberNo() : null;
        this.approverName = approverName;
        this.rejectReason = leaveApplication.getRejectReason();
    }
}
