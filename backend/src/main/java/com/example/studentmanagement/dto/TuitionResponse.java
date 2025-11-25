package com.example.studentmanagement.dto;

import com.example.studentmanagement.Tuition;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class TuitionResponse {
    private Integer tuitionId;
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
    private String paymentStatus;

    public static TuitionResponse fromEntity(Tuition tuition) {
        return TuitionResponse.builder()
                .tuitionId(tuition.getTuitionId())
                .stuNo(tuition.getStuNo())
                .academicYear(tuition.getAcademicYear())
                .semester(tuition.getSemester())
                .tuitionAmount(tuition.getTuitionAmount())
                .scholarshipAmount(tuition.getScholarshipAmount())
                .paidAmount(tuition.getPaidAmount())
                .billDate(tuition.getBillDate())
                .dueDate(tuition.getDueDate())
                .paidDate(tuition.getPaidDate())
                .paymentMethod(tuition.getPaymentMethod())
                .receiptNo(tuition.getReceiptNo())
                .paymentStatus(tuition.getPaymentStatus())
                .build();
    }
}
