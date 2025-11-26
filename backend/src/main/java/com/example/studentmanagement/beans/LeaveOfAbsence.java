package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "leave_application")
@Getter
@Setter
@NoArgsConstructor
public class LeaveOfAbsence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Integer applicationId;

    @Column(name = "stu_no", length = 20)
    private String stuNo;

    @Column(name = "leave_type", length = 20)
    private String leaveType; // GENERAL, MILITARY, ILLNESS, PREGNANCY

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "start_semester")
    private Integer startSemester;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(name = "end_semester")
    private Integer endSemester;

    @Column(name = "application_reason", length = 1000)
    private String applicationReason;

    @Column(name = "application_date")
    private LocalDateTime applicationDate;

    @Column(name = "approval_status", length = 20)
    private String approvalStatus; // PENDING, APPROVED, REJECTED

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "approver_id", length = 50)
    private String approverId;

    @Column(name = "reject_reason", length = 1000)
    private String rejectReason;

    @PrePersist
    protected void onCreate() {
        if (applicationDate == null) {
            applicationDate = LocalDateTime.now();
        }
        if (approvalStatus == null) {
            approvalStatus = "PENDING";
        }
    }
}
