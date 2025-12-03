package com.example.studentmanagement.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "s_code")
    private Subject subject;

    @Column(name = "course_class", length = 10)
    private String courseClass;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "professor_no", referencedColumnName = "m_no")
    private Member professor;

    @Column(name = "max_stu")
    private Integer maxStu;

    @Column(name = "classroom", length = 50)
    private String classroom;

    @OneToMany(mappedBy = "course", fetch = FetchType.EAGER, cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CourseSchedule> courseSchedules;

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
}
