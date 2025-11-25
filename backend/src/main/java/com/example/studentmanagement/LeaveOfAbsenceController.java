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
@CrossOrigin(origins = "*")
public class LeaveOfAbsenceController {

    private final LeaveOfAbsenceService leaveService;

    public LeaveOfAbsenceController(LeaveOfAbsenceService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public ResponseEntity<LeaveOfAbsenceResponse> createApplication(@RequestBody LeaveOfAbsenceRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(leaveService.createApplication(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LeaveOfAbsenceResponse>> getAllApplications() {
        return ResponseEntity.ok(leaveService.getAllApplications());
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<LeaveOfAbsenceResponse> getApplicationById(@PathVariable Integer applicationId) {
        try {
            return ResponseEntity.ok(leaveService.getApplicationById(applicationId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/student/{stuNo}")
    public ResponseEntity<List<LeaveOfAbsenceResponse>> getApplicationsByStuNo(@PathVariable String stuNo) {
        return ResponseEntity.ok(leaveService.getApplicationsByStuNo(stuNo));
    }

    @GetMapping("/status/{approvalStatus}")
    public ResponseEntity<List<LeaveOfAbsenceResponse>> getApplicationsByStatus(@PathVariable String approvalStatus) {
        return ResponseEntity.ok(leaveService.getApplicationsByStatus(approvalStatus));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<LeaveOfAbsenceResponse> updateApplicationStatus(
            @PathVariable Integer applicationId, @RequestBody Map<String, String> statusData) {
        try {
            String approvalStatus = statusData.get("approvalStatus");
            String approverId = statusData.get("approverId");
            String rejectReason = statusData.get("rejectReason");
            return ResponseEntity.ok(leaveService.updateApplicationStatus(applicationId, approvalStatus, approverId, rejectReason));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> cancelApplication(@PathVariable Integer applicationId) {
        try {
            leaveService.cancelApplication(applicationId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
