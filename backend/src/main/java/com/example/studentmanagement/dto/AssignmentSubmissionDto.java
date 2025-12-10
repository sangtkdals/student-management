package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AssignmentSubmissionDto {
    private Long submissionId;
    private String studentName;
    private String studentId; // Add studentId
    private String submissionDate;
    private String content;
    private String filePath;
    private Integer grade;
    private String feedback;
}
