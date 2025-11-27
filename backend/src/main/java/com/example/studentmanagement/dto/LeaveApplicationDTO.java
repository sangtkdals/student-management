package com.example.studentmanagement.dto;

import lombok.Data;

@Data  // Getter, Setter, toString 등을 자동 생성
public class LeaveApplicationDTO {
    private Integer applicationId;
    private String studentNo;
    private String studentName;
    private String leaveType;
    private Integer startYear;
    private Integer startSemester;
    private Integer endYear;
    private Integer endSemester;
    private String reason;
    private String applicationDate;
    private String approvalStatus;
    private String approvalDate;
    private String rejectReason;
}