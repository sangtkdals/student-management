package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.service.ProfileService;
import com.example.studentmanagement.dto.ProfileUpdateDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateDTO updateRequest, Principal principal) {
        String memberId = principal.getName(); 

        try {
            Member updatedDetails = new Member();
            
            updatedDetails.setEmail(updateRequest.getEmail());
            updatedDetails.setPhone(updateRequest.getPhone());
            updatedDetails.setAddress(updateRequest.getAddress());
            
            String newPassword = updateRequest.getNewPassword();
            if (newPassword != null && !newPassword.isEmpty()) {
                updatedDetails.setPassword(newPassword);
            }

            Member savedMember = profileService.updateMemberProfile(memberId, updatedDetails);
            
            return ResponseEntity.ok(Map.of("message", "프로필 정보가 성공적으로 업데이트되었습니다.", "memberId", savedMember.getMemberId()));

        } catch (Exception e) {
            // 예외 발생 시 400 Bad Request 또는 500 Internal Server Error 반환
            // DTO를 사용했음에도 400이 발생하면 서버 로그를 확인하여 JSON 파싱 실패 이유를 찾아야 합니다.
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}