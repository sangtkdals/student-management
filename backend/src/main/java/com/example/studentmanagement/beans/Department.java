package com.example.studentmanagement.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "department")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    @Id
    @Column(name = "dept_code", length = 20)
    private String deptCode;

    @Column(name = "dept_name", length = 100)
    private String deptName;

    @Column(name = "college_name", length = 100)
    private String collegeName;

    @Column(name = "dept_phone", length = 20)
    private String deptPhone;

    @Column(name = "dept_office", length = 100)
    private String deptOffice;
}
