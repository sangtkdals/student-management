package com.example.studentmanagement;

import com.example.studentmanagement.dto.CalendarEventRequest;
import com.example.studentmanagement.dto.CalendarEventResponse;
import com.example.studentmanagement.service.CalendarEventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar-events")
@CrossOrigin(origins = "*")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @PostMapping
    public ResponseEntity<CalendarEventResponse> createEvent(@RequestBody CalendarEventRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(calendarEventService.createEvent(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CalendarEventResponse>> getAllEvents() {
        return ResponseEntity.ok(calendarEventService.getAllEvents());
    }

    @GetMapping("/{scheduleId}")
    public ResponseEntity<CalendarEventResponse> getEventById(@PathVariable Integer scheduleId) {
        try {
            return ResponseEntity.ok(calendarEventService.getEventById(scheduleId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<List<CalendarEventResponse>> getEventsByYear(@PathVariable Integer year) {
        return ResponseEntity.ok(calendarEventService.getEventsByYear(year));
    }

    @GetMapping("/year/{year}/semester/{semester}")
    public ResponseEntity<List<CalendarEventResponse>> getEventsByYearAndSemester(
            @PathVariable Integer year, @PathVariable Integer semester) {
        return ResponseEntity.ok(calendarEventService.getEventsByYearAndSemester(year, semester));
    }

    @PutMapping("/{scheduleId}")
    public ResponseEntity<CalendarEventResponse> updateEvent(
            @PathVariable Integer scheduleId, @RequestBody CalendarEventRequest request) {
        try {
            return ResponseEntity.ok(calendarEventService.updateEvent(scheduleId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer scheduleId) {
        try {
            calendarEventService.deleteEvent(scheduleId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
