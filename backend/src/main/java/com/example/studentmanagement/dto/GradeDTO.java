package com.example.studentmanagement.dto;

import java.math.BigDecimal;

public interface GradeDTO {
    Integer getGradeId();  
    Integer getYear();
    Integer getSemester();
    String getCourseCode();
    String getCourseName();
    Integer getCredit();
    String getGradeLetter();
    BigDecimal getGradePoint(); 
}