package com.example.studentmanagement.dto;

public interface ProfessorGradeDTO {
    Long getEnrollmentId();   
    String getStudentNo();    
    String getStudentName();  
    String getDeptName();     
    
    Double getMidtermScore();
    Double getFinalScore();
    Double getAssignmentScore();
    Double getAttendanceScore();
    Double getTotalScore();
    String getGradeLetter();
}