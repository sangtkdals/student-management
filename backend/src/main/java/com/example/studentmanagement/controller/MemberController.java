package com.example.studentmanagement.controller;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.service.MemberService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // GET /api/members - 전체 사용자 목록 조회 (필터링 옵션)
    @GetMapping
    public ResponseEntity<List<MemberDTO>> getAllMembers(
            @RequestParam(required = false) String memberType) {

        List<Member> members;
        if (memberType != null && !memberType.isEmpty()) {
            members = memberService.getMembersByType(memberType);
        } else {
            members = memberService.getAllMembers();
        }

        List<MemberDTO> dtos = members.stream()
                .map(this::convertToDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // GET /api/members/{memberNo} - 특정 사용자 조회
    @GetMapping("/{memberNo}")
    public ResponseEntity<MemberDTO> getMember(@PathVariable("memberNo") String memberNo) {
        Member member = memberService.getMemberByMemberNo(memberNo);
        return ResponseEntity.ok(convertToDTO(member));
    }

    // POST /api/members - 새 사용자 추가
    @PostMapping
    public ResponseEntity<MemberDTO> createMember(@RequestBody CreateMemberRequest request) {
        Member created = memberService.createMember(
                request.getMemberId(),
                request.getPassword(),
                request.getName(),
                request.getMemberType(),
                request.getMemberNo(),
                request.getEmail(),
                request.getPhone(),
                request.getResidentNumber(),
                request.getAddress(),
                request.getDeptCode(),
                request.getStuGrade(),
                request.getEnrollmentStatus(),
                request.getPosition(),
                request.getOfficeRoom(),
                request.getMajorField()
        );
        return ResponseEntity.ok(convertToDTO(created));
    }

    // PUT /api/members/{memberNo} - 사용자 정보 수정
    @PutMapping("/{memberNo}")
    public ResponseEntity<MemberDTO> updateMember(
            @PathVariable("memberNo") String memberNo,
            @RequestBody UpdateMemberRequest request) {

        Member updated = memberService.updateMember(
                memberNo,
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress(),
                request.getDeptCode(),
                request.getStuGrade(),
                request.getEnrollmentStatus(),
                request.getPosition(),
                request.getOfficeRoom(),
                request.getMajorField()
        );

        return ResponseEntity.ok(convertToDTO(updated));
    }

    // DELETE /api/members/{memberNo} - 사용자 삭제
    @DeleteMapping("/{memberNo}")
    public ResponseEntity<Void> deleteMember(@PathVariable("memberNo") String memberNo) {
        memberService.deleteMember(memberNo);
        return ResponseEntity.noContent().build();
    }

    // Member -> MemberDTO 변환
    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setMemberId(member.getMemberId());
        dto.setName(member.getName());
        dto.setMemberType(member.getMemberType());
        dto.setMemberNo(member.getMemberNo());
        dto.setEmail(member.getEmail());
        dto.setPhone(member.getPhone());
        dto.setAddress(member.getAddress());
        dto.setDeptCode(member.getDepartment() != null ? member.getDepartment().getDeptCode() : null);
        dto.setDeptName(member.getDepartment() != null ? member.getDepartment().getDeptName() : null);
        dto.setStuGrade(member.getStuGrade());
        dto.setEnrollmentStatus(member.getEnrollmentStatus());
        dto.setPosition(member.getPosition());
        dto.setOfficeRoom(member.getOfficeRoom());
        dto.setMajorField(member.getMajorField());
        dto.setStartDate(member.getStartDate());
        return dto;
    }

    // DTO 클래스들
    @Data
    static class MemberDTO {
        private String memberId;
        private String name;
        private String memberType;
        private String memberNo;
        private String email;
        private String phone;
        private String address;
        private String deptCode;
        private String deptName;
        private Integer stuGrade;
        private String enrollmentStatus;
        private String position;
        private String officeRoom;
        private String majorField;
        private java.util.Date startDate;
    }

    @Data
    static class CreateMemberRequest {
        private String memberId;
        private String password;
        private String name;
        private String memberType;
        private String memberNo;
        private String email;
        private String phone;
        private String residentNumber;
        private String address;
        private String deptCode;
        private Integer stuGrade;
        private String enrollmentStatus;
        private String position;
        private String officeRoom;
        private String majorField;
    }

    @Data
    static class UpdateMemberRequest {
        private String name;
        private String email;
        private String phone;
        private String address;
        private String deptCode;
        private Integer stuGrade;
        private String enrollmentStatus;
        private String position;
        private String officeRoom;
        private String majorField;
    }
}
