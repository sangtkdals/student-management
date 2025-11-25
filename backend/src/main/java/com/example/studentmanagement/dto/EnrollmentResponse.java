package com.example.studentmanagement.dto;

import com.example.studentmanagement.Enrollment;
import java.time.LocalDateTime;

public class EnrollmentResponse {
    private Integer enrollmentId;
    private String stuNo;
    private String courseCode;
    private LocalDateTime enrollmentDate;
    private String enrollmentStatus;
    private LocalDateTime cancelDate;

    public static EnrollmentResponse from(Enrollment enrollment) {
        EnrollmentResponse response = new EnrollmentResponse();
        response.setEnrollmentId(enrollment.getEnrollmentId());
        response.setStuNo(enrollment.getStuNo());
        response.setCourseCode(enrollment.getCourseCode());
        response.setEnrollmentDate(enrollment.getEnrollmentDate());
        response.setEnrollmentStatus(enrollment.getEnrollmentStatus());
        response.setCancelDate(enrollment.getCancelDate());
        return response;
    }

    // Getters and Setters
    public Integer getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public String getStuNo() {
        return stuNo;
    }

    public void setStuNo(String stuNo) {
        this.stuNo = stuNo;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public String getEnrollmentStatus() {
        return enrollmentStatus;
    }

    public void setEnrollmentStatus(String enrollmentStatus) {
        this.enrollmentStatus = enrollmentStatus;
    }

    public LocalDateTime getCancelDate() {
        return cancelDate;
    }

    public void setCancelDate(LocalDateTime cancelDate) {
        this.cancelDate = cancelDate;
    }
}
