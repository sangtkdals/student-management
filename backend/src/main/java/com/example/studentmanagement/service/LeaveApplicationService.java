package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.LeaveApplication;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.StudentMember;
import com.example.studentmanagement.repository.LeaveApplicationRepository;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.StudentMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveApplicationService {

    private final LeaveApplicationRepository leaveApplicationRepository;
    private final MemberRepository memberRepository;
    private final StudentMemberRepository studentMemberRepository;

    // 모든 휴학 신청 조회
    public List<LeaveApplication> getAllApplications() {
        return leaveApplicationRepository.findAllOrderByApplicationDateDesc();
    }

    // 특정 학생의 휴학 신청 내역 조회
    public List<LeaveApplication> getMyApplications(String studentNo) {
        return leaveApplicationRepository.findByStudentMemberNoOrderByApplicationDateDesc(studentNo);
    }

    // 휴학 신청 생성 (학생이 제출)
    @Transactional
    public LeaveApplication createApplication(
            String studentNo,
            String leaveType,
            Integer startYear,
            Integer startSemester,
            Integer endYear,
            Integer endSemester,
            String reason) {

        // 1. 학생 찾기
        Member student = memberRepository.findByMemberNo(studentNo)
            .orElseThrow(() -> new RuntimeException("학생을 찾을 수 없습니다."));

        // 2. 새 휴학 신청 객체 생성
        LeaveApplication application = new LeaveApplication();
        application.setStudent(student);
        application.setLeaveType(leaveType);
        application.setStartYear(startYear);
        application.setStartSemester(startSemester);
        application.setEndYear(endYear);
        application.setEndSemester(endSemester);
        application.setApplicationReason(reason);
        application.setApplicationDate(new Date());
        application.setApprovalStatus("PENDING");

        // 3. 데이터베이스에 저장
        return leaveApplicationRepository.save(application);
    }

    // 복학 신청 생성 (학생이 제출)
    @Transactional
    public LeaveApplication createReturnApplication(
            String studentNo,
            Integer returnYear,
            Integer returnSemester,
            String reason) {

        // 1. 학생 찾기
        Member student = memberRepository.findByMemberNo(studentNo)
            .orElseThrow(() -> new RuntimeException("학생을 찾을 수 없습니다."));

        // 2. StudentMember에서 휴학 중인지 확인
        StudentMember studentMember = studentMemberRepository.findByMemberId(student.getMemberId())
            .orElseThrow(() -> new RuntimeException("학생 정보를 찾을 수 없습니다."));

        if (!"LEAVE".equals(studentMember.getEnrollmentStatus())) {
            throw new RuntimeException("휴학 중인 학생만 복학 신청이 가능합니다.");
        }

        // 3. 새 복학 신청 객체 생성
        LeaveApplication application = new LeaveApplication();
        application.setStudent(student);
        application.setLeaveType("RETURN");
        application.setStartYear(returnYear);
        application.setStartSemester(returnSemester);
        application.setEndYear(null);
        application.setEndSemester(null);
        application.setApplicationReason(reason);
        application.setApplicationDate(new Date());
        application.setApprovalStatus("PENDING");

        // 4. 데이터베이스에 저장
        return leaveApplicationRepository.save(application);
    }

    // 휴학중인 학생 목록 조회
    public List<Member> getStudentsOnLeave() {
        List<StudentMember> studentMembers = studentMemberRepository.findStudentsOnLeave();

        // StudentMember의 memberId로 Member 조회
        return studentMembers.stream()
            .map(sm -> memberRepository.findById(sm.getMemberId())
                .orElse(null))
            .filter(m -> m != null)
            .collect(Collectors.toList());
    }

    // 복학 처리
    @Transactional
    public Member processReturnToSchool(String studentNo, String approverId) {
        // 학생 찾기
        Member student = memberRepository.findByMemberNo(studentNo)
            .orElseThrow(() -> new RuntimeException("학생을 찾을 수 없습니다."));

        // StudentMember 찾기
        StudentMember studentMember = studentMemberRepository.findByMemberId(student.getMemberId())
            .orElseThrow(() -> new RuntimeException("학생 정보를 찾을 수 없습니다."));

        // 학적 상태를 ENROLLED로 변경
        if (!"LEAVE".equals(studentMember.getEnrollmentStatus())) {
            throw new RuntimeException("휴학 중인 학생이 아닙니다.");
        }

        studentMember.setEnrollmentStatus("ENROLLED");
        studentMemberRepository.save(studentMember);

        return student;
    }

    // 승인 처리
    @Transactional
    public LeaveApplication approveApplication(Integer applicationId, String approverId) {
        // 1. 신청 내역 찾기
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));

        // 2. 승인자(관리자) 찾기
        Member approver = memberRepository.findByMemberNo(approverId)
            .orElseThrow(() -> new RuntimeException("승인자를 찾을 수 없습니다."));

        // 3. 신청 상태를 APPROVED로 변경
        application.setApprovalStatus("APPROVED");
        application.setApprovalDate(new Date());
        application.setApprover(approver);

        // 4. 학생의 학적 상태 변경
        Member student = application.getStudent();
        StudentMember studentMember = studentMemberRepository.findByMemberId(student.getMemberId())
            .orElseThrow(() -> new RuntimeException("학생 정보를 찾을 수 없습니다."));

        if ("RETURN".equals(application.getLeaveType())) {
            // 복학 승인: LEAVE → ENROLLED
            studentMember.setEnrollmentStatus("ENROLLED");
        } else {
            // 휴학 승인: ENROLLED → LEAVE
            studentMember.setEnrollmentStatus("LEAVE");
        }

        studentMemberRepository.save(studentMember);

        // 5. 변경사항 저장
        return leaveApplicationRepository.save(application);
    }

    // 거절 처리
    @Transactional
    public LeaveApplication rejectApplication(Integer applicationId, String approverId, String rejectReason) {
        // 1. 신청 내역 찾기
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다."));

        // 2. 승인자(관리자) 찾기
        Member approver = memberRepository.findByMemberNo(approverId)
            .orElseThrow(() -> new RuntimeException("승인자를 찾을 수 없습니다."));

        // 3. 신청 상태를 REJECTED로 변경
        application.setApprovalStatus("REJECTED");
        application.setApprovalDate(new Date());
        application.setApprover(approver);
        application.setRejectReason(rejectReason);

        // 4. 변경사항 저장 (학생의 학적 상태는 변경하지 않음)
        return leaveApplicationRepository.save(application);
    }
}
