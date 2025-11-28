package com.example.studentmanagement.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "course")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @Column(name = "course_code", length = 20)
    private String courseCode;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "semester")
    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "s_code")
    private Subject subject;

    @Column(name = "course_class", length = 10)
    private String courseClass;

    @ManyToOne
    @JoinColumn(name = "professor_no", referencedColumnName = "m_no")
    private Member professor;

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
    private String courseStatus;

    @Column(name = "ratio_mid")
    private Integer ratioMid;

    @Column(name = "ratio_final")
    private Integer ratioFinal;

    @Column(name = "ratio_assign")
    private Integer ratioAssign;

    @Column(name = "ratio_attend")
    private Integer ratioAttend;
}
