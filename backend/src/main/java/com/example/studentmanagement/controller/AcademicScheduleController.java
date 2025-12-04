package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.AcademicSchedule;
import com.example.studentmanagement.repository.AcademicScheduleRepository;
import org.springframework.http.ResponseEntity;
import com.example.studentmanagement.beans.AcademicSchedule;
import com.example.studentmanagement.repository.AcademicScheduleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class AcademicScheduleController {

    private final AcademicScheduleRepository academicScheduleRepository;

    public AcademicScheduleController(AcademicScheduleRepository academicScheduleRepository) {
        this.academicScheduleRepository = academicScheduleRepository;
    }

    @GetMapping
    public ResponseEntity<List<AcademicSchedule>> getAllSchedules() {
        return ResponseEntity.ok(academicScheduleRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<AcademicSchedule> createSchedule(@RequestBody AcademicSchedule schedule) {
        AcademicSchedule savedSchedule = academicScheduleRepository.save(schedule);
        return ResponseEntity.ok(savedSchedule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicSchedule> updateSchedule(@PathVariable Integer id, @RequestBody AcademicSchedule scheduleDetails) {
        return academicScheduleRepository.findById(id)
                .map(schedule -> {
                    schedule.setScheduleTitle(scheduleDetails.getScheduleTitle());
                    schedule.setStartDate(scheduleDetails.getStartDate());
                    schedule.setEndDate(scheduleDetails.getEndDate());
                    schedule.setCategory(scheduleDetails.getCategory());
                    schedule.setScheduleContent(scheduleDetails.getScheduleContent());
                    AcademicSchedule updatedSchedule = academicScheduleRepository.save(schedule);
                    return ResponseEntity.ok(updatedSchedule);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Integer id) {
        return academicScheduleRepository.findById(id)
                .map(schedule -> {
                    academicScheduleRepository.delete(schedule);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
