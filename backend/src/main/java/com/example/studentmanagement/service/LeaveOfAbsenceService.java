package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.LeaveOfAbsence;
import com.example.studentmanagement.repository.LeaveOfAbsenceRepository;
import com.example.studentmanagement.dto.LeaveOfAbsenceRequest;
import com.example.studentmanagement.dto.LeaveOfAbsenceResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeaveOfAbsenceService {

    private final LeaveOfAbsenceRepository leaveRepository;

    public LeaveOfAbsenceService(LeaveOfAbsenceRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    public LeaveOfAbsenceResponse createApplication(LeaveOfAbsenceRequest request) {
        LeaveOfAbsence leave = new LeaveOfAbsence();
        leave.setStuNo(request.getStuNo());
        leave.setLeaveType(request.getLeaveType());
        leave.setStartYear(request.getStartYear());
        leave.setStartSemester(request.getStartSemester());
        leave.setEndYear(request.getEndYear());
        leave.setEndSemester(request.getEndSemester());
        leave.setApplicationReason(request.getApplicationReason());
        leave.setApplicationDate(request.getApplicationDate() != null ? request.getApplicationDate() : LocalDateTime.now());
        leave.setApprovalStatus("PENDING");

        return LeaveOfAbsenceResponse.fromEntity(leaveRepository.save(leave));
    }

    @Transactional(readOnly = true)
    public List<LeaveOfAbsenceResponse> getAllApplications() {
        return leaveRepository.findAllByOrderByApplicationDateDesc()
                .stream().map(LeaveOfAbsenceResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveOfAbsenceResponse getApplicationById(Integer applicationId) {
        LeaveOfAbsence leave = leaveRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("신청을 찾을 수 없습니다."));
        return LeaveOfAbsenceResponse.fromEntity(leave);
    }

    @Transactional(readOnly = true)
    public List<LeaveOfAbsenceResponse> getApplicationsByStuNo(String stuNo) {
        return leaveRepository.findByStuNoOrderByApplicationDateDesc(stuNo)
                .stream().map(LeaveOfAbsenceResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveOfAbsenceResponse> getApplicationsByStatus(String approvalStatus) {
        return leaveRepository.findByApprovalStatusOrderByApplicationDateDesc(approvalStatus)
                .stream().map(LeaveOfAbsenceResponse::fromEntity).collect(Collectors.toList());
    }

    public LeaveOfAbsenceResponse updateApplicationStatus(Integer applicationId, String approvalStatus, String approverId, String rejectReason) {
        LeaveOfAbsence leave = leaveRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("신청을 찾을 수 없습니다."));

        leave.setApprovalStatus(approvalStatus);
        leave.setApprovalDate(LocalDateTime.now());
        leave.setApproverId(approverId);
        if (rejectReason != null) {
            leave.setRejectReason(rejectReason);
        }

        return LeaveOfAbsenceResponse.fromEntity(leaveRepository.save(leave));
    }

    public void cancelApplication(Integer applicationId) {
        leaveRepository.deleteById(applicationId);
    }
}
