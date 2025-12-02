package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Grade;
import com.example.studentmanagement.dto.StudentGradeDTO;
import com.example.studentmanagement.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    public void updateGrades(List<StudentGradeDTO> gradeDTOs) {
        for (StudentGradeDTO dto : gradeDTOs) {
            if (dto.getGradeId() == null) continue;

            Grade grade = gradeRepository.findById(dto.getGradeId().intValue())
                    .orElseThrow(() -> new RuntimeException("성적 정보를 찾을 수 없습니다. ID: " + dto.getGradeId()));

            double mid = dto.getMidtermScore() != null ? dto.getMidtermScore() : 0.0;
            double fin = dto.getFinalScore() != null ? dto.getFinalScore() : 0.0;
            double assign = dto.getAssignmentScore() != null ? dto.getAssignmentScore() : 0.0;
            double attend = dto.getAttendanceScore() != null ? dto.getAttendanceScore() : 0.0;

            grade.setMidtermScore(BigDecimal.valueOf(mid));
            grade.setFinalScore(BigDecimal.valueOf(fin));
            grade.setAssignmentScore(BigDecimal.valueOf(assign));
            grade.setAttendanceScore(BigDecimal.valueOf(attend));

            double total = (mid * 0.3) + (fin * 0.4) + (assign * 0.2) + (attend * 0.1);
            grade.setTotalScore(BigDecimal.valueOf(total));

            calculateAndSetGrade(grade, total);

            gradeRepository.save(grade);
        }
    }

    private void calculateAndSetGrade(Grade grade, double total) {
        if (total >= 95) { grade.setGradeLetter("A+"); grade.setGradePoint(BigDecimal.valueOf(4.5)); }
        else if (total >= 90) { grade.setGradeLetter("A0"); grade.setGradePoint(BigDecimal.valueOf(4.0)); }
        else if (total >= 85) { grade.setGradeLetter("B+"); grade.setGradePoint(BigDecimal.valueOf(3.5)); }
        else if (total >= 80) { grade.setGradeLetter("B0"); grade.setGradePoint(BigDecimal.valueOf(3.0)); }
        else if (total >= 75) { grade.setGradeLetter("C+"); grade.setGradePoint(BigDecimal.valueOf(2.5)); }
        else if (total >= 70) { grade.setGradeLetter("C0"); grade.setGradePoint(BigDecimal.valueOf(2.0)); }
        else if (total >= 65) { grade.setGradeLetter("D+"); grade.setGradePoint(BigDecimal.valueOf(1.5)); }
        else if (total >= 60) { grade.setGradeLetter("D0"); grade.setGradePoint(BigDecimal.valueOf(1.0)); }
        else { grade.setGradeLetter("F"); grade.setGradePoint(BigDecimal.valueOf(0.0)); }
    }
}