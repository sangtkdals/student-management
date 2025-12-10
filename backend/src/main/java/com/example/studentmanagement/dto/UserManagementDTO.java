package com.example.studentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementDTO {
    private String memberNo;
    private String memberName;
    private String memberType; // STUDENT, PROFESSOR, ADMIN
    private String email;
    private String phone;

    // Student specific fields
    private String deptCode;
    private String deptName;
    private Integer stuGrade;
    private String enrollmentStatus;

    // Professor specific fields
    private String officeLocation;
    private String position;
}
