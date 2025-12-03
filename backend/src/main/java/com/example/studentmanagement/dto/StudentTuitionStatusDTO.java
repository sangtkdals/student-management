package com.example.studentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTuitionStatusDTO {
    private String studentNo;
    private String studentName;
    private String deptCode;
    private String deptName;
    private Integer stuGrade;
    private String enrollmentStatus;
    private Boolean hasExistingTuition; // 해당 학년도/학기의 등록금 고지서 존재 여부
    private Integer existingTuitionId; // 기존 등록금 ID (있는 경우)
    private String paymentStatus; // 기존 등록금의 납부 상태 (있는 경우)
}
