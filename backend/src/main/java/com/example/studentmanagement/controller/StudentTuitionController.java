package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.TuitionDTO;
import com.example.studentmanagement.service.TuitionService;
import com.example.studentmanagement.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/tuitions")
public class StudentTuitionController {

    private final TuitionService tuitionService;
    private final JwtUtil jwtUtil;

    public StudentTuitionController(TuitionService tuitionService, JwtUtil jwtUtil) {
        this.tuitionService = tuitionService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/my")
    public ResponseEntity<List<TuitionDTO>> getMyTuitions(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String studentNo = jwtUtil.getMemberNoFromToken(jwt);
            List<TuitionDTO> tuitions = tuitionService.getTuitionsByStudent(studentNo);
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{tuitionId}/confirm")
    public ResponseEntity<?> confirmMyTuitionPayment(@PathVariable Integer tuitionId, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String studentNo = jwtUtil.getMemberNoFromToken(jwt);
            
            // 본인의 등록금인지 확인
            TuitionDTO tuition = tuitionService.getTuitionById(tuitionId);
            if (!tuition.getStudentNo().equals(studentNo)) {
                return ResponseEntity.status(403).body("자신의 등록금만 납부 확인할 수 있습니다.");
            }

            TuitionDTO updatedTuition = tuitionService.confirmPayment(tuitionId);
            return ResponseEntity.ok(updatedTuition);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("납부 확인 처리 중 오류 발생: " + e.getMessage());
        }
    }
}
