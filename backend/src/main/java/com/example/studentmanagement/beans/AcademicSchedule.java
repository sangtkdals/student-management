package com.example.studentmanagement.beans;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "academic_schedule")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcademicSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "schedule_title", length = 200)
    private String scheduleTitle;

    @Column(name = "schedule_content", length = 1000)
    private String scheduleContent;

    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Column(name = "background_color", length = 20)
    private String backgroundColor;

    @Column(name = "recurrence_type", length = 20)
    private String recurrenceType;
}
