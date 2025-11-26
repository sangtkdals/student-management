package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TuitionRequest {
    private String stuNo;
    private Integer academicYear;
    private Integer semester;
    private Integer tuitionAmount;
    private Integer scholarshipAmount;
    private Integer paidAmount;
    private LocalDate billDate;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private String paymentMethod;
    private String receiptNo;
}
