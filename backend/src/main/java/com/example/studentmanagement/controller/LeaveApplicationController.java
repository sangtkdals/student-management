package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.LeaveApplication;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.StudentMember;
import com.example.studentmanagement.dto.LeaveApplicationDTO;
import com.example.studentmanagement.service.LeaveApplicationService;
import com.example.studentmanagement.repository.StudentMemberRepository;
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
    private final StudentMemberRepository studentMemberRepository;
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

    // GET /api/leave-applications/my - 학생 본인의 휴학 신청 내역 조회
    @GetMapping("/my")
    public ResponseEntity<List<LeaveApplicationDTO>> getMyApplications(
            @RequestHeader("Authorization") String authHeader) {
        
        // JWT 토큰에서 학생 번호 추출
        String token = authHeader.replace("Bearer ", "");
        String studentNo = jwtUtil.extractMemberNo(token);
        
        List<LeaveApplication> applications = leaveApplicationService.getMyApplications(studentNo);
        
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
        String studentNo = jwtUtil.extractMemberNo(token);
        
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

    // POST /api/leave-applications/return - 학생이 복학 신청 제출
    @PostMapping("/return")
    public ResponseEntity<LeaveApplicationDTO> createReturnApplication(
            @RequestBody CreateReturnApplicationRequest request,
            @RequestHeader("Authorization") String authHeader) {

        // JWT 토큰에서 학생 번호 추출
        String token = authHeader.replace("Bearer ", "");
        String studentNo = jwtUtil.extractMemberNo(token);

        // 복학 신청 생성
        LeaveApplication created = leaveApplicationService.createReturnApplication(
            studentNo,
            request.getReturnYear(),
            request.getReturnSemester(),
            request.getReason()
        );

        return ResponseEntity.ok(convertToDTO(created));
    }

    // GET /api/leave-applications/on-leave - 현재 휴학중인 학생 목록
    @GetMapping("/on-leave")
    public ResponseEntity<List<StudentOnLeaveDTO>> getStudentsOnLeave() {
        List<Member> students = leaveApplicationService.getStudentsOnLeave();
        
        List<StudentOnLeaveDTO> dtos = students.stream()
            .map(this::convertToStudentOnLeaveDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    // PUT /api/leave-applications/return/{studentNo} - 복학 처리
    @PutMapping("/return/{studentNo}")
    public ResponseEntity<StudentOnLeaveDTO> processReturnToSchool(
            @PathVariable("studentNo") String studentNo,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        String approverId = jwtUtil.extractMemberNo(token);
        
        Member student = leaveApplicationService.processReturnToSchool(studentNo, approverId);
        
        return ResponseEntity.ok(convertToStudentOnLeaveDTO(student));
    }

    // Member를 StudentOnLeaveDTO로 변환하는 헬퍼 메서드 (96번 라인 다음에 추가)
    private StudentOnLeaveDTO convertToStudentOnLeaveDTO(Member member) {
        StudentOnLeaveDTO dto = new StudentOnLeaveDTO();
        dto.setStudentNo(member.getMemberNo());
        dto.setStudentName(member.getName());
        dto.setDepartment(member.getDepartment() != null ? member.getDepartment().getDeptName() : "");

        // StudentMember에서 학년과 학적 상태 조회
        studentMemberRepository.findByMemberId(member.getMemberId()).ifPresent(sm -> {
            dto.setGradeLevel(sm.getStuGrade());
            dto.setEnrollmentStatus(sm.getEnrollmentStatus());
        });

        return dto;
    }

    // PUT /api/leave-applications/{id}/approve - 승인 처리
    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveApplicationDTO> approveApplication(
            @PathVariable("id") Integer id,
            @RequestHeader("Authorization") String authHeader) {
        
        // JWT 토큰에서 승인자 ID 추출
        String token = authHeader.replace("Bearer ", "");
        String approverId = jwtUtil.extractMemberNo(token);
        
        // 승인 처리
        LeaveApplication approved = leaveApplicationService.approveApplication(id, approverId);
        
        return ResponseEntity.ok(convertToDTO(approved));
    }

    // PUT /api/leave-applications/{id}/reject - 거절 처리
    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveApplicationDTO> rejectApplication(
            @PathVariable("id") Integer id,
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

    // 복학 신청 생성 요청 DTO
    @Data
    static class CreateReturnApplicationRequest {
        private Integer returnYear;      // 복학 희망 연도 (예: 2025)
        private Integer returnSemester;  // 복학 희망 학기 (1 또는 2)
        private String reason;           // 복학 사유
    }

    // 휴학중인 학생 정보 DTO
    @Data
    static class StudentOnLeaveDTO {
        private String studentNo;
        private String studentName;
        private String department;
        private Integer gradeLevel;
        private String enrollmentStatus;
    }
}

