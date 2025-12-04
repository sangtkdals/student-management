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

    @Column(name = "assignment_title", nullable = false)
    private String assignmentTitle;

    @Column(name = "assignment_desc", columnDefinition = "TEXT")
    private String assignmentDesc;

    @Column(name = "attachment_path")
    private String attachmentPath;

    @Column(name = "registration_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date registrationDate;

    @Column(name = "due_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dueDate;
    
    // We might want to link to Course entity directly, but courseCode string is sufficient for simple mapping
    // If we want join fetch, we need ManyToOne. For now, keep it simple as user didn't ask for complex joins yet.
    // Actually, ManyToOne is better for integrity.
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_code", insertable = false, updatable = false)
    private Course course;
}
