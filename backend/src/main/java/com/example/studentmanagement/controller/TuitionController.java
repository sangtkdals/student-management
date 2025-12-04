package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Tuition;
import com.example.studentmanagement.repository.TuitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student") 
@CrossOrigin(origins = "*") 
public class TuitionController {

    @Autowired
    private TuitionRepository tuitionRepository; 

    @GetMapping("/tuition-history")
    public ResponseEntity<List<Tuition>> getTuitionHistory(@RequestParam String studentNo) {
        if (studentNo == null || studentNo.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
        try {
            List<Tuition> history = tuitionRepository.findByStudent_MemberNo(studentNo); 
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            System.err.println("Error fetching tuition history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/tuition-payable")
    public ResponseEntity<List<Tuition>> getPayableTuitions(@RequestParam("studentNo") String studentNo) {
        if (studentNo == null || studentNo.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        try {
            LocalDate currentDate = LocalDate.now(); 
            
            List<Tuition> payableList = tuitionRepository.findPayableTuitionsByStudentNo(studentNo, currentDate);
            
            if (payableList.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            return ResponseEntity.ok(payableList);
        } catch (Exception e) {
            System.err.println("Error fetching payable tuitions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/tuition-payment")
    @Transactional 
    public ResponseEntity<Map<String, String>> processTuitionPayment(@RequestBody Map<String, Object> payload) {
        try {
            List<Integer> tuitionIds = (List<Integer>) payload.get("tuitionIds");
            String paymentMethod = (String) payload.get("paymentMethod");

            if (tuitionIds == null || tuitionIds.isEmpty() || paymentMethod == null || paymentMethod.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "필수 납부 정보(ID 리스트, 납부 방식)가 누락되었습니다."));
            }

            String paidDate = LocalDate.now().toString();
            String receiptNo = generateReceiptNo(); 

            int updatedCount = tuitionRepository.updateTuitionStatusToPaid(tuitionIds, paidDate, paymentMethod, receiptNo);

            if (updatedCount == tuitionIds.size()) {
                return ResponseEntity.ok(Map.of("message", "등록금 납부가 성공적으로 처리되었습니다.", "updatedCount", String.valueOf(updatedCount), "receiptNo", receiptNo));
            } else if (updatedCount > 0) {
                 return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(Map.of("message", "일부 항목만 납부 처리되었습니다. (" + updatedCount + "건)", "updatedCount", String.valueOf(updatedCount), "receiptNo", receiptNo));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "납부할 수 있는 유효한 항목이 없습니다. (이미 납부되었거나 유효하지 않은 항목)"));
            }

        } catch (Exception e) {
            System.err.println("Error processing tuition payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "납부 처리 중 서버 오류가 발생했습니다."));
        }
    }

    private String generateReceiptNo() {
        return "R" + System.currentTimeMillis() + new Random().nextInt(1000);
    }
}