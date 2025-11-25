package com.example.studentmanagement;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "academic_schedule")
@Getter
@Setter
@NoArgsConstructor
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "semester")
    private Integer semester; // 1, 2, 0(전체)

    @Column(name = "schedule_title", length = 200)
    private String scheduleTitle;

    @Column(name = "schedule_content", length = 1000)
    private String scheduleContent;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "background_color", length = 20)
    private String backgroundColor;

    @Column(name = "recurrence_type", length = 20)
    private String recurrenceType; // NONE, DAILY, WEEKLY, MONTHLY, YEARLY
}
