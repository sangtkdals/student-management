package com.example.studentmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "department") // 실제 DB 테이블 이름 명시
@Getter
@Setter
public class Department {

    @Id
    @Column(name = "dept_code")
    private String deptCode;

    @Column(name = "dept_name")
    private String deptName;

    @Column(name = "college_name")
    private String collegeName;

    @Column(name = "dept_phone")
    private String deptPhone;

    @Column(name = "dept_office")
    private String deptOffice;
}