package com.example.studentmanagement;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "tuition")
@Getter
@Setter
@NoArgsConstructor
public class Tuition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tuition_id")
    private Integer tuitionId;

    @Column(name = "stu_no", length = 20)
    private String stuNo;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "tuition_amount")
    private Integer tuitionAmount;

    @Column(name = "scholarship_amount")
    private Integer scholarshipAmount;

    @Column(name = "paid_amount")
    private Integer paidAmount;

    @Column(name = "bill_date")
    private LocalDate billDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "receipt_no", unique = true, length = 50)
    private String receiptNo;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus; // UNPAID, PAID, OVERDUE

    @PrePersist
    protected void onCreate() {
        updatePaymentStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        updatePaymentStatus();
    }

    private void updatePaymentStatus() {
        if (paidAmount == null) paidAmount = 0;
        int totalDue = (tuitionAmount != null ? tuitionAmount : 0)
                     - (scholarshipAmount != null ? scholarshipAmount : 0);

        if (paidAmount >= totalDue && totalDue > 0) {
            paymentStatus = "PAID";
        } else if (paidAmount == 0) {
            paymentStatus = "UNPAID";
        } else {
            paymentStatus = "UNPAID";
        }
    }
}
