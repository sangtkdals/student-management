package com.example.studentmanagement.dto;

import com.example.studentmanagement.CalendarEvent;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class CalendarEventResponse {
    private Integer scheduleId;
    private Integer academicYear;
    private Integer semester;
    private String scheduleTitle;
    private String scheduleContent;
    private LocalDate startDate;
    private LocalDate endDate;
    private String backgroundColor;
    private String recurrenceType;

    public static CalendarEventResponse fromEntity(CalendarEvent event) {
        return CalendarEventResponse.builder()
                .scheduleId(event.getScheduleId())
                .academicYear(event.getAcademicYear())
                .semester(event.getSemester())
                .scheduleTitle(event.getScheduleTitle())
                .scheduleContent(event.getScheduleContent())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .backgroundColor(event.getBackgroundColor())
                .recurrenceType(event.getRecurrenceType())
                .build();
    }
}
