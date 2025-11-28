package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "course_evaluation")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id")
    private Integer evaluationId;

    @ManyToOne
    @JoinColumn(name = "course_code")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "stu_no", referencedColumnName = "m_no")
    private Member student;

    @Column(name = "eval1")
    private Integer eval1;

    @Column(name = "eval2")
    private Integer eval2;

    @Column(name = "eval3")
    private Integer eval3;

    @Column(name = "eval4")
    private Integer eval4;

    @Column(name = "eval5")
    private Integer eval5;

    @Column(name = "total_score", precision = 3, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "comment", length = 2000)
    private String comment;

    @Column(name = "evaluation_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date evaluationDate;
}
