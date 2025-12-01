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

    public CourseDTO(Course course, int currentStu, String professorName, List<CourseSchedule> schedules, int credit) {
        this.courseCode = course.getCourseCode();
        this.academicYear = course.getAcademicYear();
        this.semester = course.getSemester();
        this.sCode = course.getSubject().getSCode();
        this.subjectName = course.getSubject().getSName();
        this.courseClass = course.getCourseClass();
        this.professorNo = course.getProfessor().getMemberNo();
        this.professorName = professorName;
        this.maxStu = course.getMaxStu();
        this.currentStu = currentStu;
        this.classroom = course.getClassroom();
        this.schedules = schedules;
        this.courseStatus = course.getCourseStatus();
        this.credit = credit;
    }
}
