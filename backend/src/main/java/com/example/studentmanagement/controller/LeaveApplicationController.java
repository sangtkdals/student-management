package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.LeaveApplication;
import com.example.studentmanagement.dto.LeaveApplicationDTO;
import com.example.studentmanagement.service.LeaveApplicationService;
import com.example.studentmanagement.util.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leave-applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")  // 프론트엔드 주소 (Vite 기본 포트)
public class LeaveApplicationController {
    
    private final LeaveApplicationService leaveApplicationService;
    private final JwtUtil jwtUtil;

    // GET /api/leave-applications - 모든 휴학 신청 조회
    @GetMapping
    public ResponseEntity<List<LeaveApplicationDTO>> getAllApplications() {
        List<LeaveApplication> applications = leaveApplicationService.getAllApplications();
        
        // Entity를 DTO로 변환
        List<LeaveApplicationDTO> dtos = applications.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    // POST /api/leave-applications - 학생이 휴학 신청 제출
    @PostMapping
    public ResponseEntity<LeaveApplicationDTO> createApplication(
            @RequestBody CreateLeaveApplicationRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        // JWT 토큰에서 학생 ID 추출
        String token = authHeader.replace("Bearer ", "");
        String studentNo = jwtUtil.extractUsername(token);
        
        // 휴학 신청 생성
        LeaveApplication created = leaveApplicationService.createApplication(
            studentNo,
            request.getLeaveType(),
            request.getStartYear(),
            request.getStartSemester(),
            request.getEndYear(),
            request.getEndSemester(),
            request.getReason()
        );
        
        return ResponseEntity.ok(convertToDTO(created));
    }

    // PUT /api/leave-applications/{id}/approve - 승인 처리
    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveApplicationDTO> approveApplication(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        
        // JWT 토큰에서 승인자 ID 추출
        String token = authHeader.replace("Bearer ", "");
        String approverId = jwtUtil.extractUsername(token);
        
        // 승인 처리
        LeaveApplication approved = leaveApplicationService.approveApplication(id, approverId);
        
        return ResponseEntity.ok(convertToDTO(approved));
    }

    // PUT /api/leave-applications/{id}/reject - 거절 처리
    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveApplicationDTO> rejectApplication(
            @PathVariable Integer id,
            @RequestBody RejectRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        // JWT 토큰에서 승인자 ID 추출
        String token = authHeader.replace("Bearer ", "");
        String approverId = jwtUtil.extractUsername(token);
        
        // 거절 처리
        LeaveApplication rejected = leaveApplicationService.rejectApplication(
            id, approverId, request.getReason());
        
        return ResponseEntity.ok(convertToDTO(rejected));
    }

    // Entity를 DTO로 변환하는 헬퍼 메서드
    private LeaveApplicationDTO convertToDTO(LeaveApplication la) {
        LeaveApplicationDTO dto = new LeaveApplicationDTO();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        
        dto.setApplicationId(la.getApplicationId());
        dto.setStudentNo(la.getStudent().getMemberNo());
        dto.setStudentName(la.getStudent().getName());
        dto.setLeaveType(la.getLeaveType());
        dto.setStartYear(la.getStartYear());
        dto.setStartSemester(la.getStartSemester());
        dto.setEndYear(la.getEndYear());
        dto.setEndSemester(la.getEndSemester());
        dto.setReason(la.getApplicationReason());
        dto.setApplicationDate(sdf.format(la.getApplicationDate()));
        dto.setApprovalStatus(la.getApprovalStatus());
        
        // 승인/거절된 경우에만 날짜 설정
        if (la.getApprovalDate() != null) {
            dto.setApprovalDate(sdf.format(la.getApprovalDate()));
        }
        dto.setRejectReason(la.getRejectReason());
        
        return dto;
    }

    // 거절 요청을 받을 DTO
    @Data
    static class RejectRequest {
        private String reason;
    }

    // 휴학 신청 생성 요청 DTO
    @Data
    static class CreateLeaveApplicationRequest {
        private String leaveType;      // "GENERAL", "MILITARY", "ILLNESS", "PREGNANCY"
        private Integer startYear;      // 시작 연도 (예: 2025)
        private Integer startSemester;  // 시작 학기 (1 또는 2)
        private Integer endYear;        // 종료 연도 (예: 2025)
        private Integer endSemester;    // 종료 학기 (1 또는 2)
        private String reason;          // 신청 사유
    }
}

