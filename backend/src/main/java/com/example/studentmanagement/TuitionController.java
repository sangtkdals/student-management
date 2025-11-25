package com.example.studentmanagement;

import com.example.studentmanagement.dto.TuitionRequest;
import com.example.studentmanagement.dto.TuitionResponse;
import com.example.studentmanagement.service.TuitionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tuition")
@CrossOrigin(origins = "*")
public class TuitionController {

    private final TuitionService tuitionService;

    public TuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    @PostMapping
    public ResponseEntity<TuitionResponse> createTuition(@RequestBody TuitionRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(tuitionService.createTuition(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TuitionResponse>> getAllTuition() {
        return ResponseEntity.ok(tuitionService.getAllTuition());
    }

    @GetMapping("/{tuitionId}")
    public ResponseEntity<TuitionResponse> getTuitionById(@PathVariable Integer tuitionId) {
        try {
            return ResponseEntity.ok(tuitionService.getTuitionById(tuitionId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/student/{stuNo}")
    public ResponseEntity<List<TuitionResponse>> getTuitionByStuNo(@PathVariable String stuNo) {
        return ResponseEntity.ok(tuitionService.getTuitionByStuNo(stuNo));
    }

    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<TuitionResponse>> getTuitionByPaymentStatus(@PathVariable String paymentStatus) {
        return ResponseEntity.ok(tuitionService.getTuitionByPaymentStatus(paymentStatus));
    }

    @GetMapping("/year/{year}/semester/{semester}")
    public ResponseEntity<List<TuitionResponse>> getTuitionByYearAndSemester(
            @PathVariable Integer year, @PathVariable Integer semester) {
        return ResponseEntity.ok(tuitionService.getTuitionByYearAndSemester(year, semester));
    }

    @PutMapping("/{tuitionId}")
    public ResponseEntity<TuitionResponse> updateTuition(
            @PathVariable Integer tuitionId, @RequestBody TuitionRequest request) {
        try {
            return ResponseEntity.ok(tuitionService.updateTuition(tuitionId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{tuitionId}/payment")
    public ResponseEntity<TuitionResponse> processTuitionPayment(
            @PathVariable Integer tuitionId, @RequestBody Map<String, Integer> paymentData) {
        try {
            Integer paymentAmount = paymentData.get("paymentAmount");
            return ResponseEntity.ok(tuitionService.processTuitionPayment(tuitionId, paymentAmount));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{tuitionId}")
    public ResponseEntity<Void> deleteTuition(@PathVariable Integer tuitionId) {
        try {
            tuitionService.deleteTuition(tuitionId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
