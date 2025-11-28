package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Tuition;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.TuitionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class TuitionService {

    private final TuitionRepository tuitionRepository;
    private final MemberRepository memberRepository;

    public TuitionService(TuitionRepository tuitionRepository, MemberRepository memberRepository) {
        this.tuitionRepository = tuitionRepository;
        this.memberRepository = memberRepository;
    }

    // 전체 등록금 목록 조회
    public List<Tuition> getAllTuitions() {
        return tuitionRepository.findAllOrderByPaymentAmount();
    }

    // 학생별 등록금 조회
    public List<Tuition> getTuitionsByStudent(String studentNo) {
        return tuitionRepository.findByStudentNo(studentNo);
    }

    // 학기별 등록금 조회
    public List<Tuition> getTuitionsByYearAndSemester(Integer year, Integer semester) {
        return tuitionRepository.findByYearAndSemester(year, semester);
    }

    // 납부상태별 조회
    public List<Tuition> getTuitionsByStatus(String status) {
        return tuitionRepository.findByPaymentStatus(status);
    }

    // 등록금 고지서 생성
    @Transactional
    public Tuition createTuitionBill(
            String studentNo,
            Integer academicYear,
            Integer semester,
            Integer tuitionAmount,
            Integer scholarshipAmount) {

        // 학생 찾기
        Member student = memberRepository.findByMemberNo(studentNo)
                .orElseThrow(() -> new RuntimeException("학생을 찾을 수 없습니다: " + studentNo));

        // 학생인지 확인
        if (!"STUDENT".equalsIgnoreCase(student.getMemberType())) {
            throw new RuntimeException("학생만 등록금 고지가 가능합니다.");
        }

        // 새 등록금 고지서 생성
        Tuition tuition = new Tuition();
        tuition.setStudent(student);
        tuition.setAcademicYear(academicYear);
        tuition.setSemester(semester);
        tuition.setTuitionAmount(tuitionAmount);
        tuition.setScholarshipAmount(scholarshipAmount != null ? scholarshipAmount : 0);
        tuition.setPaidAmount(0);
        tuition.setBillDate(new Date());

        // 납부 기한 설정 (고지일로부터 30일)
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.DAY_OF_MONTH, 30);
        tuition.setDueDate(cal.getTime());

        tuition.setPaymentStatus("UNPAID");

        return tuitionRepository.save(tuition);
    }

    // 납부 확인 처리
    @Transactional
    public Tuition confirmPayment(Integer tuitionId) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new RuntimeException("등록금 내역을 찾을 수 없습니다: " + tuitionId));

        if ("PAID".equals(tuition.getPaymentStatus())) {
            throw new RuntimeException("이미 납부 처리된 내역입니다.");
        }

        // 납부 완료 처리
        tuition.setPaymentStatus("PAID");
        tuition.setPaidDate(new Date());
        tuition.setPaidAmount(tuition.getTuitionAmount() - tuition.getScholarshipAmount());

        return tuitionRepository.save(tuition);
    }

    // 특정 등록금 조회
    public Tuition getTuitionById(Integer tuitionId) {
        return tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new RuntimeException("등록금 내역을 찾을 수 없습니다: " + tuitionId));
    }

    // 등록금 삭제
    @Transactional
    public void deleteTuition(Integer tuitionId) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new RuntimeException("등록금 내역을 찾을 수 없습니다: " + tuitionId));
        tuitionRepository.delete(tuition);
    }
}
