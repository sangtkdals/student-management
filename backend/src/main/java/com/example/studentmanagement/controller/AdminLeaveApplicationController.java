package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.LeaveApplicationDTO;
import com.example.studentmanagement.service.LeaveApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/leave-applications")
public class AdminLeaveApplicationController {

    private final LeaveApplicationService leaveApplicationService;

    public AdminLeaveApplicationController(LeaveApplicationService leaveApplicationService) {
        this.leaveApplicationService = leaveApplicationService;
    }

    // 모든 휴학 신청 조회
    @GetMapping
    public ResponseEntity<List<LeaveApplicationDTO>> getAllApplications() {
        try {
            List<LeaveApplicationDTO> applications = leaveApplicationService.getAllApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 특정 휴학 신청 조회
    @GetMapping("/{applicationId}")
    public ResponseEntity<?> getApplicationById(@PathVariable Integer applicationId) {
        try {
            LeaveApplicationDTO application = leaveApplicationService.getApplicationById(applicationId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // 학생별 휴학 신청 조회
    @GetMapping("/student/{studentNo}")
    public ResponseEntity<List<LeaveApplicationDTO>> getApplicationsByStudent(@PathVariable String studentNo) {
        try {
            List<LeaveApplicationDTO> applications = leaveApplicationService.getApplicationsByStudent(studentNo);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 승인 상태별 조회
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeaveApplicationDTO>> getApplicationsByStatus(@PathVariable String status) {
        try {
            List<LeaveApplicationDTO> applications = leaveApplicationService.getApplicationsByStatus(status);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 승인 대기 중인 신청 조회
    @GetMapping("/pending")
    public ResponseEntity<List<LeaveApplicationDTO>> getPendingApplications() {
        try {
            List<LeaveApplicationDTO> applications = leaveApplicationService.getPendingApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 승인된 신청 조회
    @GetMapping("/approved")
    public ResponseEntity<List<LeaveApplicationDTO>> getApprovedApplications() {
        try {
            List<LeaveApplicationDTO> applications = leaveApplicationService.getApprovedApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 거절된 신청 조회
    @GetMapping("/rejected")
    public ResponseEntity<List<LeaveApplicationDTO>> getRejectedApplications() {
        try {
            List<LeaveApplicationDTO> applications = leaveApplicationService.getRejectedApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 휴학 신청 생성
    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody LeaveApplicationDTO dto) {
        try {
            LeaveApplicationDTO createdApplication = leaveApplicationService.createApplication(dto);
            return ResponseEntity.ok(createdApplication);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("신청 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 휴학 신청 수정
    @PutMapping("/{applicationId}")
    public ResponseEntity<?> updateApplication(@PathVariable Integer applicationId, @RequestBody LeaveApplicationDTO dto) {
        try {
            LeaveApplicationDTO updatedApplication = leaveApplicationService.updateApplication(applicationId, dto);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("신청 수정 중 오류 발생: " + e.getMessage());
        }
    }

    // 휴학 신청 삭제
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<?> deleteApplication(@PathVariable Integer applicationId) {
        try {
            leaveApplicationService.deleteApplication(applicationId);
            return ResponseEntity.ok("신청이 삭제되었습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("신청 삭제 중 오류 발생: " + e.getMessage());
        }
    }

    // 휴학 신청 승인
    @PostMapping("/{applicationId}/approve")
    public ResponseEntity<?> approveApplication(
            @PathVariable Integer applicationId,
            Authentication authentication) {
        try {
            // JWT에서 memberNo 추출 (실제로는 JWT claims에서 가져와야 함)
            String approverNo = "admin001"; // 임시로 하드코딩, 실제로는 authentication에서 추출

            LeaveApplicationDTO approvedApplication = leaveApplicationService.approveApplication(applicationId, approverNo);
            return ResponseEntity.ok(approvedApplication);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("승인 처리 중 오류 발생: " + e.getMessage());
        }
    }

    // 휴학 신청 거절
    @PostMapping("/{applicationId}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Integer applicationId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        try {
            String rejectReason = payload.get("rejectReason");
            if (rejectReason == null || rejectReason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("거절 사유를 입력해주세요.");
            }

            // JWT에서 memberNo 추출
            String approverNo = "admin001"; // 임시로 하드코딩, 실제로는 authentication에서 추출

            LeaveApplicationDTO rejectedApplication = leaveApplicationService.rejectApplication(applicationId, approverNo, rejectReason);
            return ResponseEntity.ok(rejectedApplication);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("거절 처리 중 오류 발생: " + e.getMessage());
        }
    }

    // 복학 처리 (구버전 - 학생번호로 직접 처리)
    @PutMapping("/return/{studentNo}")
    public ResponseEntity<?> processReturn(
            @PathVariable String studentNo,
            Authentication authentication) {
        try {
            // JWT에서 memberNo 추출
            String approverNo = "admin001"; // 임시로 하드코딩, 실제로는 authentication에서 추출

            LeaveApplicationDTO returnedApplication = leaveApplicationService.processReturn(studentNo, approverNo);
            return ResponseEntity.ok(returnedApplication);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("복학 처리 중 오류 발생: " + e.getMessage());
        }
    }

    // 복학 신청 승인 (학생의 복학 신청을 승인)
    @PostMapping("/{applicationId}/approve-return")
    public ResponseEntity<?> approveReturnRequest(
            @PathVariable Integer applicationId,
            Authentication authentication) {
        try {
            // JWT에서 memberNo 추출
            String approverNo = "admin001"; // 임시로 하드코딩, 실제로는 authentication에서 추출

            LeaveApplicationDTO approvedReturn = leaveApplicationService.approveReturnRequest(applicationId, approverNo);
            return ResponseEntity.ok(approvedReturn);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("복학 승인 처리 중 오류 발생: " + e.getMessage());
        }
    }

    // 복학 신청 대기 목록 조회
    @GetMapping("/return-pending")
    public ResponseEntity<List<LeaveApplicationDTO>> getReturnPendingApplications() {
        try {
            List<LeaveApplicationDTO> applications = leaveApplicationService.getApplicationsByStatus("RETURN_PENDING");
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}