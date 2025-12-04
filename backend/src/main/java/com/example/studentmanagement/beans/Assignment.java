package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "assignment")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer assignmentId;

    @Column(name = "course_code", nullable = false)
    private String courseCode;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", length = 2000)
    private String content;

    @Column(name = "deadline")
    @Temporal(TemporalType.TIMESTAMP)
    private Date deadline;

    @Column(name = "max_score")
    private Integer maxScore;
    
    // We might want to link to Course entity directly, but courseCode string is sufficient for simple mapping
    // If we want join fetch, we need ManyToOne. For now, keep it simple as user didn't ask for complex joins yet.
    // Actually, ManyToOne is better for integrity.
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_code", insertable = false, updatable = false)
    private Course course;
}
