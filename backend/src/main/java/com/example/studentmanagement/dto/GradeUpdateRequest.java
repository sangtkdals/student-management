package com.example.studentmanagement.dto;

import lombok.Data;

@Data
public class GradeUpdateRequest {
    private Long enrollmentId;
    private Double midtermScore;
    private Double finalScore;
    private Double assignmentScore;
    private Double attendanceScore;
}