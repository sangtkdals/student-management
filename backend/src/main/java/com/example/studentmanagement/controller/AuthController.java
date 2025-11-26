package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Department;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.RefreshToken;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.RefreshTokenRepository;
import com.example.studentmanagement.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final MemberRepository memberRepository;
    private final DepartmentRepository departmentRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    public AuthController(MemberRepository memberRepository, DepartmentRepository departmentRepository, RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil) {
        this.memberRepository = memberRepository;
        this.departmentRepository = departmentRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        try {
            String userId = payload.get("m_id");
            if (memberRepository.findByMemberId(userId).isPresent()) {
                return ResponseEntity.badRequest().body("이미 존재하는 ID입니다.");
            }

            Member member = new Member();
            
            // Common Fields
            member.setMemberId(userId);
            member.setPassword(payload.get("m_pwd"));
            member.setName(payload.get("m_name"));
            member.setMemberType(payload.get("m_type")); // "student" or "professor"
            member.setMemberNo(payload.get("m_no"));
            member.setEmail(payload.get("m_email"));
            member.setPhone(payload.get("m_phone"));
            member.setResidentNumber(payload.get("m_num"));
            member.setAddress(payload.get("m_addr"));
            
            // Department
            String deptCode = payload.get("dept_code");
            if (deptCode != null && !deptCode.isEmpty()) {
                Department dept = departmentRepository.findById(deptCode).orElse(null);
                member.setDepartment(dept);
            }

            // Student Specific
            if ("student".equalsIgnoreCase(payload.get("m_type"))) {
                if (payload.get("stu_grade") != null && !payload.get("stu_grade").isEmpty()) {
                    member.setStuGrade(Integer.parseInt(payload.get("stu_grade")));
                }
                member.setEnrollmentStatus(payload.get("enrollment_status"));
            }

            // Professor Specific
            if ("professor".equalsIgnoreCase(payload.get("m_type"))) {
                member.setPosition(payload.get("position"));
                member.setOfficeRoom(payload.get("office_room"));
                member.setMajorField(payload.get("major_field"));
                
                String startDateStr = payload.get("start_date");
                if (startDateStr != null && !startDateStr.isEmpty()) {
                    try {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        Date startDate = sdf.parse(startDateStr);
                        member.setStartDate(startDate);
                    } catch (ParseException e) {
                        // ignore or log
                        System.err.println("Date parse error: " + e.getMessage());
                    }
                }
            }

            memberRepository.save(member);
            return ResponseEntity.ok("회원가입 성공");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String userId = loginData.get("m_id");
        String password = loginData.get("m_pwd");

        Member member = memberRepository.findByMemberId(userId).orElse(null);

        if (member != null && member.getPassword().equals(password)) {
            String token = jwtUtil.generateToken(member.getMemberId(), member.getMemberType(), member.getMemberNo());
            RefreshToken refreshToken = jwtUtil.createRefreshToken(member);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshToken.getToken());
            response.put("userId", member.getMemberId());
            response.put("memberNo", member.getMemberNo());
            response.put("name", member.getName());
            response.put("role", member.getMemberType());
            response.put("email", member.getEmail());
            
            if (member.getDepartment() != null) {
                response.put("deptCode", member.getDepartment().getDeptCode());
                response.put("departmentName", member.getDepartment().getDeptName());
            }
            
            // Additional fields based on role
            if ("professor".equalsIgnoreCase(member.getMemberType())) {
                response.put("major", member.getMajorField());
            }
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("ID 또는 비밀번호가 잘못되었습니다.");
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestRefreshToken = request.get("refreshToken");

        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(jwtUtil::verifyRefreshTokenExpiration)
                .map(RefreshToken::getMember)
                .map(member -> {
                    String newAccessToken = jwtUtil.generateToken(member.getMemberId(), member.getMemberType(), member.getMemberNo());
                    RefreshToken newRefreshToken = jwtUtil.createRefreshToken(member);
                    Map<String, String> response = new HashMap<>();
                    response.put("accessToken", newAccessToken);
                    response.put("refreshToken", newRefreshToken.getToken());
                    return ResponseEntity.ok(response);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
