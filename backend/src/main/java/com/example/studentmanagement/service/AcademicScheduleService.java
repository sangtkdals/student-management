package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.AcademicSchedule;
import com.example.studentmanagement.repository.AcademicScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AcademicScheduleService {
    
    @Autowired
    private AcademicScheduleRepository repository;
    
    // 전체 조회
    public List<AcademicSchedule> getAllSchedules() {
        return repository.findAll();
    }
    
    // 생성
    public AcademicSchedule createSchedule(AcademicSchedule schedule) {
        return repository.save(schedule);
    }
    
    // 수정
    public AcademicSchedule updateSchedule(Integer id, AcademicSchedule schedule) {
        schedule.setScheduleId(id);
        return repository.save(schedule);
    }
    
    // 삭제
    public void deleteSchedule(Integer id) {
        repository.deleteById(id);
    }
}