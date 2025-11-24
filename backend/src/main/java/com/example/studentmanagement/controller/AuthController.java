package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final MemberRepository memberRepository;

    public AuthController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String password = payload.get("password");
        String name = payload.get("name");
        String role = payload.get("role");
        String major = payload.get("major"); // This might need handling with Department entity

        if (memberRepository.findBymId(userId).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 ID입니다.");
        }

        Member member = new Member();
        member.setMId(userId);
        member.setMPwd(password);
        member.setMName(name);
        member.setMType(role);
        // member.setMajorField(major); // Assuming major is stored in major_field or needs Dept code logic

        memberRepository.save(member);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String userId = loginData.get("userId");
        String password = loginData.get("password");

        Member member = memberRepository.findBymId(userId).orElse(null);

        if (member != null && member.getMPwd().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", member.getMId());
            response.put("name", member.getMName());
            response.put("role", member.getMType());
            response.put("major", member.getMajorField());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("ID 또는 비밀번호가 잘못되었습니다.");
        }
    }
}
