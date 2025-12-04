package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.UserManagementDTO;
import com.example.studentmanagement.service.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserManagementController {

    private final UserManagementService userManagementService;

    public AdminUserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    // 사용자 목록 조회 (필터링 포함)
    @GetMapping
    public ResponseEntity<List<UserManagementDTO>> getAllUsers(
            @RequestParam(required = false) String memberType,
            @RequestParam(required = false) String deptCode,
            @RequestParam(required = false) Integer stuGrade,
            @RequestParam(required = false) String searchName) {
        try {
            List<UserManagementDTO> users = userManagementService.getAllUsers(
                    memberType, deptCode, stuGrade, searchName);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 특정 사용자 조회
    @GetMapping("/{memberNo}")
    public ResponseEntity<?> getUserByMemberNo(@PathVariable String memberNo) {
        try {
            UserManagementDTO user = userManagementService.getUserByMemberNo(memberNo);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
