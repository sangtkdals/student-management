package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.LeaveOfAbsence;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class LeaveOfAbsenceResponse {
    private Integer applicationId;
    private String stuNo;
    private String leaveType;
    private Integer startYear;
    private Integer startSemester;
    private Integer endYear;
    private Integer endSemester;
    private String applicationReason;
    private LocalDateTime applicationDate;
    private String approvalStatus;
    private LocalDateTime approvalDate;
    private String approverId;
    private String rejectReason;

    public static LeaveOfAbsenceResponse fromEntity(LeaveOfAbsence leave) {
        return LeaveOfAbsenceResponse.builder()
                .applicationId(leave.getApplicationId())
                .stuNo(leave.getStuNo())
                .leaveType(leave.getLeaveType())
                .startYear(leave.getStartYear())
                .startSemester(leave.getStartSemester())
                .endYear(leave.getEndYear())
                .endSemester(leave.getEndSemester())
                .applicationReason(leave.getApplicationReason())
                .applicationDate(leave.getApplicationDate())
                .approvalStatus(leave.getApprovalStatus())
                .approvalDate(leave.getApprovalDate())
                .approverId(leave.getApproverId())
                .rejectReason(leave.getRejectReason())
                .build();
    }
}
