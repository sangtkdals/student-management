package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Course;
import com.example.studentmanagement.beans.Enrollment;
import com.example.studentmanagement.beans.Grade;
import com.example.studentmanagement.dto.GradeUpdateRequest;
import com.example.studentmanagement.repository.EnrollmentRepository;
import com.example.studentmanagement.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Transactional
    public void updateStudentGrade(GradeUpdateRequest request) {
        Grade grade = gradeRepository.findByEnrollmentId(request.getEnrollmentId());
        
        Integer enrollId = request.getEnrollmentId().intValue();
        Enrollment enrollment = enrollmentRepository.findById(enrollId)
                .orElseThrow(() -> new RuntimeException("수강신청 정보를 찾을 수 없습니다. ID: " + enrollId));

        if (grade == null) {
            grade = new Grade();
            grade.setEnrollment(enrollment);
        }

        Course course = enrollment.getCourse(); 
        
        if (course == null) {
             throw new RuntimeException("수강신청 정보에 연결된 강의가 없습니다.");
        }

        BigDecimal mid = request.getMidtermScore() != null ? BigDecimal.valueOf(request.getMidtermScore()) : BigDecimal.ZERO;
        BigDecimal fin = request.getFinalScore() != null ? BigDecimal.valueOf(request.getFinalScore()) : BigDecimal.ZERO;
        BigDecimal assign = request.getAssignmentScore() != null ? BigDecimal.valueOf(request.getAssignmentScore()) : BigDecimal.ZERO;
        BigDecimal attend = request.getAttendanceScore() != null ? BigDecimal.valueOf(request.getAttendanceScore()) : BigDecimal.ZERO;

        grade.setMidtermScore(mid);
        grade.setFinalScore(fin);
        grade.setAssignmentScore(assign);
        grade.setAttendanceScore(attend);

        double rMid = (course.getRatioMid() != null ? course.getRatioMid() : 0) / 100.0;
        double rFin = (course.getRatioFinal() != null ? course.getRatioFinal() : 0) / 100.0;
        double rAssign = (course.getRatioAssign() != null ? course.getRatioAssign() : 0) / 100.0;
        double rAttend = (course.getRatioAttend() != null ? course.getRatioAttend() : 0) / 100.0;

        double totalVal = (mid.doubleValue() * rMid) + (fin.doubleValue() * rFin) + 
                          (assign.doubleValue() * rAssign) + (attend.doubleValue() * rAttend);
        
        totalVal = Math.round(totalVal * 100.0) / 100.0;
        
        grade.setTotalScore(BigDecimal.valueOf(totalVal));

        if (totalVal >= 95) { grade.setGradeLetter("A+"); grade.setGradePoint(BigDecimal.valueOf(4.5)); }
        else if (totalVal >= 90) { grade.setGradeLetter("A0"); grade.setGradePoint(BigDecimal.valueOf(4.0)); }
        else if (totalVal >= 85) { grade.setGradeLetter("B+"); grade.setGradePoint(BigDecimal.valueOf(3.5)); }
        else if (totalVal >= 80) { grade.setGradeLetter("B0"); grade.setGradePoint(BigDecimal.valueOf(3.0)); }
        else if (totalVal >= 75) { grade.setGradeLetter("C+"); grade.setGradePoint(BigDecimal.valueOf(2.5)); }
        else if (totalVal >= 70) { grade.setGradeLetter("C0"); grade.setGradePoint(BigDecimal.valueOf(2.0)); }
        else if (totalVal >= 60) { grade.setGradeLetter("D"); grade.setGradePoint(BigDecimal.valueOf(1.0)); }
        else { grade.setGradeLetter("F"); grade.setGradePoint(BigDecimal.ZERO); }

        gradeRepository.save(grade);
    }
}