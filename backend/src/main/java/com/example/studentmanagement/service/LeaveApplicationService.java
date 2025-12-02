package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.LeaveApplication;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.dto.LeaveApplicationDTO;
import com.example.studentmanagement.repository.LeaveApplicationRepository;
import com.example.studentmanagement.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveApplicationService {

    private final LeaveApplicationRepository leaveApplicationRepository;
    private final MemberRepository memberRepository;

    public LeaveApplicationService(LeaveApplicationRepository leaveApplicationRepository, MemberRepository memberRepository) {
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.memberRepository = memberRepository;
    }

    // 모든 휴학 신청 조회
    public List<LeaveApplicationDTO> getAllApplications() {
        List<LeaveApplication> applications = leaveApplicationRepository.findAll();
        return applications.stream()
                .map(app -> new LeaveApplicationDTO(app, getStudentName(app), getApproverName(app)))
                .collect(Collectors.toList());
    }

    // ID로 조회
    public LeaveApplicationDTO getApplicationById(Integer applicationId) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));
        return new LeaveApplicationDTO(application, getStudentName(application), getApproverName(application));
    }

    // 학생별 조회
    public List<LeaveApplicationDTO> getApplicationsByStudent(String studentNo) {
        List<LeaveApplication> applications = leaveApplicationRepository.findByStudent_MemberNo(studentNo);
        return applications.stream()
                .map(app -> new LeaveApplicationDTO(app, getStudentName(app), getApproverName(app)))
                .collect(Collectors.toList());
    }

    // 승인 상태별 조회
    public List<LeaveApplicationDTO> getApplicationsByStatus(String status) {
        List<LeaveApplication> applications = leaveApplicationRepository.findByApprovalStatus(status);
        return applications.stream()
                .map(app -> new LeaveApplicationDTO(app, getStudentName(app), getApproverName(app)))
                .collect(Collectors.toList());
    }

    // 승인 대기 중인 신청 조회
    public List<LeaveApplicationDTO> getPendingApplications() {
        List<LeaveApplication> applications = leaveApplicationRepository.findPendingApplications();
        return applications.stream()
                .map(app -> new LeaveApplicationDTO(app, getStudentName(app), getApproverName(app)))
                .collect(Collectors.toList());
    }

    // 승인된 신청 조회
    public List<LeaveApplicationDTO> getApprovedApplications() {
        List<LeaveApplication> applications = leaveApplicationRepository.findApprovedApplications();
        return applications.stream()
                .map(app -> new LeaveApplicationDTO(app, getStudentName(app), getApproverName(app)))
                .collect(Collectors.toList());
    }

    // 거절된 신청 조회
    public List<LeaveApplicationDTO> getRejectedApplications() {
        List<LeaveApplication> applications = leaveApplicationRepository.findRejectedApplications();
        return applications.stream()
                .map(app -> new LeaveApplicationDTO(app, getStudentName(app), getApproverName(app)))
                .collect(Collectors.toList());
    }

    // 휴학 신청 생성
    @Transactional
    public LeaveApplicationDTO createApplication(LeaveApplicationDTO dto) {
        Member student = memberRepository.findByMemberNo(dto.getStudentNo())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with number: " + dto.getStudentNo()));

        LeaveApplication application = new LeaveApplication();
        application.setStudent(student);
        application.setLeaveType(dto.getLeaveType());
        application.setStartYear(dto.getStartYear());
        application.setStartSemester(dto.getStartSemester());
        application.setEndYear(dto.getEndYear());
        application.setEndSemester(dto.getEndSemester());
        application.setApplicationReason(dto.getApplicationReason());
        application.setApplicationDate(new Date());
        application.setApprovalStatus("PENDING");

        LeaveApplication savedApplication = leaveApplicationRepository.save(application);
        return new LeaveApplicationDTO(savedApplication, getStudentName(savedApplication), null);
    }

    // 휴학 신청 승인
    @Transactional
    public LeaveApplicationDTO approveApplication(Integer applicationId, String approverNo) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        if (!"PENDING".equals(application.getApprovalStatus())) {
            throw new IllegalStateException("Only pending applications can be approved");
        }

        Member approver = memberRepository.findByMemberNo(approverNo)
                .orElseThrow(() -> new EntityNotFoundException("Approver not found with number: " + approverNo));

        application.setApprovalStatus("APPROVED");
        application.setApprovalDate(new Date());
        application.setApprover(approver);
        application.setRejectReason(null);

        LeaveApplication updatedApplication = leaveApplicationRepository.save(application);
        return new LeaveApplicationDTO(updatedApplication, getStudentName(updatedApplication), getApproverName(updatedApplication));
    }

    // 휴학 신청 거절
    @Transactional
    public LeaveApplicationDTO rejectApplication(Integer applicationId, String approverNo, String rejectReason) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        if (!"PENDING".equals(application.getApprovalStatus())) {
            throw new IllegalStateException("Only pending applications can be rejected");
        }

        Member approver = memberRepository.findByMemberNo(approverNo)
                .orElseThrow(() -> new EntityNotFoundException("Approver not found with number: " + approverNo));

        application.setApprovalStatus("REJECTED");
        application.setApprovalDate(new Date());
        application.setApprover(approver);
        application.setRejectReason(rejectReason);

        LeaveApplication updatedApplication = leaveApplicationRepository.save(application);
        return new LeaveApplicationDTO(updatedApplication, getStudentName(updatedApplication), getApproverName(updatedApplication));
    }

    // 휴학 신청 수정
    @Transactional
    public LeaveApplicationDTO updateApplication(Integer applicationId, LeaveApplicationDTO dto) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        if (!"PENDING".equals(application.getApprovalStatus())) {
            throw new IllegalStateException("Only pending applications can be updated");
        }

        if (dto.getLeaveType() != null) {
            application.setLeaveType(dto.getLeaveType());
        }
        if (dto.getStartYear() != null) {
            application.setStartYear(dto.getStartYear());
        }
        if (dto.getStartSemester() != null) {
            application.setStartSemester(dto.getStartSemester());
        }
        if (dto.getEndYear() != null) {
            application.setEndYear(dto.getEndYear());
        }
        if (dto.getEndSemester() != null) {
            application.setEndSemester(dto.getEndSemester());
        }
        if (dto.getApplicationReason() != null) {
            application.setApplicationReason(dto.getApplicationReason());
        }

        LeaveApplication updatedApplication = leaveApplicationRepository.save(application);
        return new LeaveApplicationDTO(updatedApplication, getStudentName(updatedApplication), getApproverName(updatedApplication));
    }

    // 휴학 신청 삭제
    @Transactional
    public void deleteApplication(Integer applicationId) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        if (!"PENDING".equals(application.getApprovalStatus())) {
            throw new IllegalStateException("Only pending applications can be deleted");
        }

        leaveApplicationRepository.delete(application);
    }

    // 학생 이름 가져오기
    private String getStudentName(LeaveApplication application) {
        if (application.getStudent() != null) {
            return application.getStudent().getName();
        }
        return null;
    }

    // 승인자 이름 가져오기
    private String getApproverName(LeaveApplication application) {
        if (application.getApprover() != null) {
            return application.getApprover().getName();
        }
        return null;
    }

    // 복학 처리 - 학생의 가장 최근 승인된 휴학 신청을 복학 상태로 변경
    @Transactional
    public LeaveApplicationDTO processReturn(String studentNo, String approverNo) {
        // 학생의 승인된 휴학 신청 중 가장 최근 것을 찾음
        List<LeaveApplication> approvedApplications = leaveApplicationRepository.findByStudent_MemberNo(studentNo)
                .stream()
                .filter(app -> "APPROVED".equals(app.getApprovalStatus()))
                .sorted((a, b) -> b.getApplicationDate().compareTo(a.getApplicationDate()))
                .toList();

        if (approvedApplications.isEmpty()) {
            throw new IllegalStateException("승인된 휴학 신청이 없습니다.");
        }

        LeaveApplication latestApproved = approvedApplications.get(0);

        // 복학 처리를 위해 상태를 RETURNED로 변경
        latestApproved.setApprovalStatus("RETURNED");

        LeaveApplication updatedApplication = leaveApplicationRepository.save(latestApproved);
        return new LeaveApplicationDTO(updatedApplication, getStudentName(updatedApplication), getApproverName(updatedApplication));
    }
}