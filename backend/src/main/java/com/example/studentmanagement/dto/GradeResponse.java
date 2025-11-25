package com.example.studentmanagement.dto;

import com.example.studentmanagement.Grade;
import java.math.BigDecimal;

public class GradeResponse {
    private Integer gradeId;
    private Integer enrollmentId;
    private BigDecimal midtermScore;
    private BigDecimal finalScore;
    private BigDecimal assignmentScore;
    private BigDecimal attendanceScore;
    private BigDecimal presentationScore;
    private BigDecimal totalScore;
    private String gradeLetter;
    private BigDecimal gradePoint;

    public static GradeResponse from(Grade grade) {
        GradeResponse response = new GradeResponse();
        response.setGradeId(grade.getGradeId());
        response.setEnrollmentId(grade.getEnrollmentId());
        response.setMidtermScore(grade.getMidtermScore());
        response.setFinalScore(grade.getFinalScore());
        response.setAssignmentScore(grade.getAssignmentScore());
        response.setAttendanceScore(grade.getAttendanceScore());
        response.setPresentationScore(grade.getPresentationScore());
        response.setTotalScore(grade.getTotalScore());
        response.setGradeLetter(grade.getGradeLetter());
        response.setGradePoint(grade.getGradePoint());
        return response;
    }

    // Getters and Setters
    public Integer getGradeId() {
        return gradeId;
    }

    public void setGradeId(Integer gradeId) {
        this.gradeId = gradeId;
    }

    public Integer getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public BigDecimal getMidtermScore() {
        return midtermScore;
    }

    public void setMidtermScore(BigDecimal midtermScore) {
        this.midtermScore = midtermScore;
    }

    public BigDecimal getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(BigDecimal finalScore) {
        this.finalScore = finalScore;
    }

    public BigDecimal getAssignmentScore() {
        return assignmentScore;
    }

    public void setAssignmentScore(BigDecimal assignmentScore) {
        this.assignmentScore = assignmentScore;
    }

    public BigDecimal getAttendanceScore() {
        return attendanceScore;
    }

    public void setAttendanceScore(BigDecimal attendanceScore) {
        this.attendanceScore = attendanceScore;
    }

    public BigDecimal getPresentationScore() {
        return presentationScore;
    }

    public void setPresentationScore(BigDecimal presentationScore) {
        this.presentationScore = presentationScore;
    }

    public BigDecimal getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(BigDecimal totalScore) {
        this.totalScore = totalScore;
    }

    public String getGradeLetter() {
        return gradeLetter;
    }

    public void setGradeLetter(String gradeLetter) {
        this.gradeLetter = gradeLetter;
    }

    public BigDecimal getGradePoint() {
        return gradePoint;
    }

    public void setGradePoint(BigDecimal gradePoint) {
        this.gradePoint = gradePoint;
    }
}
