package com.example.studentmanagement;

import com.example.studentmanagement.dto.LeaveOfAbsenceRequest;
import com.example.studentmanagement.dto.LeaveOfAbsenceResponse;
import com.example.studentmanagement.service.LeaveOfAbsenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-of-absence")
@CrossOrigin(origins = "*") // CORS 설정 (프론트엔드와 통신을 위해)
public class LeaveOfAbsenceController {

    private final LeaveOfAbsenceService leaveOfAbsenceService;

    public LeaveOfAbsenceController(LeaveOfAbsenceService leaveOfAbsenceService) {
        this.leaveOfAbsenceService = leaveOfAbsenceService;
    }

    /**
     * 휴학/복학 신청 생성
     * POST /api/leave-of-absence/student/{studentId}
     */
    @PostMapping("/student/{studentId}")
    public ResponseEntity<LeaveOfAbsenceResponse> createApplication(
            @PathVariable Long studentId,
            @RequestBody LeaveOfAbsenceRequest request) {
        try {
            LeaveOfAbsenceResponse response = leaveOfAbsenceService.createApplication(studentId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 특정 학생의 모든 신청 내역 조회
     * GET /api/leave-of-absence/student/{studentId}
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<LeaveOfAbsenceResponse>> getAllApplicationsByStudent(
            @PathVariable Long studentId) {
        List<LeaveOfAbsenceResponse> applications = leaveOfAbsenceService.getAllApplicationsByStudent(studentId);
        return ResponseEntity.ok(applications);
    }

    /**
     * 특정 학생의 휴학 신청 내역만 조회
     * GET /api/leave-of-absence/student/{studentId}/leave
     */
    @GetMapping("/student/{studentId}/leave")
    public ResponseEntity<List<LeaveOfAbsenceResponse>> getLeaveApplicationsByStudent(
            @PathVariable Long studentId) {
        List<LeaveOfAbsenceResponse> applications = leaveOfAbsenceService.getApplicationsByStudentAndType(studentId, "휴학");
        return ResponseEntity.ok(applications);
    }

    /**
     * 특정 학생의 복학 신청 내역만 조회
     * GET /api/leave-of-absence/student/{studentId}/return
     */
    @GetMapping("/student/{studentId}/return")
    public ResponseEntity<List<LeaveOfAbsenceResponse>> getReturnApplicationsByStudent(
            @PathVariable Long studentId) {
        List<LeaveOfAbsenceResponse> applications = leaveOfAbsenceService.getApplicationsByStudentAndType(studentId, "복학");
        return ResponseEntity.ok(applications);
    }

    /**
     * 특정 신청 내역 상세 조회
     * GET /api/leave-of-absence/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<LeaveOfAbsenceResponse> getApplicationById(@PathVariable Long id) {
        try {
            LeaveOfAbsenceResponse application = leaveOfAbsenceService.getApplicationById(id);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 신청 상태 업데이트 (관리자용)
     * PATCH /api/leave-of-absence/{id}/status
     * Request Body: { "status": "승인", "rejectReason": "..." }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<LeaveOfAbsenceResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            String rejectReason = statusUpdate.get("rejectReason");
            LeaveOfAbsenceResponse response = leaveOfAbsenceService.updateApplicationStatus(id, status, rejectReason);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 신청 취소 (학생용)
     * DELETE /api/leave-of-absence/{id}/student/{studentId}
     */
    @DeleteMapping("/{id}/student/{studentId}")
    public ResponseEntity<Void> cancelApplication(
            @PathVariable Long id,
            @PathVariable Long studentId) {
        try {
            leaveOfAbsenceService.cancelApplication(id, studentId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
