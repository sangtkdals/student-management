package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseRequest {
    private String courseCode;
    private Integer academicYear;
    private Integer semester;
    private String sCode;
    private String courseClass;
    private String professorNo;
    private Integer maxStu;
    private Integer currentStudents;
    private String classroom;
    private String courseTime;
    private String courseObjectives;
    private String courseContent;
    private String evaluationMethod;
    private String textbookInfo;
    private String courseStatus;
}
