package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class UserResponse {
    private String mId;
    private String mName;
    private String mType;
    private String mNo;
    private String mEmail;
    private String mPhone;
    private LocalDate mBirth;
    private String mAddr;
    private String deptCode;
    private Integer stuGrade;
    private String enrollmentStatus;
    private String position;
    private String officeRoom;
    private String majorField;
    private LocalDate startDate;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .mId(user.getMId())
                .mName(user.getMName())
                .mType(user.getMType())
                .mNo(user.getMNo())
                .mEmail(user.getMEmail())
                .mPhone(user.getMPhone())
                .mBirth(user.getMBirth())
                .mAddr(user.getMAddr())
                .deptCode(user.getDeptCode())
                .stuGrade(user.getStuGrade())
                .enrollmentStatus(user.getEnrollmentStatus())
                .position(user.getPosition())
                .officeRoom(user.getOfficeRoom())
                .majorField(user.getMajorField())
                .startDate(user.getStartDate())
                .build();
    }
}
