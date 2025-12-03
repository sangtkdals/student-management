package com.example.studentmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class StudentGradeDTO {
    private Long gradeId;
    private String studentId;
    private String studentName;
    private String department;
    private String email;
    
    private Double midtermScore;
    private Double finalScore;
    private Double assignmentScore;
    private Double attendanceScore;
    private Double totalScore;

    public StudentGradeDTO(Integer gradeId, String studentId, String studentName, String department, String email, 
                           BigDecimal midtermScore, BigDecimal finalScore, BigDecimal assignmentScore, BigDecimal attendanceScore, BigDecimal totalScore) {
        this.gradeId = gradeId != null ? gradeId.longValue() : null;
        this.studentId = studentId;
        this.studentName = studentName;
        this.department = department;
        this.email = email;
        this.midtermScore = midtermScore != null ? midtermScore.doubleValue() : 0.0;
        this.finalScore = finalScore != null ? finalScore.doubleValue() : 0.0;
        this.assignmentScore = assignmentScore != null ? assignmentScore.doubleValue() : 0.0;
        this.attendanceScore = attendanceScore != null ? attendanceScore.doubleValue() : 0.0;
        this.totalScore = totalScore != null ? totalScore.doubleValue() : 0.0;
    }
}