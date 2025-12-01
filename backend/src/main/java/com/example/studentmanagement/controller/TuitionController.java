package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Tuition;
import com.example.studentmanagement.repository.TuitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collections;
import java.util.List;

/**
 * 등록금(Tuition) 관련 API 요청을 처리하는 컨트롤러.
 * 기본 경로: /api/student
 */
@RestController
@RequestMapping("/api/student") // AuthController, PostController와 같이 /api로 시작하는 구조를 따릅니다.
@CrossOrigin(origins = "*") // CORS 허용 (개발 환경 기준)
public class TuitionController {

    @Autowired
    private TuitionRepository tuitionRepository; // DB 조회를 위한 Repository 주입

    /**
     * 학생의 등록금 납부 내역을 조회합니다.
     * GET /api/student/tuition-history?studentNo=20210001
     * * @param studentNo 쿼리 파라미터로 받은 학생의 학번 (프런트엔드에서 user.memberNo로 전달됨)
     * @return 등록금 내역 리스트 (List<Tuition>)
     */
    @GetMapping("/tuition-history")
    public ResponseEntity<List<Tuition>> getTuitionHistory(@RequestParam("studentNo") String studentNo) {
        if (studentNo == null || studentNo.isEmpty()) {
            // 학번이 누락된 경우 400 Bad Request 반환
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        try {
            // 1. DB 조회: Repository를 사용하여 stu_no(학생 학번)로 등록금 내역을 조회합니다.
            //    이때 findByStudent_MemberNo 메서드는 Member 엔티티의 memberNo 필드를 참조하여
            //    Tuition 엔티티의 stu_no 컬럼을 기준으로 데이터를 가져와야 합니다.
            //    (Tuition 엔티티의 @JoinColumn(name = "stu_no", referencedColumnName = "m_no") 설정 기반)
            
            // ⭐ 중요: 이 메서드 이름은 실제 Repository 인터페이스에 정의된 메서드명과 정확히 일치해야 합니다.
            // 예시로 findByStudent_MemberNo를 사용했습니다.
            List<Tuition> history = tuitionRepository.findByStudent_MemberNo(studentNo);
            
            if (history.isEmpty()) {
                // 조회된 내역이 없는 경우 빈 리스트를 반환 (프런트엔드에서 "내역 없음" 표시)
                return ResponseEntity.ok(Collections.emptyList());
            }

            // 2. 정상 조회된 경우 등록금 내역 리스트를 200 OK와 함께 반환
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            System.err.println("등록금 내역 조회 중 오류 발생: " + e.getMessage());
            // 서버 오류 발생 시 500 Internal Server Error 반환
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        }
    }
}