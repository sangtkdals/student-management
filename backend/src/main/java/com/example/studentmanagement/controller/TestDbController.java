package com.example.studentmanagement.controller;

import com.example.studentmanagement.entity.Department;
import com.example.studentmanagement.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 데이터베이스 연결을 테스트하기 위한 컨트롤러입니다.
 */
@RestController
@RequestMapping("/api/test") // 공통 경로를 클래스 레벨에 지정하여 코드를 간결하게 만듭니다.
public class TestDbController {

    private final DepartmentRepository departmentRepository;

    /**
     * 생성자 주입(Constructor Injection)을 사용하여 DepartmentRepository 의존성을 주입받습니다.
     * @Autowired 어노테이션은 생성자가 하나일 경우 생략 가능하지만, 명시적으로 붙여주는 것이 좋습니다.
     * @param departmentRepository Spring Data JPA가 자동으로 구현체를 생성하여 주입해줍니다.
     */
    @Autowired
    public TestDbController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    /**
     * '/api/test/departments' 경로로 GET 요청이 오면 department 테이블의 모든 데이터를 조회하여 반환합니다.
     * @return 성공 시 DB에서 조회된 학과 목록(JSON 배열)을, 실패 시 에러 메시지를 반환합니다.
     */
    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments() {
        try {
            // JpaRepository에서 제공하는 findAll() 메소드를 호출하여 모든 학과 정보를 조회합니다.
            List<Department> departments = departmentRepository.findAll();
            
            // 조회된 데이터를 HTTP 200 OK 상태와 함께 body에 담아 응답합니다.
            // 데이터가 없으면 빈 배열 "[]"이 반환되며, 이는 정상적인 응답입니다.
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            // 데이터베이스 연결 실패, 테이블 부재 등 쿼리 실행 중 예외가 발생한 경우
            // HTTP 500 Internal Server Error 상태와 함께 에러 메시지를 응답합니다.
            return ResponseEntity.internalServerError().body("DB 연결 또는 쿼리 실행에 실패했습니다: " + e.getMessage());
        }
    }
}