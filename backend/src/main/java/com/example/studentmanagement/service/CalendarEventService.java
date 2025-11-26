package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.CalendarEvent;
import com.example.studentmanagement.repository.CalendarEventRepository;
import com.example.studentmanagement.dto.CalendarEventRequest;
import com.example.studentmanagement.dto.CalendarEventResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;

    public CalendarEventService(CalendarEventRepository calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }

    public CalendarEventResponse createEvent(CalendarEventRequest request) {
        CalendarEvent event = new CalendarEvent();
        event.setAcademicYear(request.getAcademicYear());
        event.setSemester(request.getSemester());
        event.setScheduleTitle(request.getScheduleTitle());
        event.setScheduleContent(request.getScheduleContent());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setBackgroundColor(request.getBackgroundColor());
        event.setRecurrenceType(request.getRecurrenceType());

        return CalendarEventResponse.fromEntity(calendarEventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getAllEvents() {
        return calendarEventRepository.findAllByOrderByStartDateAsc()
                .stream().map(CalendarEventResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CalendarEventResponse getEventById(Integer scheduleId) {
        CalendarEvent event = calendarEventRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        return CalendarEventResponse.fromEntity(event);
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getEventsByYear(Integer academicYear) {
        return calendarEventRepository.findByAcademicYear(academicYear)
                .stream().map(CalendarEventResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getEventsByYearAndSemester(Integer academicYear, Integer semester) {
        return calendarEventRepository.findByAcademicYearAndSemester(academicYear, semester)
                .stream().map(CalendarEventResponse::fromEntity).collect(Collectors.toList());
    }

    public CalendarEventResponse updateEvent(Integer scheduleId, CalendarEventRequest request) {
        CalendarEvent event = calendarEventRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));

        if (request.getAcademicYear() != null) event.setAcademicYear(request.getAcademicYear());
        if (request.getSemester() != null) event.setSemester(request.getSemester());
        if (request.getScheduleTitle() != null) event.setScheduleTitle(request.getScheduleTitle());
        if (request.getScheduleContent() != null) event.setScheduleContent(request.getScheduleContent());
        if (request.getStartDate() != null) event.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) event.setEndDate(request.getEndDate());
        if (request.getBackgroundColor() != null) event.setBackgroundColor(request.getBackgroundColor());
        if (request.getRecurrenceType() != null) event.setRecurrenceType(request.getRecurrenceType());

        return CalendarEventResponse.fromEntity(calendarEventRepository.save(event));
    }

    public void deleteEvent(Integer scheduleId) {
        calendarEventRepository.deleteById(scheduleId);
    }
}
