package com.example.studentmanagement.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "enrollment")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Integer enrollmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stu_no", referencedColumnName = "m_no")
    @JsonIgnoreProperties({"courses", "enrollments", "password"})
    private Member student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_code")
    @JsonIgnoreProperties({"enrollments"})
    private Course course;

    @Column(name = "enrollment_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date enrollmentDate;

    @Column(name = "enrollment_status", length = 20)
    private String enrollmentStatus;

    @Column(name = "cancel_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date cancelDate;
}
