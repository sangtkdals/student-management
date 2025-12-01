package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Department;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.StudentMember;
import com.example.studentmanagement.beans.ProfessorMember;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.StudentMemberRepository;
import com.example.studentmanagement.repository.ProfessorMemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentMemberRepository studentMemberRepository;
    private final ProfessorMemberRepository professorMemberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository,
                        DepartmentRepository departmentRepository,
                        StudentMemberRepository studentMemberRepository,
                        ProfessorMemberRepository professorMemberRepository,
                        PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.departmentRepository = departmentRepository;
        this.studentMemberRepository = studentMemberRepository;
        this.professorMemberRepository = professorMemberRepository;
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

        // Member 먼저 저장
        Member savedMember = memberRepository.save(member);

        // 타입별로 추가 정보 저장
        if ("STUDENT".equalsIgnoreCase(memberType)) {
            StudentMember studentMember = new StudentMember();
            studentMember.setMemberId(savedMember.getMemberId());
            studentMember.setPassword(savedMember.getPassword());
            studentMember.setName(savedMember.getName());
            studentMember.setMemberType(savedMember.getMemberType());
            studentMember.setMemberNo(savedMember.getMemberNo());
            studentMember.setEmail(savedMember.getEmail());
            studentMember.setPhone(savedMember.getPhone());
            studentMember.setResidentNumber(savedMember.getResidentNumber());
            studentMember.setAddress(savedMember.getAddress());
            studentMember.setDepartment(savedMember.getDepartment());
            studentMember.setStuGrade(stuGrade != null ? stuGrade : 1);
            studentMember.setEnrollmentStatus(enrollmentStatus != null ? enrollmentStatus : "ENROLLED");
            return studentMemberRepository.save(studentMember);
        } else if ("PROFESSOR".equalsIgnoreCase(memberType)) {
            ProfessorMember professorMember = new ProfessorMember();
            professorMember.setMemberId(savedMember.getMemberId());
            professorMember.setPassword(savedMember.getPassword());
            professorMember.setName(savedMember.getName());
            professorMember.setMemberType(savedMember.getMemberType());
            professorMember.setMemberNo(savedMember.getMemberNo());
            professorMember.setEmail(savedMember.getEmail());
            professorMember.setPhone(savedMember.getPhone());
            professorMember.setResidentNumber(savedMember.getResidentNumber());
            professorMember.setAddress(savedMember.getAddress());
            professorMember.setDepartment(savedMember.getDepartment());
            professorMember.setPosition(position);
            professorMember.setOfficeRoom(officeRoom);
            professorMember.setMajorField(majorField);
            professorMember.setStartDate(new Date());
            return professorMemberRepository.save(professorMember);
        }

        // ADMIN 타입은 Member 테이블에만 저장
        return savedMember;
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

        // Member 공통 정보 저장
        Member savedMember = memberRepository.save(member);

        // 타입별 추가 정보 수정
        String memberType = member.getMemberType();
        if ("STUDENT".equalsIgnoreCase(memberType)) {
            StudentMember studentMember = studentMemberRepository.findByMemberId(member.getMemberId())
                    .orElseThrow(() -> new RuntimeException("학생 정보를 찾을 수 없습니다."));
            if (stuGrade != null) studentMember.setStuGrade(stuGrade);
            if (enrollmentStatus != null) studentMember.setEnrollmentStatus(enrollmentStatus);
            studentMemberRepository.save(studentMember);
        } else if ("PROFESSOR".equalsIgnoreCase(memberType)) {
            ProfessorMember professorMember = professorMemberRepository.findByMemberId(member.getMemberId())
                    .orElseThrow(() -> new RuntimeException("교수 정보를 찾을 수 없습니다."));
            if (position != null) professorMember.setPosition(position);
            if (officeRoom != null) professorMember.setOfficeRoom(officeRoom);
            if (majorField != null) professorMember.setMajorField(majorField);
            professorMemberRepository.save(professorMember);
        }

        return savedMember;
    }

    // 사용자 삭제
    @Transactional
    public void deleteMember(String memberNo) {
        Member member = memberRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + memberNo));
        memberRepository.delete(member);
    }
}
