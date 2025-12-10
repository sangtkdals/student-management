package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AssignmentDto {
    private Long assignmentId;
    private String assignmentTitle;
    private String assignmentDesc;
    private String attachmentPath;
    private String registrationDate;
    private String dueDate;
    private String courseCode;
    private AssignmentSubmissionDto submission;
}
