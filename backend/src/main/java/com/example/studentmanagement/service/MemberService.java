package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Department;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository,
                        DepartmentRepository departmentRepository,
                        PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 전체 사용자 목록 조회
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // 타입별 사용자 목록 조회
    public List<Member> getMembersByType(String memberType) {
        return memberRepository.findAll().stream()
                .filter(m -> memberType.equalsIgnoreCase(m.getMemberType()))
                .toList();
    }

    // 특정 사용자 조회 (memberNo로)
    public Member getMemberByMemberNo(String memberNo) {
        return memberRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + memberNo));
    }

    // 새 사용자 생성
    @Transactional
    public Member createMember(
            String memberId,
            String password,
            String name,
            String memberType,
            String memberNo,
            String email,
            String phone,
            String residentNumber,
            String address,
            String deptCode,
            Integer stuGrade,
            String enrollmentStatus,
            String position,
            String officeRoom,
            String majorField) {

        // 중복 체크
        if (memberRepository.findByMemberId(memberId).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다: " + memberId);
        }
        if (memberRepository.findByMemberNo(memberNo).isPresent()) {
            throw new RuntimeException("이미 존재하는 학번/교번입니다: " + memberNo);
        }

        Member member = new Member();
        member.setMemberId(memberId);
        member.setPassword(passwordEncoder.encode(password)); // 비밀번호 암호화
        member.setName(name);
        member.setMemberType(memberType);
        member.setMemberNo(memberNo);
        member.setEmail(email);
        member.setPhone(phone);
        member.setResidentNumber(residentNumber);
        member.setAddress(address);

        // 학과 설정
        if (deptCode != null && !deptCode.isEmpty()) {
            Department dept = departmentRepository.findById(deptCode)
                    .orElseThrow(() -> new RuntimeException("학과를 찾을 수 없습니다: " + deptCode));
            member.setDepartment(dept);
        }

        member.setStuGrade(stuGrade);
        member.setEnrollmentStatus(enrollmentStatus);
        member.setPosition(position);
        member.setOfficeRoom(officeRoom);
        member.setMajorField(majorField);
        member.setStartDate(new Date());

        return memberRepository.save(member);
    }

    // 사용자 정보 수정
    @Transactional
    public Member updateMember(
            String memberNo,
            String name,
            String email,
            String phone,
            String address,
            String deptCode,
            Integer stuGrade,
            String enrollmentStatus,
            String position,
            String officeRoom,
            String majorField) {

        Member member = memberRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + memberNo));

        // 수정 가능한 필드만 업데이트
        if (name != null) member.setName(name);
        if (email != null) member.setEmail(email);
        if (phone != null) member.setPhone(phone);
        if (address != null) member.setAddress(address);

        // 학과 변경
        if (deptCode != null && !deptCode.isEmpty()) {
            Department dept = departmentRepository.findById(deptCode)
                    .orElseThrow(() -> new RuntimeException("학과를 찾을 수 없습니다: " + deptCode));
            member.setDepartment(dept);
        }

        if (stuGrade != null) member.setStuGrade(stuGrade);
        if (enrollmentStatus != null) member.setEnrollmentStatus(enrollmentStatus);
        if (position != null) member.setPosition(position);
        if (officeRoom != null) member.setOfficeRoom(officeRoom);
        if (majorField != null) member.setMajorField(majorField);

        return memberRepository.save(member);
    }

    // 사용자 삭제
    @Transactional
    public void deleteMember(String memberNo) {
        Member member = memberRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + memberNo));
        memberRepository.delete(member);
    }
}
