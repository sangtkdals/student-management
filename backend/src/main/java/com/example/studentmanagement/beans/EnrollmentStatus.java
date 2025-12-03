package com.example.studentmanagement.beans;

public enum EnrollmentStatus {
    ENROLLED("재학"),
    LEAVE_OF_ABSENCE("휴학"),
    GRADUATED("졸업"),
    EXPELLED("제적"),
    WITHDRAWN("자퇴");

    private final String koreanName;

    EnrollmentStatus(String koreanName) {
        this.koreanName = koreanName;
    }

    public String getKoreanName() {
        return koreanName;
    }
}
