package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.CourseSchedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private String courseCode;
    private int academicYear;
    private int semester;
    private String sCode;
    private String subjectName; // 과목명 필드 추가
    private String courseClass;
    private String professorNo;
    private String professorName;
    private int maxStu;
    private int currentStu;
    private String classroom;
    private List<CourseSchedule> schedules;
    private String courseStatus;
    private int credit;
    
    // Additional fields to match DB structure
    private String courseObjectives;
    private String courseContent;
    private String evaluationMethod;
    private String textbookInfo;

    public CourseDTO(Course course, int currentStu, String professorName, List<CourseSchedule> schedules, int credit) {
        this.courseCode = course.getCourseCode();
        this.academicYear = course.getAcademicYear();
        this.semester = course.getSemester();
        
        if (course.getSubject() != null) {
            this.sCode = course.getSubject().getSCode();
            this.subjectName = course.getSubject().getSName();
        } else {
            this.sCode = null;
            this.subjectName = "Unknown";
        }
        
        this.courseClass = course.getCourseClass();
        
        if (course.getProfessor() != null) {
            this.professorNo = course.getProfessor().getMemberNo();
        } else {
            this.professorNo = null;
        }

        this.professorName = professorName;
        this.maxStu = course.getMaxStu();
        this.currentStu = currentStu;
        this.classroom = course.getClassroom();
        this.schedules = schedules;
        this.courseStatus = course.getCourseStatus();
        this.credit = credit;
        
        this.courseObjectives = course.getCourseObjectives();
        this.courseContent = course.getCourseContent();
        this.evaluationMethod = course.getEvaluationMethod();
        this.textbookInfo = course.getTextbookInfo();
    }
}
