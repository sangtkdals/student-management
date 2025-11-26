package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Grade;
import com.example.studentmanagement.repository.GradeRepository;
import com.example.studentmanagement.dto.GradeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    public List<GradeResponse> getAllGrades() {
        return gradeRepository.findAll().stream()
                .map(GradeResponse::from)
                .collect(Collectors.toList());
    }

    public Optional<GradeResponse> getGradeByEnrollmentId(Integer enrollmentId) {
        return gradeRepository.findByEnrollmentId(enrollmentId)
                .map(GradeResponse::from);
    }
}
