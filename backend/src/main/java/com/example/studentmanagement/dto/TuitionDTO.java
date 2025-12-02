package com.example.studentmanagement.dto;

import com.example.studentmanagement.beans.Tuition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TuitionDTO {
    private Integer tuitionId;
    private String studentNo;
    private String studentName;
    private Integer academicYear;
    private Integer semester;
    private Integer tuitionAmount;
    private Integer scholarshipAmount;
    private Integer paidAmount;
    private Date billDate;
    private Date dueDate;
    private Date paidDate;
    private String paymentMethod;
    private String receiptNo;
    private String paymentStatus;

    // Entity -> DTO 변환 생성자
    public TuitionDTO(Tuition tuition, String studentName) {
        this.tuitionId = tuition.getTuitionId();
        this.studentNo = tuition.getStudent() != null ? tuition.getStudent().getMemberNo() : null;
        this.studentName = studentName;
        this.academicYear = tuition.getAcademicYear();
        this.semester = tuition.getSemester();
        this.tuitionAmount = tuition.getTuitionAmount();
        this.scholarshipAmount = tuition.getScholarshipAmount();
        this.paidAmount = tuition.getPaidAmount();
        this.billDate = tuition.getBillDate();
        this.dueDate = tuition.getDueDate();
        this.paidDate = tuition.getPaidDate();
        this.paymentMethod = tuition.getPaymentMethod();
        this.receiptNo = tuition.getReceiptNo();
        this.paymentStatus = tuition.getPaymentStatus();
    }
}
