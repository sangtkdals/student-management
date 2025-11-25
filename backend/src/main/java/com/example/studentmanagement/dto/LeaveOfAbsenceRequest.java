package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class LeaveOfAbsenceRequest {
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
}
