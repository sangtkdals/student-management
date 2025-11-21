package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "tuition")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tuition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tuition_id")
    private Integer tuitionId;

    @ManyToOne
    @JoinColumn(name = "stu_no", referencedColumnName = "m_no")
    private Member student;

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
    @Temporal(TemporalType.DATE)
    private Date billDate;

    @Column(name = "due_date")
    @Temporal(TemporalType.DATE)
    private Date dueDate;

    @Column(name = "paid_date")
    @Temporal(TemporalType.DATE)
    private Date paidDate;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "receipt_no", length = 50, unique = true)
    private String receiptNo;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus;
}
