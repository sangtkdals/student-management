package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "attendance")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Integer attendanceId;

    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    @Column(name = "attendance_date")
    @Temporal(TemporalType.DATE)
    private Date attendanceDate;

    @Column(name = "period")
    private Integer period;

    @Column(name = "attendance_status", length = 20)
    private String attendanceStatus;

    @Column(name = "remark", length = 500)
    private String remark;
}
