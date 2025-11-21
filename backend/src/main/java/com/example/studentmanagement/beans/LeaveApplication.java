package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "leave_application")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Integer applicationId;

    @ManyToOne
    @JoinColumn(name = "stu_no", referencedColumnName = "m_no")
    private Member student;

    @Column(name = "leave_type", length = 20)
    private String leaveType;

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
    @Temporal(TemporalType.TIMESTAMP)
    private Date applicationDate;

    @Column(name = "approval_status", length = 20)
    private String approvalStatus;

    @Column(name = "approval_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date approvalDate;

    @ManyToOne
    @JoinColumn(name = "approver_id", referencedColumnName = "m_no")
    private Member approver;

    @Column(name = "reject_reason", length = 1000)
    private String rejectReason;
}
