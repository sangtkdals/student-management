package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.LeaveApplicationDTO;
import com.example.studentmanagement.service.LeaveApplicationService;
import com.example.studentmanagement.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/leave-applications")
public class StudentLeaveApplicationController {

    private final LeaveApplicationService leaveApplicationService;
    private final JwtUtil jwtUtil;

    public StudentLeaveApplicationController(LeaveApplicationService leaveApplicationService, JwtUtil jwtUtil) {
        this.leaveApplicationService = leaveApplicationService;
        this.jwtUtil = jwtUtil;
    }

    // JWT에서 memberNo 추출 헬퍼 메서드
    private String getMemberNoFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            Claims claims = jwtUtil.extractAllClaims(jwt);
            return claims.get("memberNo", String.class);
        }
        return null;
    }

    // 본인의 휴학 신청 목록 조회
    @GetMapping("/my")
    public ResponseEntity<List<LeaveApplicationDTO>> getMyApplications(HttpServletRequest request) {
        try {
            String studentNo = getMemberNoFromRequest(request);
            if (studentNo == null) {
                return ResponseEntity.status(401).build();
            }
            List<LeaveApplicationDTO> applications = leaveApplicationService.getApplicationsByStudent(studentNo);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 특정 휴학 신청 조회
    @GetMapping("/{applicationId}")
    public ResponseEntity<?> getApplicationById(@PathVariable Integer applicationId, HttpServletRequest request) {
        try {
            String studentNo = getMemberNoFromRequest(request);
            if (studentNo == null) {
                return ResponseEntity.status(401).build();
            }

            LeaveApplicationDTO application = leaveApplicationService.getApplicationById(applicationId);

            // 본인의 신청만 조회 가능
            if (!studentNo.equals(application.getStudentNo())) {
                return ResponseEntity.status(403).body("본인의 신청만 조회할 수 있습니다.");
            }

            return ResponseEntity.ok(application);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // 휴학 신청 생성
    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody LeaveApplicationDTO dto, HttpServletRequest request) {
        try {
            String studentNo = getMemberNoFromRequest(request);
            if (studentNo == null) {
                return ResponseEntity.status(401).build();
            }

            // 본인의 학번으로만 신청 가능
            if (dto.getStudentNo() != null && !studentNo.equals(dto.getStudentNo())) {
                return ResponseEntity.status(403).body("본인의 학번으로만 신청할 수 있습니다.");
            }

            dto.setStudentNo(studentNo); // 인증된 학번으로 설정
            LeaveApplicationDTO createdApplication = leaveApplicationService.createApplication(dto);
            return ResponseEntity.ok(createdApplication);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("신청 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 휴학 신청 수정
    @PutMapping("/{applicationId}")
    public ResponseEntity<?> updateApplication(
            @PathVariable Integer applicationId,
            @RequestBody LeaveApplicationDTO dto,
            HttpServletRequest request) {
        try {
            String studentNo = getMemberNoFromRequest(request);
            if (studentNo == null) {
                return ResponseEntity.status(401).build();
            }

            LeaveApplicationDTO existingApplication = leaveApplicationService.getApplicationById(applicationId);

            // 본인의 신청만 수정 가능
            if (!studentNo.equals(existingApplication.getStudentNo())) {
                return ResponseEntity.status(403).body("본인의 신청만 수정할 수 있습니다.");
            }

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
    public ResponseEntity<?> deleteApplication(@PathVariable Integer applicationId, HttpServletRequest request) {
        try {
            String studentNo = getMemberNoFromRequest(request);
            if (studentNo == null) {
                return ResponseEntity.status(401).build();
            }

            LeaveApplicationDTO existingApplication = leaveApplicationService.getApplicationById(applicationId);

            // 본인의 신청만 삭제 가능
            if (!studentNo.equals(existingApplication.getStudentNo())) {
                return ResponseEntity.status(403).body("본인의 신청만 삭제할 수 있습니다.");
            }

            leaveApplicationService.deleteApplication(applicationId);
            return ResponseEntity.ok("신청이 삭제되었습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("신청 삭제 중 오류 발생: " + e.getMessage());
        }
    }
}