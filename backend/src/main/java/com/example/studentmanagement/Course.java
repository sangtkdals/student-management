package com.example.studentmanagement;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "course")
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    @Column(name = "course_code", length = 20)
    private String courseCode;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "s_code", length = 20)
    private String sCode;

    @Column(name = "course_class", length = 10)
    private String courseClass;

    @Column(name = "professor_no", length = 20)
    private String professorNo;

    @Column(name = "max_stu")
    private Integer maxStu;

    @Column(name = "current_students")
    private Integer currentStudents;

    @Column(name = "classroom", length = 50)
    private String classroom;

    @Column(name = "course_time", length = 100)
    private String courseTime;

    @Column(name = "course_objectives", columnDefinition = "TEXT")
    private String courseObjectives;

    @Column(name = "course_content", columnDefinition = "TEXT")
    private String courseContent;

    @Column(name = "evaluation_method", length = 1000)
    private String evaluationMethod;

    @Column(name = "textbook_info", length = 1000)
    private String textbookInfo;

    @Column(name = "course_status", length = 20)
    private String courseStatus; // OPEN, CLOSED, CANCELLED

    @PrePersist
    protected void onCreate() {
        if (currentStudents == null) currentStudents = 0;
        if (courseStatus == null) courseStatus = "OPEN";
    }
}
