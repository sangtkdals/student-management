package com.example.studentmanagement.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "materials")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    private Integer materialId;

    @ManyToOne
    @JoinColumn(name = "course_code", nullable = false)
    private Course course;

    @Column(name = "filename", length = 500)
    private String filename;

    @Column(name = "filepath", length = 1000)
    private String filepath;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}
