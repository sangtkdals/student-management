package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "grade")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id")
    private Integer gradeId;

    @OneToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    @Column(name = "midterm_score", precision = 5, scale = 2)
    private BigDecimal midtermScore;

    @Column(name = "final_score", precision = 5, scale = 2)
    private BigDecimal finalScore;

    @Column(name = "assignment_score", precision = 5, scale = 2)
    private BigDecimal assignmentScore;

    @Column(name = "attendance_score", precision = 5, scale = 2)
    private BigDecimal attendanceScore;

    @Column(name = "presentation_score", precision = 5, scale = 2)
    private BigDecimal presentationScore;

    @Column(name = "total_score", precision = 5, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "grade_letter", length = 2)
    private String gradeLetter;

    @Column(name = "grade_point", precision = 3, scale = 2)
    private BigDecimal gradePoint;
}
