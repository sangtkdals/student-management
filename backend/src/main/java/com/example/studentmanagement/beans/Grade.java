package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "grade")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id")
    private Integer gradeId;

    @Column(name = "enrollment_id", unique = true)
    private Integer enrollmentId;

    @Column(name = "midterm_score", precision = 5, scale = 2)
    private BigDecimal midtermScore;

    @Column(name = "final_score", precision = 5, scale = 2)
    private BigDecimal finalScore;

    @Column(name = "assignment_score", precision = 5, scale = 2)
    private BigDecimal assignmentScore;

    @Column(name = "attendance_score", precision = 5, scale = 2)
    private BigDecimal attendanceScore;

    @Column(name = "presentation_score", precision = 5, scale = 2)
    private BigDecimal presentationScore;

    @Column(name = "total_score", precision = 5, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "grade_letter", length = 2)
    private String gradeLetter;

    @Column(name = "grade_point", precision = 3, scale = 2)
    private BigDecimal gradePoint;

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
