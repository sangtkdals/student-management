package com.example.studentmanagement.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "subject")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    @Id
    @Column(name = "s_code", length = 20)
    private String sCode;

    @Column(name = "s_name", length = 200)
    private String sName;

    @Column(name = "credit")
    private Integer credit;

    @Column(name = "s_type")
    private Integer sType;

    @ManyToOne
    @JoinColumn(name = "dept_code")
    private Department department;

    @Column(name = "s_desc", length = 2000)
    private String sDesc;
}
