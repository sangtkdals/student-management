package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_member")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentMember extends Member {
    
    @Column(name = "stu_grade")
    private Integer stuGrade;

    @Column(name = "enrollment_status", length = 20)
    private String enrollmentStatus;
}
