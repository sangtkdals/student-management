package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Department;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.StudentMember;
import com.example.studentmanagement.beans.ProfessorMember;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
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
    private final JwtUtil jwtUtil;

    public AuthController(MemberRepository memberRepository, DepartmentRepository departmentRepository, JwtUtil jwtUtil) {
        this.memberRepository = memberRepository;
        this.departmentRepository = departmentRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        try {
            String userId = payload.get("m_id");
            if (memberRepository.findByMemberId(userId).isPresent()) {
                return ResponseEntity.badRequest().body("이미 존재하는 ID입니다.");
            }

            Member member;
            String mType = payload.get("m_type");

            if ("student".equalsIgnoreCase(mType) || "STUDENT".equalsIgnoreCase(mType)) {
                StudentMember student = new StudentMember();
                if (payload.get("stu_grade") != null && !payload.get("stu_grade").isEmpty()) {
                    student.setStuGrade(Integer.parseInt(payload.get("stu_grade")));
                }
                student.setEnrollmentStatus(payload.get("enrollment_status"));
                member = student;
            } else if ("professor".equalsIgnoreCase(mType) || "PROFESSOR".equalsIgnoreCase(mType)) {
                ProfessorMember professor = new ProfessorMember();
                professor.setPosition(payload.get("position"));
                professor.setOfficeRoom(payload.get("office_room"));
                professor.setMajorField(payload.get("major_field"));
                
                String startDateStr = payload.get("start_date");
                if (startDateStr != null && !startDateStr.isEmpty()) {
                    try {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        Date startDate = sdf.parse(startDateStr);
                        professor.setStartDate(startDate);
                    } catch (ParseException e) {
                        System.err.println("Date parse error: " + e.getMessage());
                    }
                }
                member = professor;
            } else {
                member = new Member();
            }
            
            // Common Fields
            member.setMemberId(userId);
            member.setPassword(payload.get("m_pwd"));
            member.setName(payload.get("m_name"));
            member.setMemberType(mType);
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
            String refreshToken = jwtUtil.createRefreshToken(member.getMemberId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshToken);
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
            if (member instanceof ProfessorMember) {
                response.put("major", ((ProfessorMember) member).getMajorField());
            }
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("ID 또는 비밀번호가 잘못되었습니다.");
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String memberId = request.get("memberId");
        String requestRefreshToken = request.get("refreshToken");

        String storedRefreshToken = jwtUtil.getRefreshToken(memberId);

        if (storedRefreshToken != null && storedRefreshToken.equals(requestRefreshToken)) {
            Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
            String newAccessToken = jwtUtil.generateToken(member.getMemberId(), member.getMemberType(), member.getMemberNo());
            String newRefreshToken = jwtUtil.createRefreshToken(member.getMemberId());
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            response.put("refreshToken", newRefreshToken);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
    }
}
