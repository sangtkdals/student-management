package com.example.studentmanagement.dto;

import com.example.studentmanagement.Course;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CourseResponse {
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
    private Boolean isFull;

    public static CourseResponse fromEntity(Course course) {
        boolean isFull = false;
        if (course.getMaxStu() != null && course.getCurrentStudents() != null) {
            isFull = course.getCurrentStudents() >= course.getMaxStu();
        }

        return CourseResponse.builder()
                .courseCode(course.getCourseCode())
                .academicYear(course.getAcademicYear())
                .semester(course.getSemester())
                .sCode(course.getSCode())
                .courseClass(course.getCourseClass())
                .professorNo(course.getProfessorNo())
                .maxStu(course.getMaxStu())
                .currentStudents(course.getCurrentStudents())
                .classroom(course.getClassroom())
                .courseTime(course.getCourseTime())
                .courseObjectives(course.getCourseObjectives())
                .courseContent(course.getCourseContent())
                .evaluationMethod(course.getEvaluationMethod())
                .textbookInfo(course.getTextbookInfo())
                .courseStatus(course.getCourseStatus())
                .isFull(isFull)
                .build();
    }
}
