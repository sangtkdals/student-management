package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.AcademicSchedule;
import com.example.studentmanagement.service.AcademicScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicScheduleController {
    
    @Autowired
    private AcademicScheduleService service;
    
    // 전체 조회
    @GetMapping
    public List<AcademicSchedule> getAllSchedules() {
        return service.getAllSchedules();
    }
    
    // 생성
    @PostMapping
    public AcademicSchedule createSchedule(@RequestBody AcademicSchedule schedule) {
        return service.createSchedule(schedule);
    }
    
    // 수정
    @PutMapping("/{id}")
    public AcademicSchedule updateSchedule(@PathVariable Integer id, @RequestBody AcademicSchedule schedule) {
        return service.updateSchedule(id, schedule);
    }
    
    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Integer id) {
        service.deleteSchedule(id);
        return ResponseEntity.ok().build();
    }
}