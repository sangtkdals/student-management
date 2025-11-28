package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Tuition;
import com.example.studentmanagement.service.TuitionService;
import com.example.studentmanagement.util.JwtUtil;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/tuition")
public class TuitionController {

    private final TuitionService tuitionService;
    private final JwtUtil jwtUtil;

    public TuitionController(TuitionService tuitionService, JwtUtil jwtUtil) {
        this.tuitionService = tuitionService;
        this.jwtUtil = jwtUtil;
    }

    // GET /api/tuition/admin/list - 관리자: 전체 등록금 목록 조회
    @GetMapping("/admin/list")
    public ResponseEntity<List<TuitionDTO>> getAllTuitions(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "semester", required = false) Integer semester) {

        List<Tuition> tuitions;

        if (status != null && !status.isEmpty()) {
            tuitions = tuitionService.getTuitionsByStatus(status);
        } else if (year != null && semester != null) {
            tuitions = tuitionService.getTuitionsByYearAndSemester(year, semester);
        } else {
            tuitions = tuitionService.getAllTuitions();
        }

        List<TuitionDTO> dtos = tuitions.stream()
                .map(this::convertToDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // GET /api/tuition/my - 학생: 본인 등록금 조회
    @GetMapping("/my")
    public ResponseEntity<List<TuitionDTO>> getMyTuitions(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String studentNo = jwtUtil.extractMemberNo(token);

        List<Tuition> tuitions = tuitionService.getTuitionsByStudent(studentNo);

        List<TuitionDTO> dtos = tuitions.stream()
                .map(this::convertToDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // GET /api/tuition/{id} - 특정 등록금 조회
    @GetMapping("/{id}")
    public ResponseEntity<TuitionDTO> getTuition(@PathVariable("id") Integer id) {
        Tuition tuition = tuitionService.getTuitionById(id);
        return ResponseEntity.ok(convertToDTO(tuition));
    }

    // POST /api/tuition - 관리자: 등록금 고지서 생성
    @PostMapping
    public ResponseEntity<TuitionDTO> createTuitionBill(@RequestBody CreateTuitionRequest request) {
        Tuition created = tuitionService.createTuitionBill(
                request.getStudentNo(),
                request.getYear(),
                request.getSemester(),
                request.getAmount(),
                request.getScholarship()
        );
        return ResponseEntity.ok(convertToDTO(created));
    }

    // PUT /api/tuition/{id}/confirm - 관리자: 납부 확인
    @PutMapping("/{id}/confirm")
    public ResponseEntity<TuitionDTO> confirmPayment(@PathVariable("id") Integer id) {
        Tuition confirmed = tuitionService.confirmPayment(id);
        return ResponseEntity.ok(convertToDTO(confirmed));
    }

    // DELETE /api/tuition/{id} - 관리자: 등록금 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTuition(@PathVariable("id") Integer id) {
        tuitionService.deleteTuition(id);
        return ResponseEntity.noContent().build();
    }

    // Tuition -> TuitionDTO 변환
    private TuitionDTO convertToDTO(Tuition tuition) {
        TuitionDTO dto = new TuitionDTO();
        dto.setTuitionId(tuition.getTuitionId());
        dto.setStudentNo(tuition.getStudent().getMemberNo());
        dto.setStudentName(tuition.getStudent().getName());
        dto.setDepartment(tuition.getStudent().getDepartment() != null
                ? tuition.getStudent().getDepartment().getDeptName()
                : null);
        dto.setAcademicYear(tuition.getAcademicYear());
        dto.setSemester(tuition.getSemester());
        dto.setAmount(tuition.getTuitionAmount());
        dto.setScholarship(tuition.getScholarshipAmount());
        dto.setPaymentStatus(tuition.getPaymentStatus());
        dto.setBillDate(tuition.getBillDate());
        dto.setDueDate(tuition.getDueDate());
        dto.setPaidDate(tuition.getPaidDate());
        dto.setPaymentMethod(tuition.getPaymentMethod());
        dto.setReceiptNo(tuition.getReceiptNo());
        return dto;
    }

    // DTO 클래스들
    @Data
    static class TuitionDTO {
        private Integer tuitionId;
        private String studentNo;
        private String studentName;
        private String department;
        private Integer academicYear;
        private Integer semester;
        private Integer amount;
        private Integer scholarship;
        private String paymentStatus;
        private Date billDate;
        private Date dueDate;
        private Date paidDate;
        private String paymentMethod;
        private String receiptNo;
    }

    @Data
    static class CreateTuitionRequest {
        private String studentNo;
        private Integer year;
        private Integer semester;
        private Integer amount;
        private Integer scholarship;
    }
}
