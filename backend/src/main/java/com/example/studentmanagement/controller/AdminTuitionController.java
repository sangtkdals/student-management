package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.BatchTuitionRequestDTO;
import com.example.studentmanagement.dto.StudentTuitionStatusDTO;
import com.example.studentmanagement.dto.TuitionDTO;
import com.example.studentmanagement.service.TuitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tuitions")
public class AdminTuitionController {

    private final TuitionService tuitionService;

    public AdminTuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    // 모든 등록금 조회
    @GetMapping
    public ResponseEntity<List<TuitionDTO>> getAllTuitions() {
        try {
            List<TuitionDTO> tuitions = tuitionService.getAllTuitions();
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 등록금 ID로 조회
    @GetMapping("/{tuitionId}")
    public ResponseEntity<?> getTuitionById(@PathVariable Integer tuitionId) {
        try {
            TuitionDTO tuition = tuitionService.getTuitionById(tuitionId);
            return ResponseEntity.ok(tuition);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // 학생별 등록금 조회
    @GetMapping("/student/{studentNo}")
    public ResponseEntity<List<TuitionDTO>> getTuitionsByStudent(@PathVariable String studentNo) {
        try {
            List<TuitionDTO> tuitions = tuitionService.getTuitionsByStudent(studentNo);
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 학년도 및 학기별 등록금 조회
    @GetMapping("/search")
    public ResponseEntity<List<TuitionDTO>> getTuitionsByAcademicYearAndSemester(
            @RequestParam Integer academicYear,
            @RequestParam Integer semester) {
        try {
            List<TuitionDTO> tuitions = tuitionService.getTuitionsByAcademicYearAndSemester(academicYear, semester);
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 결제 상태별 등록금 조회
    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<TuitionDTO>> getTuitionsByPaymentStatus(@PathVariable String paymentStatus) {
        try {
            List<TuitionDTO> tuitions = tuitionService.getTuitionsByPaymentStatus(paymentStatus);
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 미납 등록금 조회
    @GetMapping("/unpaid")
    public ResponseEntity<List<TuitionDTO>> getUnpaidTuitions() {
        try {
            List<TuitionDTO> tuitions = tuitionService.getUnpaidTuitions();
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 마감일이 지난 미납 등록금 조회
    @GetMapping("/overdue")
    public ResponseEntity<List<TuitionDTO>> getOverdueTuitions() {
        try {
            List<TuitionDTO> tuitions = tuitionService.getOverdueTuitions();
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 등록금 생성
    @PostMapping
    public ResponseEntity<?> createTuition(@RequestBody TuitionDTO tuitionDTO) {
        try {
            TuitionDTO createdTuition = tuitionService.createTuition(tuitionDTO);
            return ResponseEntity.ok(createdTuition);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("등록금 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 등록금 수정
    @PutMapping("/{tuitionId}")
    public ResponseEntity<?> updateTuition(@PathVariable Integer tuitionId, @RequestBody TuitionDTO tuitionDTO) {
        try {
            TuitionDTO updatedTuition = tuitionService.updateTuition(tuitionId, tuitionDTO);
            return ResponseEntity.ok(updatedTuition);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("등록금 수정 중 오류 발생: " + e.getMessage());
        }
    }

    // 등록금 삭제
    @DeleteMapping("/{tuitionId}")
    public ResponseEntity<?> deleteTuition(@PathVariable Integer tuitionId) {
        try {
            tuitionService.deleteTuition(tuitionId);
            return ResponseEntity.ok("등록금이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("등록금 삭제 중 오류 발생: " + e.getMessage());
        }
    }

    // 선택 등록금 일괄 삭제
    @DeleteMapping("/batch-delete")
    public ResponseEntity<?> batchDeleteTuitions(@RequestBody List<Integer> tuitionIds) {
        try {
            tuitionService.deleteTuitions(tuitionIds);
            return ResponseEntity.ok("선택된 등록금이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("일괄 삭제 중 오류 발생: " + e.getMessage());
        }
    }

    // 납부 확인 (결제 상태를 PAID로 변경)
    @PutMapping("/{tuitionId}/confirm")
    public ResponseEntity<?> confirmPayment(@PathVariable Integer tuitionId) {
        try {
            TuitionDTO tuitionDTO = new TuitionDTO();
            tuitionDTO.setPaymentStatus("PAID");
            tuitionDTO.setPaidDate(new java.util.Date());
            TuitionDTO updatedTuition = tuitionService.updateTuition(tuitionId, tuitionDTO);
            return ResponseEntity.ok(updatedTuition);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("납부 확인 처리 중 오류 발생: " + e.getMessage());
        }
    }

    // 학과별 등록금 일괄 생성
    @PostMapping("/batch-create/department/{deptCode}")
    public ResponseEntity<String> batchCreateTuitions(
            @PathVariable String deptCode,
            @RequestParam int year,
            @RequestParam int semester) {
        try {
            int createdCount = tuitionService.createTuitionBillsForDepartment(deptCode, year, semester);
            String message = String.format(
                "학과 코드 %s에 대한 등록금 고지서 %d건이 성공적으로 생성되었습니다.",
                deptCode,
                createdCount
            );
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            // 예외 처리: 서비스 로직에서 발생한 예외를 처리합니다.
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("고지서 일괄 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 학과 및 학년별 등록금 조회
    @GetMapping("/department/{deptCode}/grade/{grade}")
    public ResponseEntity<List<TuitionDTO>> getTuitionsByDepartmentAndGrade(
            @PathVariable(value = "deptCode") String deptCode,
            @PathVariable(value = "grade") int grade) {
        try {
            List<TuitionDTO> tuitions = tuitionService.getTuitionsByDepartmentAndGrade(deptCode, grade);
            return ResponseEntity.ok(tuitions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 학과별 학생 목록 조회 (등록금 생성 여부 포함)
    @GetMapping("/department/{deptCode}/students")
    public ResponseEntity<List<StudentTuitionStatusDTO>> getStudentsByDepartmentWithTuitionStatus(
            @PathVariable String deptCode,
            @RequestParam Integer academicYear,
            @RequestParam Integer semester) {
        try {
            List<StudentTuitionStatusDTO> students = tuitionService.getStudentsByDepartmentWithTuitionStatus(deptCode, academicYear, semester);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 학과 및 학년별 학생 목록 조회 (등록금 생성 여부 포함)
    @GetMapping("/department/{deptCode}/grade/{grade}/students")
    public ResponseEntity<List<StudentTuitionStatusDTO>> getStudentsByDepartmentAndGradeWithTuitionStatus(
            @PathVariable(value = "deptCode") String deptCode,
            @PathVariable(value = "grade") int grade,
            @RequestParam(value = "academicYear") Integer academicYear,
            @RequestParam(value = "semester") Integer semester) {
        try {
            List<StudentTuitionStatusDTO> students = tuitionService.getStudentsByDepartmentAndGradeWithTuitionStatus(deptCode, grade, academicYear, semester);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 개선된 일괄 등록금 생성 (선택된 학생들만 또는 전체)
    @PostMapping("/batch-create")
    public ResponseEntity<String> batchCreateTuitionsV2(@RequestBody BatchTuitionRequestDTO request) {
        try {
            int createdCount = tuitionService.batchCreateTuitions(request);

            String message;
            if (request.getStudentNumbers() != null && !request.getStudentNumbers().isEmpty()) {
                message = String.format(
                    "선택된 학생 %d명에 대한 등록금 고지서 %d건이 성공적으로 생성되었습니다.",
                    request.getStudentNumbers().size(),
                    createdCount
                );
            } else {
                message = String.format(
                    "학과 코드 %s에 대한 등록금 고지서 %d건이 성공적으로 생성되었습니다.",
                    request.getDeptCode(),
                    createdCount
                );
            }

            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("고지서 일괄 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
