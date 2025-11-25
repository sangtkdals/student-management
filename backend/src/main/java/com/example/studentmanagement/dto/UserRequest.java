package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserRequest {
    private String mId;
    private String mPwd;
    private String mName;
    private String mType; // STUDENT, PROFESSOR, ADMIN
    private String mNo;
    private String mEmail;
    private String mPhone;
    private String mNum;
    private LocalDate mBirth;
    private String mAddr;
    private String deptCode;
    private Integer stuGrade;
    private String enrollmentStatus;
    private String position;
    private String officeRoom;
    private String majorField;
    private LocalDate startDate;
}
