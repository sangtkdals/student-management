package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.AcademicSchedule;
import com.example.studentmanagement.repository.AcademicScheduleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        List<AcademicSchedule> schedules = academicScheduleRepository.findAll();
        return ResponseEntity.ok(schedules);
    }
}
