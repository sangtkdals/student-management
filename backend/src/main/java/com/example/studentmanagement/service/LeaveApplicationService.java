package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.LeaveApplication;
import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.repository.LeaveApplicationRepository;
import com.example.studentmanagement.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor  // Lombok이 생성자를 자동 생성
public class LeaveApplicationService {
    
    private final LeaveApplicationRepository leaveApplicationRepository;
    private final MemberRepository memberRepository;

    // 모든 휴학 신청 조회
    public List<LeaveApplication> getAllApplications() {
        return leaveApplicationRepository.findAllOrderByApplicationDateDesc();
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
        application.setApprovalStatus("PENDING");  // 초기 상태는 대기중
        
        // 3. 데이터베이스에 저장
        return leaveApplicationRepository.save(application);
    }

    // 승인 처리
    @Transactional  // 데이터베이스 트랜잭션 관리 (실패시 롤백)
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
        
        // 4. 학생의 학적 상태를 LEAVE(휴학)로 변경
        Member student = application.getStudent();
        student.setEnrollmentStatus("LEAVE");
        memberRepository.save(student);
        
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