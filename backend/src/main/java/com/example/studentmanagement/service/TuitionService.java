package com.example.studentmanagement.service;

import com.example.studentmanagement.beans.Member;
import com.example.studentmanagement.beans.Tuition;
import com.example.studentmanagement.dto.TuitionDTO;
import com.example.studentmanagement.repository.MemberRepository;
import com.example.studentmanagement.repository.TuitionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TuitionService {

    private final TuitionRepository tuitionRepository;
    private final MemberRepository memberRepository;

    public TuitionService(TuitionRepository tuitionRepository, MemberRepository memberRepository) {
        this.tuitionRepository = tuitionRepository;
        this.memberRepository = memberRepository;
    }

    // 모든 등록금 조회
    public List<TuitionDTO> getAllTuitions() {
        List<Tuition> tuitions = tuitionRepository.findAll();
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 등록금 ID로 조회
    public TuitionDTO getTuitionById(Integer tuitionId) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new EntityNotFoundException("Tuition not found with id: " + tuitionId));
        return new TuitionDTO(tuition, getStudentName(tuition));
    }

    // 학생별 등록금 조회
    public List<TuitionDTO> getTuitionsByStudent(String studentNo) {
        List<Tuition> tuitions = tuitionRepository.findByStudent_MemberNo(studentNo);
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 학년도 및 학기별 등록금 조회
    public List<TuitionDTO> getTuitionsByAcademicYearAndSemester(Integer academicYear, Integer semester) {
        List<Tuition> tuitions = tuitionRepository.findByAcademicYearAndSemester(academicYear, semester);
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 결제 상태별 등록금 조회
    public List<TuitionDTO> getTuitionsByPaymentStatus(String paymentStatus) {
        List<Tuition> tuitions = tuitionRepository.findByPaymentStatus(paymentStatus);
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 미납 등록금 조회
    public List<TuitionDTO> getUnpaidTuitions() {
        List<Tuition> tuitions = tuitionRepository.findUnpaidTuitions();
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 마감일이 지난 미납 등록금 조회
    public List<TuitionDTO> getOverdueTuitions() {
        List<Tuition> tuitions = tuitionRepository.findOverdueTuitions();
        return tuitions.stream()
                .map(tuition -> new TuitionDTO(tuition, getStudentName(tuition)))
                .collect(Collectors.toList());
    }

    // 등록금 생성
    @Transactional
    public TuitionDTO createTuition(TuitionDTO tuitionDTO) {
        Member student = memberRepository.findByMemberNo(tuitionDTO.getStudentNo())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with number: " + tuitionDTO.getStudentNo()));

        Tuition tuition = new Tuition();
        tuition.setStudent(student);
        tuition.setAcademicYear(tuitionDTO.getAcademicYear());
        tuition.setSemester(tuitionDTO.getSemester());
        tuition.setTuitionAmount(tuitionDTO.getTuitionAmount());
        tuition.setScholarshipAmount(tuitionDTO.getScholarshipAmount());
        tuition.setPaidAmount(tuitionDTO.getPaidAmount());
        tuition.setBillDate(tuitionDTO.getBillDate());
        tuition.setDueDate(tuitionDTO.getDueDate());
        tuition.setPaidDate(tuitionDTO.getPaidDate());
        tuition.setPaymentMethod(tuitionDTO.getPaymentMethod());
        tuition.setReceiptNo(tuitionDTO.getReceiptNo());
        tuition.setPaymentStatus(tuitionDTO.getPaymentStatus());

        Tuition savedTuition = tuitionRepository.save(tuition);
        return new TuitionDTO(savedTuition, getStudentName(savedTuition));
    }

    // 등록금 수정
    @Transactional
    public TuitionDTO updateTuition(Integer tuitionId, TuitionDTO tuitionDTO) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new EntityNotFoundException("Tuition not found with id: " + tuitionId));

        if (tuitionDTO.getStudentNo() != null) {
            Member student = memberRepository.findByMemberNo(tuitionDTO.getStudentNo())
                    .orElseThrow(() -> new EntityNotFoundException("Student not found with number: " + tuitionDTO.getStudentNo()));
            tuition.setStudent(student);
        }

        if (tuitionDTO.getAcademicYear() != null) {
            tuition.setAcademicYear(tuitionDTO.getAcademicYear());
        }
        if (tuitionDTO.getSemester() != null) {
            tuition.setSemester(tuitionDTO.getSemester());
        }
        if (tuitionDTO.getTuitionAmount() != null) {
            tuition.setTuitionAmount(tuitionDTO.getTuitionAmount());
        }
        if (tuitionDTO.getScholarshipAmount() != null) {
            tuition.setScholarshipAmount(tuitionDTO.getScholarshipAmount());
        }
        if (tuitionDTO.getPaidAmount() != null) {
            tuition.setPaidAmount(tuitionDTO.getPaidAmount());
        }
        if (tuitionDTO.getBillDate() != null) {
            tuition.setBillDate(tuitionDTO.getBillDate());
        }
        if (tuitionDTO.getDueDate() != null) {
            tuition.setDueDate(tuitionDTO.getDueDate());
        }
        if (tuitionDTO.getPaidDate() != null) {
            tuition.setPaidDate(tuitionDTO.getPaidDate());
        }
        if (tuitionDTO.getPaymentMethod() != null) {
            tuition.setPaymentMethod(tuitionDTO.getPaymentMethod());
        }
        if (tuitionDTO.getReceiptNo() != null) {
            tuition.setReceiptNo(tuitionDTO.getReceiptNo());
        }
        if (tuitionDTO.getPaymentStatus() != null) {
            tuition.setPaymentStatus(tuitionDTO.getPaymentStatus());
        }

        Tuition updatedTuition = tuitionRepository.save(tuition);
        return new TuitionDTO(updatedTuition, getStudentName(updatedTuition));
    }

    // 등록금 삭제
    @Transactional
    public void deleteTuition(Integer tuitionId) {
        Tuition tuition = tuitionRepository.findById(tuitionId)
                .orElseThrow(() -> new EntityNotFoundException("Tuition not found with id: " + tuitionId));
        tuitionRepository.delete(tuition);
    }

    // 학생 이름 가져오기 헬퍼 메서드
    private String getStudentName(Tuition tuition) {
        if (tuition.getStudent() != null) {
            return tuition.getStudent().getName();
        }
        return null;
    }
}
