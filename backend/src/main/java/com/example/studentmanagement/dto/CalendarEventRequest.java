package com.example.studentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CalendarEventRequest {
    private Integer academicYear;
    private Integer semester;
    private String scheduleTitle;
    private String scheduleContent;
    private LocalDate startDate;
    private LocalDate endDate;
    private String backgroundColor;
    private String recurrenceType;
}
