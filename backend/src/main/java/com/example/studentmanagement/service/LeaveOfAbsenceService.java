package com.example.studentmanagement.service;

import com.example.studentmanagement.LeaveOfAbsence;
import com.example.studentmanagement.LeaveOfAbsenceRepository;
import com.example.studentmanagement.dto.LeaveOfAbsenceRequest;
import com.example.studentmanagement.dto.LeaveOfAbsenceResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeaveOfAbsenceService {

    private final LeaveOfAbsenceRepository leaveOfAbsenceRepository;

    public LeaveOfAbsenceService(LeaveOfAbsenceRepository leaveOfAbsenceRepository) {
        this.leaveOfAbsenceRepository = leaveOfAbsenceRepository;
    }

    /**
     * 휴학/복학 신청 생성
     */
    public LeaveOfAbsenceResponse createApplication(Long studentId, LeaveOfAbsenceRequest request) {
        LeaveOfAbsence leaveOfAbsence = new LeaveOfAbsence();
        leaveOfAbsence.setStudentId(studentId);
        leaveOfAbsence.setType(request.getType());
        leaveOfAbsence.setCategory(request.getCategory());
        leaveOfAbsence.setYear(request.getYear());
        leaveOfAbsence.setSemester(request.getSemester());
        leaveOfAbsence.setReason(request.getReason());
        leaveOfAbsence.setContactNumber(request.getContactNumber());
        leaveOfAbsence.setAddress(request.getAddress());
        leaveOfAbsence.setDocuments(request.getDocuments());

        LeaveOfAbsence saved = leaveOfAbsenceRepository.save(leaveOfAbsence);
        return LeaveOfAbsenceResponse.fromEntity(saved);
    }

    /**
     * 특정 학생의 모든 신청 내역 조회
     */
    @Transactional(readOnly = true)
    public List<LeaveOfAbsenceResponse> getAllApplicationsByStudent(Long studentId) {
        List<LeaveOfAbsence> applications = leaveOfAbsenceRepository.findByStudentIdOrderByApplicationDateDesc(studentId);
        return applications.stream()
                .map(LeaveOfAbsenceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 특정 학생의 특정 타입 신청 내역 조회 (휴학 또는 복학)
     */
    @Transactional(readOnly = true)
    public List<LeaveOfAbsenceResponse> getApplicationsByStudentAndType(Long studentId, String type) {
        List<LeaveOfAbsence> applications = leaveOfAbsenceRepository.findByStudentIdAndTypeOrderByApplicationDateDesc(studentId, type);
        return applications.stream()
                .map(LeaveOfAbsenceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 특정 신청 내역 상세 조회
     */
    @Transactional(readOnly = true)
    public LeaveOfAbsenceResponse getApplicationById(Long id) {
        LeaveOfAbsence application = leaveOfAbsenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));
        return LeaveOfAbsenceResponse.fromEntity(application);
    }

    /**
     * 신청 상태 업데이트 (관리자용 - 승인/거절 처리)
     */
    public LeaveOfAbsenceResponse updateApplicationStatus(Long id, String status, String rejectReason) {
        LeaveOfAbsence application = leaveOfAbsenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));

        application.setStatus(status);
        if ("거절".equals(status) && rejectReason != null) {
            application.setRejectReason(rejectReason);
        }

        LeaveOfAbsence updated = leaveOfAbsenceRepository.save(application);
        return LeaveOfAbsenceResponse.fromEntity(updated);
    }

    /**
     * 신청 취소 (학생이 신청완료 상태일 때만 가능)
     */
    public void cancelApplication(Long id, Long studentId) {
        LeaveOfAbsence application = leaveOfAbsenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));

        // 본인의 신청인지 확인
        if (!application.getStudentId().equals(studentId)) {
            throw new RuntimeException("본인의 신청만 취소할 수 있습니다.");
        }

        // 신청완료 상태일 때만 취소 가능
        if (!"신청완료".equals(application.getStatus())) {
            throw new RuntimeException("신청완료 상태일 때만 취소할 수 있습니다.");
        }

        leaveOfAbsenceRepository.delete(application);
    }
}
